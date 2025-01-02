const mongoose = require('mongoose');
require('dotenv').config();
const MONGO_URL = process.env.MONGO_URL;

const dbConnection = async () => {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1); 
  }
};

const dbDisconnect = async () => {
  try {
    await mongoose.disconnect();
    console.log('Database disconnected successfully');
  } catch (error) {
    console.error('Error disconnecting from the database:', error);
  }
};

const dbStatus = () => {
  const status = mongoose.connection.readyState;
  const statuses = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'];
  console.log(`Database connection status: ${statuses[status] || 'Unknown'}`);
  return statuses[status] || 'Unknown';
};

module.exports = { dbConnection, dbDisconnect, dbStatus };
