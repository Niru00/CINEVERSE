
import userModel from "../models/user.model.js";
import { sendMail  } from "../services/mail.service.js";
import jwt from "jsonwebtoken";
import { addTokenToBlacklist } from "../services/redis.service.js";
import redis from "../services/redis.service.js";


async function registerController(req,res) {
    const { username, email, password } = req.body;

    const isUserExist = await userModel.findOne({
        $or: [
            { email: email },
            { username: username }
        ]
    })
    

    if(isUserExist) {
        return res.status(400).json({
            success: false,
            message: "User with this email or username already exists",
            error: "User already exists"
        })
    }

    const token = jwt.sign(
        {email:email},
        process.env.JWT_SECRET,
    )


    const user = await userModel.create({
        username,
        email,
        password
    })


    await sendMail({
        to:email,
        subject:"welcome to CINEVERSE", 
        html:`<h1>Welcome to Cineverse, ${username}!</h1>
<p>Thank you for registering with us. We're excited to have you on board!</p>
<p>Please verify your email address by clicking the link below:</p> 
<a href="https://cineverse-of8b.onrender.com/api/auth/verify-email?token=${token}">Verify Email</a>
<p>If you did not create an account, please ignore this email.</p>
<p>Best regards,<br/>The Cineverse Team</p>`

    })


    res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}   


async function loginController(req,res) {
    const {email,password} = req.body;

    const user = await userModel.findOne({email}).select("+password");

    
    if(!user){
        return res.status(400).json({
            success: false,
            message: "Invalid email or password",
            error: "User not found"
        })
    }

   const isPasswordMatched = await user.passwordCompare(password);

   if(!isPasswordMatched){
    return res.status(401).json({
        message:"invalid credentials",
        success:false,
        error:"invalid crdentilas"
    })
   }

 if (!user.verified) {
  // Resend verification email automatically
  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
  await sendMail({
    to: email,
    subject: "Welcome to CINEVERSE",
    html: `<h1>Welcome to Cineverse, ${user.username}!</h1>
<p>Thank you for registering with us. We're excited to have you on board!</p>
<p>Please verify your email address by clicking the link below:</p>
<a href="https://cineverse-of8b.onrender.com/api/auth/verify-email?token=${token}">Verify Email</a>
<p>If you did not create an account, please ignore this email.</p>
<p>Best regards,<br/>The Cineverse Team</p>`
  });
  
  return res.status(401).json({ 
    message: "Email not verified. We've resent the verification link!",
    resent: true
  });
}
    const token = jwt.sign(
        {id:user._id},
        process.env.JWT_SECRET,
        {expiresIn:"7d"}
    )

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })

    res.status(200).json({
        success: true,
        message: "Logged in successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })




}

async function emailResendController(req,res) {
    const { email } = req.body;

    const user = await userModel.findOne({ email });

    if(!user){  
        return res.status(400).json({
            success: false,
            message: "User with this email does not exist",
            error: "User not found"
        })
    }

    if(user.verified){
        return res.status(400).json({
            success: false,
            message: "Email is already verified",
            error: "Email already verified"
        })
    }

    const token = jwt.sign(
        {email:email},
        process.env.JWT_SECRET,
    )   

    await sendMail({
        to:email,
        subject:"welcome to CINEVERSE",    
        html:`<h1>Welcome to Cineverse, ${user.username}!</h1>
<p>Thank you for registering with us. We're excited to have you on board!</p>
<p>Please verify your email address by clicking the link below:</p>
<a href="https://cineverse-of8b.onrender.com/api/auth/verify-email?token=${token}">Verify Email</a>
<p>If you did not create an account, please ignore this email.</p>
<p>Best regards,<br/>The Cineverse Team</p>`

    
    })
}

async function verifyEmailController(req,res) {
    const { token } = req.query;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findOne({ email: decoded.email });

    if(!user){
        return res.status(400).json({
            success: false,
            message: "Invalid token",
            error: "User not found"
        })
    }

    const verifiedHtml = ` <h1>Email already Verified !</h1>
         
        `

    if(user.verified){
        return res.status(200).send(verifiedHtml)
    }

    user.verified = true;
    await user.save();

    const html = `            <h1>Email Verified Successfully!</h1>
            <p>Thank you for verifying your email. Your account is now active.</p>
            <p>You can now log in to your account and start using our services.</p>
            <p>Best regards,<br/>The Perplexity Team</p>
        `

        res.status(200).send(html);

}

 
async function getMe(req,res) {

    const user = req.user;

     const dbUser = await userModel.findById(user.id).select("-password");

        res.status(200).json({  
            success: true,
            message: "User details fetched successfully",
            user: dbUser
        })

    
}

async function forgotPassword(req,res) {

          try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email not found" });

    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    redis.setex(`reset_${token}`, 3600, email); 

    await sendMail({
      to: email,
      subject: "CINEVERSE Password Reset",
      html: `<h1>Password Reset Request</h1>
<p>Hi ${user.username},</p>
<p>We received a request to reset your password. Click the link below to set a new password:</p>
<a href="https://cineverse-of8b.onrender.com/reset-password?token=${token}">Reset Password</a>
<p>This link will expire in 1 hour. If you did not request a password reset, please ignore this email.</p>
<p>Best regards,<br/>The Cineverse Team</p>`
    });

    res.json({ success: true, message: "Reset email sent!" }); // ← add this!

  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }



}

async function resetPasswordController(req, res) {


  const { token, newPassword } = req.body;

  const email = await redis.get(`reset_${token}`);

  if (!email) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await userModel.findOne({ email: decoded.email });
  
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
  
    user.password = newPassword;

  await user.save();
  
  res.json({ success: true, message: "Password reset successful" });
}

async function logoutController(req, res) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "No token found",
        error: "Token not provided"
      });
    }

    // Add token to Redis blacklist for 7 days
    await addTokenToBlacklist(token, 7 * 24 * 60 * 60);

    res.clearCookie("token");

    res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Logout failed",
      error: error.message
    });
  }
}

export { registerController
, verifyEmailController,
emailResendController,
loginController,
getMe,
forgotPassword,
resetPasswordController,
logoutController
 }
