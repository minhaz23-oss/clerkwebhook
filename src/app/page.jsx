import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center  p-24">
      <h1 className=" text-[30px] font-black">Clerk Authentication</h1>
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
