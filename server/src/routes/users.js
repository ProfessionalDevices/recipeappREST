import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserModel } from '../models/Users.js';

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Check if username already exists
  const user = await UserModel.findOne({ username: username });

  if (user) {
    return res.json({ message: 'Username already exists' });
  }
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  // Create a new user
  const newUser = new UserModel({
    username: username,
    password: hashedPassword,
  });
  // Save the user to the database
  await newUser.save();

  res.json({ message: 'User created successfully' });
});

// Login a user
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Check if username exists
  const user = await UserModel.findOne({ username: username });

  if (!user) {
    return res.json({ message: "User doesn't exist" });
  }

  // Compare the password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.json({ message: 'Invalid password' });
  }

  // Generate a token
  const token = jwt.sign({ id: user._id }, 'secret');
  res.json({ token: token, userID: user._id });
});

export { router as userRouter };

//middleware for verifying token
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, 'secret', (err) => {
      if (err) return res.sendStatus(403);
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
