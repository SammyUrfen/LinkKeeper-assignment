import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/mongodb.js';
import authRouter from './routes/auth.routes.js';
import linkRouter from './routes/link.routes.js';
import cookieParser from "cookie-parser";


dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;
connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
// Routes
app.use('/api/auth', authRouter);
app.use('/api/links', linkRouter);