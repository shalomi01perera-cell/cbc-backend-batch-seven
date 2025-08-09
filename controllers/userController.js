import User from "../Models/user.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

export function createUser(req, res){
   
   const hashedPassword = bcrypt.hashSync(req.body.password,10)

    const user = new User(
         {
            email : req. body. email,
            fristName : req. body. fristName,
            lastName : req. body. lastName,
            password : hashedPassword
         }
    )
      user.save().then(
            ()=>{
                res.json(
                    {
                       message:"User created successfully" 
                    })
            }
        ).catch(
            ()=>{
                res.json(
                    {
                        message:"Falied to create User"
                    })
                }
        )
    }

export function loginUser(req, res){
  User.findOne(
        {
            email : req.body.email
        }
    ).then(
        (user)=>{
            if(user == null){
               res.status(407).json(
                {
                    message : "User not Found"
                }
               ) 

            }else{
                const isPasswordMaching = bcrypt.compareSync(req.body.password, user.password)
                if (isPasswordMaching){

                    const token = jwt.sign(
                        {
                            email: user.email,
                            fristName: user.fristName,
                            LastName: user.lastName,
                            role: user.role,
                            isEmailVerified: user.isEmailVerified,
                        },
                        "jwt secret"
                    )
                    
                    res.json(
                        {
                            message : "Login Successful",
                            token: token
                        }
                    )


                }else{
                    res.status(401).json(
                        {
                            message : "Invailed Password"
                        }
                    )
                }
            }
        }
    )
}

export function isadmin(req){
    
    if (req.user == null){
        return false;
    }
    if(req.user.role != "admin"){
        return false;
    }

    return true;
}

export function isCustomer(req){
    if(req.user == null){
        return false;
    }
    if(req.user.role !="user"){
        return false
    }

    return true;
}