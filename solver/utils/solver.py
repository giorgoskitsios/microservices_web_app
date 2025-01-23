from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp
from math import radians, sin, cos, sqrt, atan2


class DistanceMatrixSolver:
    """
    This class solves the Vehicle Routing Problem (VRP) with distance constraints.
    """

    def __init__(self):
        self.data = {}
        self.manager = None
        self.routing = None

    def haversine_distance(self, lat1, lon1, lat2, lon2):
        """
        Calculates the great-circle distance between two points on the Earth's surface.
        """
        # Convert latitude and longitude from degrees to radians
        lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
        # Haversine formula
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
        c = 2 * atan2(sqrt(a), sqrt(1 - a))
        distance = 6371 * c  # Earth radius in kilometers
        return int(round(1000 * distance))

    def calculate_distance_matrix(self, locations):
        """
        Calculates distance matrix based on Manhattan distance.
        """
        num_locations = len(locations)
        distance_matrix = [[0] * num_locations for _ in range(num_locations)]
        for i in range(num_locations):
            for j in range(num_locations):
                lat1, lon1 = locations[i]["latitude"], locations[i]["longitude"]
                lat2, lon2 = locations[j]["latitude"], locations[j]["longitude"]
                distance_matrix[i][j] = self.haversine_distance(lat1, lon1, lat2, lon2)
        return distance_matrix

    def create_data_model(self, locations, num_vehicles, depot):
        """
        Stores the data for the problem.
        """
        self.data["distance_matrix"] = self.calculate_distance_matrix(locations)
        self.data["num_vehicles"] = num_vehicles
        self.data["depot"] = depot

    def distance_callback(self, from_index, to_index):
        """
        Returns the distance between the two nodes.
        """
        # Convert from routing variable Index to distance matrix NodeIndex.
        from_node = self.manager.IndexToNode(from_index)
        to_node = self.manager.IndexToNode(to_index)
        return self.data["distance_matrix"][from_node][to_node]

    def format_solution(self, solution, max_distance):
        """
        Constructs the solution in the specified dictionary format.
        """
        total_distance = 0
        max_route_distance = 0
        vehicles = []

        for vehicle_id in range(self.data["num_vehicles"]):
            index = self.routing.Start(vehicle_id)
            plan = []
            route_distance = 0

            while not self.routing.IsEnd(index):
                plan.append(self.manager.IndexToNode(index))
                previous_index = index
                index = solution.Value(self.routing.NextVar(index))
                route_distance += self.routing.GetArcCostForVehicle(
                    previous_index, index, vehicle_id
                )

            plan.append(self.manager.IndexToNode(index))
            vehicles.append({"plan": plan, "dist": route_distance})
            max_route_distance = max(route_distance, max_route_distance)
            total_distance += route_distance

        return {
            "objective": solution.ObjectiveValue(),
            "max_distance": max_route_distance,
            "vehicles": vehicles,
        }

    def solve(self, locations, num_vehicles, depot, max_distance):
        """
        Solves the VRP problem and returns the solution or None if no solution found.
        """
        self.create_data_model(locations, num_vehicles, depot)
        # Create the routing index manager.
        self.manager = pywrapcp.RoutingIndexManager(
            len(self.data["distance_matrix"]),
            self.data["num_vehicles"],
            self.data["depot"],
        )
        # Create Routing Model.
        self.routing = pywrapcp.RoutingModel(self.manager)
        # Create and register a transit callback.
        transit_callback_index = self.routing.RegisterTransitCallback(
            self.distance_callback
        )
        # Define cost of each arc.
        self.routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)
        # Add Distance constraint.
        dimension_name = "Distance"
        self.routing.AddDimension(
            transit_callback_index, 0, max_distance, True, dimension_name
        )
        distance_dimension = self.routing.GetDimensionOrDie(dimension_name)
        distance_dimension.SetGlobalSpanCostCoefficient(100)
        # Setting first solution heuristic.
        search_parameters = pywrapcp.DefaultRoutingSearchParameters()
        search_parameters.first_solution_strategy = (
            routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
        )
        # Solve the problem.
        solution = self.routing.SolveWithParameters(search_parameters)
        return self.format_solution(solution, max_distance) if solution else None
