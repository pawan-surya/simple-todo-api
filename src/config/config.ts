import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const config = {
  // Server configuration
  server: {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
  },

  // Database configuration
  database: {
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017/development_db',
  },

  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-default-secret-key',
    expiresIn: '24h',
  },

  // CORS configuration
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  },

  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  }
}; 