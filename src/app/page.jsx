'use client'
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [name,setName] = useState('');
  const handleSend = async () => {
    try {
      const res = await axios.post('/api/send',{name: name})
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <main className="flex min-h-screen flex-col items-center  p-24">
      <h1 className=" text-[30px] font-black">Clerk Authentication</h1>
      <input type="text" className=" text-black" onChange={(e) => setName(e.target.value)} />
      <button className="bg-white text-black px-5 py-2 mt-3" onClick={handleSend}>send</button>
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
      <SignedOut>
        <div className="flex gap-3 mt-4">
        <Link className=" bg-white text-black font-semibold rounded-md px-4 py-2" href="/sign-in">signIn</Link>
        <Link className=" bg-white text-black font-semibold rounded-md px-4 py-2" href="/sign-up">signUp</Link>
        </div>
      </SignedOut>
    </main>
  );
}
