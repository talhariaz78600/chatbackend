const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 2200;
const userRouter = require('./api/users/user');
const authRouter = require('./api/users/auth');
const messageRouter=require('./api/messages/messages')
const { app, server } = require('./socket/socket');

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
const uri = process.env.Mongoo_URI;
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/message', messageRouter);

app.get('/', async (req, res) => {
  res.json({ message: `server is running at ${PORT}` })
})



const connectDB = async () => {
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => {
      console.log("Successfully connected to MongoDB")

    }).catch((error) => {
      console.error("Unable to connect to MongoDB", error);
    })
}

connectDB().then(() => {

  server.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
  });
})