const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Car = require('./models/Car');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

// Initial car data (based on your frontend/js/script.js)
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
  },
  {
    name: 'Audi A4',
    type: 'luksoz',
    year: 2022,
    passengers: 5,
    transmission: 'Automatike',
    luggage: 3,
    price: 70,
    image: 'audi-a4.jpg',
    features: ['Klimë', 'Navigacion', 'Sedilje Lëkure', 'Bluetooth']
  },
  {
    name: 'Skoda Octavia',
    type: 'ekonomik',
    year: 2021,
    passengers: 5,
    transmission: 'Automatike',
    luggage: 3,
    price: 45,
    image: 'skoda-octavia.jpg',
    features: ['Klimë', 'Bluetooth', 'Android Auto']
  },
  {
    name: 'Hyundai Tucson',
    type: 'suv',
    year: 2023,
    passengers: 5,
    transmission: 'Automatike',
    luggage: 4,
    price: 60,
    image: 'hyundai-tucson.jpg',
    features: ['Klimë', 'Bluetooth', 'Kamera Parkimi', 'Navigacion']
  },
  {
    name: 'VW Golf 7',
    type: 'ekonomik',
    year: 2022,
    passengers: 5,
    transmission: 'Manuale',
    luggage: 2,
    price: 32,
    image: 'vw-golf-7.jpg',
    features: ['Klimë', 'Bluetooth', 'Sensorë Parkimi']
  },
  {
    name: 'Peugeot 3008',
    type: 'suv',
    year: 2022,
    passengers: 5,
    transmission: 'Automatike',
    luggage: 4,
    price: 55,
    image: 'peugeot-3008.jpg',
    features: ['Klimë', 'Navigacion', 'Bluetooth', 'Kamera Parkimi']
  },
  {
    name: 'Tesla Model 3',
    type: 'luksoz',
    year: 2023,
    passengers: 5,
    transmission: 'Automatike',
    luggage: 2,
    price: 85,
    image: 'tesla-model3.jpg',
    features: ['Autopilot', 'Navigacion', 'Kamerat', 'Karikues']
  }
];

// Admin user data
const adminUser = {
  name: 'Admin User',
  email: 'admin@example.com',
  password: bcrypt.hashSync('123456', 10),
  isAdmin: true
};

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected for seeding'))
  .catch(err => {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  });

// Import data function
const importData = async () => {
  try {
    // Clear existing data
    await Car.deleteMany();
    await User.deleteMany();

    // Create admin user
    await User.create(adminUser);
    console.log('Admin user created');

    // Create cars
    await Car.insertMany(cars);
    console.log('Car data imported');

    console.log('Data import complete!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Destroy data function
const destroyData = async () => {
  try {
    // Clear existing data
    await Car.deleteMany();
    await User.deleteMany();

    console.log('Data destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Run the appropriate function based on command
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}