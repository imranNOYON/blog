import mongoose from "mongoose";

export const ConnectDB=async()=>{
    await mongoose.connect('mongodb+srv://mdnoyonbd234:a1qw0VODMFu4G8IK@cluster0.dgvof.mongodb.net/blog-app')
 console.log("DB Connected")
}
// a1qw0VODMFu4G8IK