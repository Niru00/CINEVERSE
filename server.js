import dotenv from "dotenv"
dotenv.config()

import app from "./src/app.js"
import { connectToDB } from "./src/config/database.js"

connectToDB()

app.listen(5000,()=>{
    console.log("server is running on 5000")
})