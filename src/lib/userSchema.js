import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    }
})

const User = mongoose.models('user') || mongoose.model('user',userSchema);

export default User;