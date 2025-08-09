import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter.js";
import jwt from "jsonwebtoken";
import productRouter from "./routes/productRouter.js";

const app = express()

app.use(express.json())

app.use(
    (req,res,next)=>{

        let token = req.header("Authorization")
        
        if(token != null){
            token = token.replace("Bearer " ,"")
            jwt.verify(token,"jwt.secret",
                (err, decoded)=>{
                    if(decoded == null){
                        res.json({
                            message:"Invalied token please Login again"
                        })
                        return
                    }else{
                        req.user = decoded
                    }
                
            })
        }
        next()
    }
)

const connectionstring = "mongodb+srv://admin:456@cluster0.rnn5bii.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
mongoose.connect (connectionstring).then(
    ()=>{
        console.log("Database connected Sucessfully")
    }
).catch(
    ()=>{
        console.log("Database connection failed")
    }
)   

app.use("/user", userRouter)
app.use("/products", productRouter)

app.listen(5000, 
    ()=>{
        console.log("Server is runing on port 5000")
    }
)