
import React, { useEffect } from 'react'
import Image from 'next/image'
import { useState } from 'react'
import axios from "@/app/utils/axiosConfig";

const ProfileCard = () => {
  const [data, setData] = useState({ name: "", project: "", manager: "", position: "" });

  useEffect(()=>{
    axios.get("/users")
      .then(response => {
        setData(response.data[0]);
        console.log("User data:", response.data);
        console.log(response.data[0]?.name);
      })
      .catch(error => {
        console.error("Error fetching user data:", error);
      });
  }, [])
  return (
    <div className="w-full mb-4 mx-auto bg-white shadow-lg rounded-lg overflow-hidden ">
        <div className='bg-black p-3'>
            <h2 className='text-white font-bold'>Profile Details</h2>
        </div>
     <div className='p-3'>
         <div className="flex items-center space-x-4">
        <Image
            src="data:image/jpeg;base64,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"
            alt="TaskTrail Logo"
            width={60}
            height={60}
            className="inline-block mr-3  rounded-full"
          />
        <div>
          <h2 className="text-xl font-bold">{data.name}</h2>
          <p className="text-gray-500">{data.position}</p>
        </div>
      </div>
      <div className=" flex justify-between mt-4 text-gray-700">
      <div className='flex gap-2'>
          <p className='font-bold'>Project: </p>
        <p>{data.project}</p>
      </div>

        <div className='flex gap-2'>
          <p className='font-bold'>Manager: </p>
        <p>{data.manager}</p>
      </div>
      </div>
     </div>

       
     
    </div>
  )
}

export default ProfileCard