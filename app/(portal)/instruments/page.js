import React from 'react'
import InfiniteScroll from './InfiniteScroll.js';

const page = async () => {

    return (
        <div className='w-full h-full bg-slate-100 p-20'>
            <div className="w-full h-auto bg-white">
                <InfiniteScroll></InfiniteScroll>                
            </div>
        </div>
    )
}

export default page

export const metadata = {
    title: "Instruments List",
    description: "",
};