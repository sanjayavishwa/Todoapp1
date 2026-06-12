import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js'; // ✅ FIXED
import todoRoutes from './routes/todo.route.js'; // ✅ FIXED
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors({                        // ← ADD THIS
  origin: 'http://localhost:5173'
}));

app.use(express.json());    

app.use("/api/todos", todoRoutes);

// ✅ Better to connect BEFORE starting server
connectDB();

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

app.get('/', (req, res) => {
  res.send('Backend is running');
});