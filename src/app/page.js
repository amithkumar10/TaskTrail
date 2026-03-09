"use client";

import React from "react";
import Image from "next/image";
import {useRouter} from "next/navigation";

const page = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-yellow-400 to-green-600">

      <div className="bg-white shadow-xl rounded-xl p-5 text-center 0 max-w-sm w-full">

      
          <Image
            src="/TaskTrail-Logo.png"
            alt="TaskTrail Logo"
            width={230}
            height={230}
            className="inline-block mr-3 border-4 border-gray-800 rounded-full"
          />
        
        <p className="m-5 text-gray-600">Monitor what Amith is working on</p>

        <div className="flex gap-1 min-w-full">

          <button className="bg-green-600 w-full h-12 p-1 cursor-pointer hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition" onClick={()=> router.push('/dashboard')}>
            View Amith's Acitvity
          </button>

          <button className="bg-yellow-400 w-full p-1 cursor-pointer hover:bg-yellow-500 text-green-900 font-semibold py-3 rounded-lg transition" onClick={() => router.push('/personal')}>
            Amith? Login
          </button>

        </div>

      </div>

    </div>
  );
};

export default page;