import 'dotenv/config'; // Автоматически загружает переменные из .env
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js'

const PORT =process.env.PORT || 5000
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))

app.use('/api/auth', authRoutes)

const start = async () => {
    try {
        app.listen(PORT, () => {
            console.log(`Server is listening on PORT ${PORT}`)
        })
    } catch (error) {
        console.error(`Error occured while running the server: ${error}`)
    }
}

start()