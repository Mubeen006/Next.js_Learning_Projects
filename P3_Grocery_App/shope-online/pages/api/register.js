import dbConnect from '../../lib/db';
import User from '../../models/User';
import { hashPassword } from '../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, password, address, phoneNumber } = req.body;

  if (!name || !email || !password) {
    return res.status(422).json({ message: 'Invalid input' });
  }

  await dbConnect();

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(422).json({ message: 'User already exists' });
  }

  // Create new user
  const user = await User.create({
    name,
    email,
    password,
    address,
    phoneNumber,
  });

  res.status(201).json({ message: 'User created!', userId: user._id });
} 