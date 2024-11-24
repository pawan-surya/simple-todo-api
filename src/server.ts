import express from 'express';
import cors from 'cors';
import { config } from './config/config';
import { connectDatabase } from './config/database';
import { requestLogger, errorLogger, developmentLogger } from './services/logger.service';


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(developmentLogger);
}
app.use(requestLogger);
app.use(errorLogger);

// Store response body for logging
app.use((req, res, next) => {
    const oldSend = res.send;
    res.send = function (data) {
        (res as any)._responseBody = data;
        return oldSend.apply(res, arguments as any);
    };
    next();
});


// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
    });
});

// Connect to database and start server
const startServer = async () => {
    try {
        await connectDatabase();
        const PORT = config.server.port;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT} in ${config.server.nodeEnv} mode`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer(); 