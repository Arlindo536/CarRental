const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Car = require('./backend/models/Car');
const User = require('./backend/models/User');
const connectDB = require('./backend/config/db');

// Load env vars
dotenv.config();

// Connect to DB
connectDB();

// Import data from your frontend script.js
const cars = [
  {
    name: 'Toyota Corolla',
    type: 'ekonomik',
    year: 2022,
    passengers: 5,
    transmission: 'Automatike',
    luggage: 2,
    price: 35,
    image: 'toyota-corolla.jpg',
    features: ['Klimë', 'Bluetooth', 'Kamera Parkimi']
  },
  {
    name: 'Mercedes C-Class',
    type: 'luksoz',
    year: 2023,
    passengers: 5,
    transmission: 'Automatike',
    luggage: 3,
    price: 75,
    image: 'mercedes-c-class.jpg',
    features: ['Klimë', 'Navigacion', 'Sedilje Lëkure', 'Kamera Parkimi']
  },
  {
    name: 'Volkswagen Tiguan',
    type: 'suv',
    year: 2022,
    passengers: 5,
    transmission: 'Automatike',
    luggage: 4,
    price: 65,
    image: 'vw-tiguan.jpg',
    features: ['Klimë', 'Navigacion', 'Sensorë Parkimi', '4x4']
  },
  {
    name: 'Dacia Duster',
    type: 'suv',
    year: 2021,
    passengers: 5,
    transmission: 'Manuale',
    luggage: 3,
    price: 40,
    image: 'dacia-duster.jpg',
    features: ['Klimë', 'Bluetooth', 'Sensorë Parkimi']
  },
  {
    name: 'Fiat 500',
    type: 'ekonomik',
    year: 2022,
    passengers: 4,
    transmission: 'Manuale',
    luggage: 1,
    price: 30,
    image: 'fiat-500.jpg',
    features: ['Klimë', 'Bluetooth']
  },
  {
    name: 'BMW X5',
    type: 'luksoz',
    year: 2023,
    passengers: 7,
    transmission: 'Automatike',
    luggage: 5,
    price: 90,
    image: 'bmw-x5.jpg',
    features: ['Klimë', 'Navigacion', 'Sedilje Lëkure', 'Kamera 360']
  }
  // Add more cars as needed from your script.js
];

// Import data
const importData = async () => {
  try {
    // Clear existing data
    await Car.deleteMany();

    // Create admin user
    const adminUser = await User.findOneAndUpdate(
      { email: 'admin@example.com' },
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        isAdmin: true
      },
      { upsert: true, new: true }
    );

    // Create cars
    await Car.insertMany(cars);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

// Delete data
const destroyData = async () => {
  try {
    await Car.deleteMany();
    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

// Command line arguments
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}