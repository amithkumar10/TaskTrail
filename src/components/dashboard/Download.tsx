import React from "react";

const Download = () => {

    const handleAttendanceDownload = () => {
        console.log("Downloading Monthly Attendance Report...");
    };

    const handleTaskDownload = () => {
        console.log("Downloading Monthly Task Completion Report...");
    };

    return (
        <div className="flex flex-col  gap-2  shadow-md  min-w-full">

           <div className="bg-black p-2 rounded w-full">
             <h1 className="text-lg font-bold text-white">Download Monthly Reports</h1>
           </div>

            <div className="flex  p-2  gap-3">
                <button
                    onClick={handleAttendanceDownload}
                    className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Attendance
                </button>

                <button
                    onClick={handleTaskDownload}
                    className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                Performance Report
                </button>


            </div>    </div>
    );
};

export default Download;