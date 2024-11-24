import fs from 'fs';
import path from 'path';
import morgan from 'morgan';
import { Request, Response } from 'express';

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

// Create write streams
const accessLogStream = fs.createWriteStream(
    path.join(logsDir, 'access.log'),
    { flags: 'a' }
);

const errorLogStream = fs.createWriteStream(
    path.join(logsDir, 'error.log'),
    { flags: 'a' }
);

// Custom token for request body
morgan.token('body', (req: Request) => JSON.stringify(req.body));

// Custom token for response body
morgan.token('response-body', (req: Request, res: Response) => {
    const response = (res as any)._responseBody;
    return response ? JSON.stringify(response) : '-';
});

// API request logger
export const requestLogger = morgan(
    ':method :url :status :response-time ms - :body - :response-body',
    {
        stream: accessLogStream,
        skip: (req: Request, res: Response) => res.statusCode >= 400
    }
);

// API error logger
export const errorLogger = morgan(
    ':method :url :status :response-time ms - :body - :response-body',
    {
        stream: errorLogStream,
        skip: (req: Request, res: Response) => res.statusCode < 400
    }
);

// Console logger for development
export const developmentLogger = morgan(
    '\x1b[33m:method\x1b[0m \x1b[36m:url\x1b[0m :status :response-time ms',
    {
        skip: (req: Request, res: Response) => false // Log all requests in development
    }
);

// Custom console colors for different status codes
morgan.token('status-colored', (req: Request, res: Response) => {
    const status = res.statusCode;
    let color = '\x1b[32m'; // Green for success

    if (status >= 400) color = '\x1b[31m'; // Red for error
    else if (status >= 300) color = '\x1b[33m'; // Yellow for redirect

    return `${color}${status}\x1b[0m`;
});

// Custom date format
morgan.token('date-custom', () => {
    return new Date().toISOString();
});

// Extended console logger with more details
export const detailedLogger = morgan(
    ':date-custom [:status-colored] :method :url - :response-time ms - :body',
    {
        immediate: false,
        skip: (req: Request, res: Response) => false
    }
);

// Interface for extended Response
interface ExtendedResponse extends Response {
    _responseBody?: any;
}

// Middleware to capture response body
export const captureResponseBody = (req: Request, res: ExtendedResponse, next: Function) => {
    const oldSend = res.send;
    res.send = function(data: any): Response {
        res._responseBody = data;
        return oldSend.apply(res, arguments as any);
    };
    next();
}; 