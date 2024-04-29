"use client"
import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { get_userdata, saveZerodhaValues } from '@/app/actions'
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

const page = () => {

    let zerodhaFormCheck = z.object({
        api_key: z.string().min(1, { message: "API Key Cannot be blank" }),
        secret_key: z.string().min(1, { message: "Secret Key Cannot be blank" }),
        request_token: z.string().min(1, { message: "Request token cannot be blank" })
    })

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: zodResolver(zerodhaFormCheck),
    });

    async function onSubmit(formData) {

        console.log(formData)

        toast.remove();

        const result = await saveZerodhaValues(formData);

        // if (result) {
        //     if (result.status == 'success') {
        //         toast.success('Kite values updated successfully')
        //     }

        //     if (result.status == 'error') {
        //         toast.error(result.message)
        //     }
        // } else {
        //     toast.error('Server error occured')
        // }
    }

    const [user_info, setuser_info] = useState({})
    const [apiKey, setApiKey] = useState('');

    const handleApiKeyChange = (e) => {
        setApiKey(e.target.value);
    };

    useEffect(() => {
        async function get_user_information() {
            const visitors = await get_userdata()
            setuser_info(visitors)
            setApiKey(visitors.api_key)
        }

        get_user_information()
    }, [])


    return (
        <>
            <div className='w-full h-full bg-slate-100 p-20'>
                {
                    Object.keys(user_info).length > 0 ? (
                        <div className="w-full h-auto bg-white p-[50px]">
                            <div className="grid grid-cols-2">

                                <div>
                                    <form className="max-w-sm">
                                        <div className="mb-5">
                                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                                            <input type="text" id="disabled-input" aria-label="disabled input" className="mb-5 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" defaultValue={user_info.name} disabled />
                                        </div>

                                        <div className="mb-5">
                                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                            <input type="text" id="disabled-input" aria-label="disabled input" className="mb-5 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" defaultValue={user_info.email} disabled />
                                        </div>

                                    </form>
                                </div>

                                <div>
                                    <form className="max-w-sm" onSubmit={handleSubmit(onSubmit)}>

                                        <div className="mb-5">
                                            <label htmlFor="api_key" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Zerodha API Key</label>
                                            <input onChange={handleApiKeyChange} defaultValue={user_info.api_key} {...register("api_key")} type="text" id="api_key" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
                                            {errors.api_key && (
                                                <small className="text-red-500">{`${errors.api_key.message}`}</small>
                                            )}
                                        </div>

                                        <div className="mb-5">
                                            <label htmlFor="secret_key" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Zerodha Secret Key</label>
                                            <input defaultValue={user_info.api_secret} {...register("secret_key")} type="text" id="secret_key" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
                                            {errors.secret_key && (
                                                <small className="text-red-500">{`${errors.secret_key.message}`}</small>
                                            )}
                                        </div>

                                        <div className="mb-5">
                                            <label htmlFor="request_token" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Zerodha Request Token</label>
                                            <input defaultValue={user_info.request_token} {...register("request_token")} type="text" id="request_token" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />

                                            {setApiKey === '' ? (<></>) : (
                                                <small className='underline'>
                                                    <Link href={`https://kite.zerodha.com/connect/login?v=3&api_key=${apiKey}`} target="_blank" rel="noopener noreferrer">Click here to get Request Token</Link>
                                                </small>
                                            )}

                                            {errors.request_token && (
                                                <small className="text-red-500">{`${errors.request_token.message}`}</small>
                                            )}
                                        </div>

                                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Update Zerodha API key</button>

                                    </form>
                                </div>

                            </div>
                        </div >
                    ) : (
                        <div className="w-full h-auto bg-white p-[50px]">
                            <p>Loading...</p>
                        </div>
                    )
                }
            </div >
        </>
    )
}

export default page