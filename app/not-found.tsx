"use client";

import Image from "next/image";
import logo from "../public/logo.png"
import { Button } from "@/components/ui/button";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
       <Image src={logo} alt="not found" width={64} height={64} priority></Image>
        <div className="p-6 rounded-lg w-1/3 shadow-md text-center">
        <h1 className="text-3xl font-bold mb-4">Not Found</h1>
        <p className="text-destructive">Could not find requested page</p>
        <Button variant="outline" className="mt-4 ml-2" onClick={()=>window.location.href='/'}>Back to Home</Button>
        </div>
    </div>
  )
}

export default NotFound;