const express = require("express");
const connectDB = require("./config/dataBase");
const routes = require('./routes/index');
const dotenv= require('dotenv');

dotenv.config();

const app = express();

app.use(express.json());
app.use('/api', routes);

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server Started on port ${PORT}`));
