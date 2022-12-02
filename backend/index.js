const express = require('express')
const connectDB = require('./config/db')
const dotenv = require('dotenv')
const wordRoutes = require('./routes/wordRoutes')
const algorithmRoutes = require('./routes/algorithmRoutes')

const app = express()
app.use(express.json());
dotenv.config()
connectDB()
app.use('/api/word', wordRoutes)
app.use('/api/algorithm', algorithmRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, console.log(`Server started on Port ${PORT}`))