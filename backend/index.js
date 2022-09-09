const express = require('express')
const wordRoutes = require('./routes/wordRoutes')

const app = express()
app.use(express.json());
app.use('/api/word', wordRoutes)

const PORT = 5000
app.listen(PORT, console.log(`Server started on Port ${PORT}`))