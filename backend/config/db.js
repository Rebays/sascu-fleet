//TrZ1uMRWZI3EFw2y

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI); // ← No options needed!

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

// Optional: nice logs for production
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected');
});

module.exports = connectDB;