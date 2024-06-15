'use server'


import { dbConnect } from "../db"
import User from "../userSchema"

export async function createUser(user) {
    try {
        await dbConnect();
        const newUser = await User.create(user)
        return JSON.parse(JSON.stringify(newUser))
    } catch (error) {
        console.log(error)
    }
}