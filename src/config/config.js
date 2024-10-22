import dotenv from 'dotenv';
dotenv.config();
export default {
    HOST: process.env.HOST || 'Do not find host in .env',
    PORT: process.env.PORT,
    API_URL: process.env.API_URL || '/api/v1',
    
    CONNECTION_STRING: process.env.CONNECTION_STRING,
    DATABASE: process.env.DATABASE,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_USER: process.env.DB_USER,
}