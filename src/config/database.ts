import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

// Create query log stream
const queryLogStream = fs.createWriteStream(
    path.join(logsDir, 'query.log'),
    { flags: 'a' }
);

export const connectDatabase = async (): Promise<void> => {
    try {
        // Enable query logging
        mongoose.set('debug', (collectionName: string, method: string, query: any, doc: any) => {
            const timestamp = new Date().toISOString();
            const logMessage = `${timestamp} - ${collectionName}.${method}(${JSON.stringify(query)}) - ${JSON.stringify(doc)}\n`;
            
            // Log to file
            queryLogStream.write(logMessage);
            
            // Log to console in development
            if (process.env.NODE_ENV === 'development') {
                console.log(`MongoDB Query: ${collectionName}.${method}`);
                console.log('Query:', query);
                console.log('Doc:', doc);
                console.log('-------------------');
            }
        });

        mongoose.set('strictQuery', false);

        const options = {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };

        const dbUrl = process.env.MONGODB_URI ||  'mongodb://127.0.0.1:27017/development_db';

        await mongoose.connect(dbUrl, options);
        console.log('Success', 'Connected to MongoDB successfully');
    } catch (error) {
        console.error('Failed', 'MongoDB connection error:', error);
        process.exit(1);
    }
};

// Handle database connection events
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('error', (error) => {
  console.error('MongoDB error:', error);
}); 