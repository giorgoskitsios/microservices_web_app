export function checkEnvVariables() {
    const requiredEnvVars = ['NODE_ENV', 'MONGO_DB_URI', 'PORT'];

    if (process.env.NODE_ENV === 'development') {
        requiredEnvVars.push('RABBITMQ_URL_DEV');
    } else if (process.env.NODE_ENV === 'production') {
        requiredEnvVars.push('RABBITMQ_URL_PROD');
    }

    requiredEnvVars.forEach((envVar) => {
        if (!process.env[envVar]) {
            throw new Error(`${envVar} is not defined in the environment.`);
        }
    });
}