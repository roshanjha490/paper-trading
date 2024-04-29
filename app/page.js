import Image from "next/image";
import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div style={{ backgroundColor: '#f2f2f2' }} className="w-full p-[40px] h-screen flex justify-center items-center">

        <div className="w-auto h-auto">

          <div className="mb-[20px] flex justify-center items-center">
          </div>

          <h1 style={{ color: '#404040' }} className="text-[3rem] text-center"><b>Paper trading App</b></h1>

          <div style={{ borderRadius: '0.3rem', border: '1px solid #e5e5e5' }} className="w-auto h-auto bg-white px-[3rem] py-[2rem]">

            <div className="w-full flex justify-center items-center mt-[20px]">
              <Link href='/login'>
                <button type="button" className="px-5 py-2.5 text-sm font-medium text-white bg-blue-400 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Use App</button>
              </Link>
            </div>

          </div>


        </div>

      </div>
    </>
  );
}
