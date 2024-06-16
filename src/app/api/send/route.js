import { dbConnect } from '@/lib/db';
import User from '@/lib/userSchema';
import { NextResponse } from 'next/server';

export async function POST(req) {
    await dbConnect();  // Ensure database connection is awaited

    try {
        const reqBody = await req.json();
        const { name } = reqBody;
        const newUser = await User.create({
            username: name,
            email: 'demo'
        })
        

        return NextResponse.json({ message: 'success', user: newUser }, { status: 201 });
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json({ message: 'error', error: error.message }, { status: 400 });
    }
}
