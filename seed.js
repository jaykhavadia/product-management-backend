const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const seedData = async () => {
  await connectDB();

  try {
    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();

    // Create users
    const hashedPassword = await bcrypt.hash('password123', 10);
    const users = await User.insertMany([
      {
        name: 'Super User',
        email: 'superuser@example.com',
        password: hashedPassword,
        role: 'superuser',
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
        role: 'user',
      },
    ]);

    console.log('Users seeded');

    // Create products
    const products = await Product.insertMany([
      {
        name: 'Sample Product 1',
        image: '/images/test1.png',
        productCode: 'SP001',
        price: 100,
        category: 'Electronics',
        manufactureDate: new Date('2024-01-01'),
        expiryDate: new Date('2026-01-01'),
        owner: users[1]._id,
      },
      {
        name: 'Sample Product 2',
        image: '/images/test2.png',
        productCode: 'SP002',
        price: 250,
        category: 'Clothing',
        manufactureDate: new Date('2024-03-10'),
        expiryDate: new Date('2025-10-15'),
        owner: users[0]._id,
      },
    ]);

    console.log('Products seeded');
    process.exit();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

seedData();