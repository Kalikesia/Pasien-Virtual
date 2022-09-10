const express = require('express')
const connectDB = require('./config/db')
const dotenv = require('dotenv')
const wordRoutes = require('./routes/wordRoutes')

const app = express()
app.use(express.json());
dotenv.config()
connectDB()
app.use('/api/word', wordRoutes)

const PORT = 5000
app.listen(PORT, console.log(`Server started on Port ${PORT}`))