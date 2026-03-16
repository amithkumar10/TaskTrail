import React from 'react'

const page = () => {
  return (
    <div className='flex flex-col justify-center items-center h-screen bg-gray-50'>
        <h1 className='text-9xl font-bold'>401</h1>
        <h1 className="text-3xl font-bold text-center mt-10">Access Denied</h1>
        <p className="text-center text-gray-600 mt-4">You do not have permission to view this page :(</p>
        
    </div>
  )
}

export default page;