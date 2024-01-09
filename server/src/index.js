import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import { userRouter } from './routes/users.js';
import { recipesRouter } from './routes/recipes.js';

const app = express();

// Use the json middleware to parse the request body
app.use(express.json());
// Use the cors middleware to enable cross origin resource sharing
app.use(cors());

app.use('/auth', userRouter);
app.use('/recipes', recipesRouter);

// Connect to the MongoDB database using the mongoose library
mongoose.connect(
  'mongodb+srv://castielloluigi89:prignambollo123@recipes.zxxgfgf.mongodb.net/recipes?retryWrites=true&w=majority'
);

// Start the server on port 3001
app.listen(3001, () => console.log('Server running on port 3001'));
