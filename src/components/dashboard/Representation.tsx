"use client";

import React from "react";

const Representation: React.FC = () => {
    return (
        <div className=" bg-white min-w-full rounded shadow-md w-full max-w-sm">
            <div className="p-2 bg-black rounded ">
                <h2 className="text-lg text-white font-bold">Attendance Legend</h2>
            </div>
            <ul className="flex justify-evenly p-4 items-center gap-2">
                <li className="flex  items-center">
                    <span className="w-5 h-5 rounded mr-2 bg-gradient-to-r from-yellow-800 to-yellow-600"></span>
                    <span>Full Day</span>
                </li>
                <li className="inline-flex items-center">
                    <span className="w-5 h-5 rounded mr-2 bg-gradient-to-r from-yellow-500 to-yellow-300"></span>
                    <span>WFH</span>
                </li>
                <li className="flex items-center">
                    <span className="w-5 h-5 rounded mr-2 bg-gradient-to-r from-yellow-200 to-yellow-100"></span>
                    <span>Half Day</span>
                </li>
                <li className="flex items-center">
                    <span className="w-5 h-5 rounded mr-2 bg-white border border-gray-500"></span>
                    <span>Leave</span>
                </li>
            </ul>
        </div>
    );
};

export default Representation;