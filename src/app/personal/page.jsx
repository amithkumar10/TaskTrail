import React from 'react'
import ToDos from '@/components/personal/ToDos'
import AttendanceSelector from '@/components/personal/AttendanceSelector'

const page = () => {
  return (
    <div className=''>
      <ToDos />
      <AttendanceSelector />
    </div>
  )
}

export default page