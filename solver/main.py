import functools
import logging
import threading
import time
from utils.solver import DistanceMatrixSolver
import pika
from flask import Flask
import json
from time import time
import os
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def ack_message(ch, delivery_tag, data):
    ch.basic_publish(exchange="solution_create", routing_key="", body=json.dumps(data))
    if ch.is_open:
        ch.basic_ack(delivery_tag)
    else:
        logger.info("hello")
        pass


def do_work(conn, ch, delivery_tag, body: bytes):
    try:
        data = json.loads(body.decode())
        solver = DistanceMatrixSolver()

        start = time()
        solution = solver.solve(
            data["locations"],
            data["numVehicles"],
            data["depot"],
            data["maxDistance"],
        )
        duration = time() - start

        publish_data = {
            "submit_id": data["submitId"],
            "has_solution": bool(solution),
            "solution": solution,
            "duration": duration,
            "user_id": data["userId"],
        }

        logger.info("Data : %s", publish_data)

        cb = functools.partial(ack_message, ch, delivery_tag, publish_data)
        conn.add_callback_threadsafe(cb)
    except Exception as e:
        logger.error(f"Error processing message: {e}")


def on_message(ch, method_frame, _header_frame, body, args):
    (conn, thrds) = args
    delivery_tag = method_frame.delivery_tag
    t = threading.Thread(target=do_work, args=(conn, ch, delivery_tag, body))
    t.start()
    thrds.append(t)


env = os.getenv("ENV", "development")
rabbitmq_url = (
    os.getenv("RABBITMQ_URL_DEV")
    if env == "development"
    else os.getenv("RABBITMQ_URL_PROD")
)

parsed_url = rabbitmq_url.split("://")[1].split("@")
credentials = pika.PlainCredentials(*parsed_url[0].split(":"))
rabbitmq_host = parsed_url[1].split(":")[0]
rabbitmq_port = (
    parsed_url[1].split(":")[1] if len(parsed_url[1].split(":")) > 1 else 5672
)

parameters = pika.ConnectionParameters(
    host=rabbitmq_host, port=int(rabbitmq_port), credentials=credentials, heartbeat=5
)


# credentials = pika.PlainCredentials("guest", "guest")
# parameters = pika.ConnectionParameters(
#    "localhost", credentials=credentials, heartbeat=5
# )
connection = pika.BlockingConnection(parameters)

channel = connection.channel()
channel.exchange_declare(
    exchange="solution_create",
    exchange_type="fanout",
    durable=True,
)
channel.queue_declare(queue="solver:problem_create", durable=True)
channel.queue_bind(
    queue="solver:problem_create", exchange="problem_create", routing_key=""
)
channel.basic_qos(prefetch_count=1)

threads = []
on_message_callback = functools.partial(on_message, args=(connection, threads))
channel.basic_consume("solver:problem_create", on_message_callback)

try:
    channel.start_consuming()
except KeyboardInterrupt:
    channel.stop_consuming()

# Wait for all to complete
for thread in threads:
    thread.join()

connection.close()

app = Flask(__name__)
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5003, debug=True)
