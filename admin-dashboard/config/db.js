import mongoose from "mongoose";
// const url = "mongodb://localhost:27017/inventory"
const url = "mongodb://localhost:27017/Dashboard"

export const connectDB = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
      console.log('Connected to MongoDB');
    });
  } catch (error) {
    console.log(`error in connection ${error}`);
  }
};

export default connectDB
