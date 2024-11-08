import express from 'express'
import cors from "cors"
import 'dotenv/config'
import ConnectDB from './configs/mongoDB.js'
import ConnectCloudinary from './configs/cloudinary.js'
import AdminRouter from './routes/AdminRoutes.js'
import doctorRouter from './routes/DoctorRoutes.js'
import userRouter from './routes/UserRoutes.js'



//app config
const myApp = express()
const port = process.env.port || 4000
ConnectDB()
ConnectCloudinary()

// middlewares
myApp.use(express.json())
myApp.use(cors())

//api endpoints
myApp.use('/api/admin', AdminRouter)
myApp.use('/api/doctors',doctorRouter)
myApp.use('/api/user',userRouter)

//start app
myApp.listen(port,()=>{
    console.log('Server Dey start', port);
    
})