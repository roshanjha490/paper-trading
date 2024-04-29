"use client"
import { React } from 'react'
import Link from 'next/link'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import { checkLogin } from '@/app/actions'
import { toast } from 'react-hot-toast';
import { signIn } from "next-auth/react";


const LoginForm = () => {

    let loginFormSchema = z.object({
        email: z.string().email({
            message: 'Please Use Valid Email Address',
        }),
        password: z.string().min(6, { message: "Password Length should be more than 6 Charecters" })
    })

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: zodResolver(loginFormSchema),
    });


    async function onSubmit(formData) {

        toast.remove();

        const result = await checkLogin(formData);

        if (result.success) {

            toast.success(result.error)

            const signInData = await signIn('credentials', {
                email: formData.email,
                password: formData.password,
                redirect: true
            })

        } else {
            toast.error(result.error)
        }

    }

    return (
        <>
            <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                <div className="text-blueGray-400 text-center mb-3 font-bold">
                    <small>Or sign in with credentials</small>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="relative w-full mb-3">
                        <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="grid-password">
                            Email
                        </label>
                        <input
                            {...register("email")}
                            type="text"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            placeholder="Email"
                        />
                        {errors.email && (
                            <small className="text-red-500">{`${errors.email.message}`}</small>
                        )}
                    </div>

                    <div className="relative w-full mb-3">
                        <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="grid-password">
                            Password
                        </label>
                        <input
                            {...register("password")}
                            type="password"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            placeholder="Password"
                        />
                        {errors.password && (
                            <small className="text-red-500">{`${errors.password.message}`}</small>
                        )}
                    </div>

                    <div className="w-full h-auto grid grid-cols-2">

                        <div className="flex justify-start items-center">
                            <label className="inline-flex items-left cursor-pointer">
                                <input id="customCheckLogin"
                                    type="checkbox"
                                    className="form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150" />
                                <span className="ml-2 text-sm font-semibold text-blueGray-600">
                                    Remember me
                                </span>
                            </label>
                        </div>

                        <div className="flex justify-end items-center">
                            <Link href="/registration">
                                <span className="ml-2 text-sm font-semibold text-blueGray-600 underline hover:text-blueGray-800 hover:no-underline">
                                    New Registration
                                </span>
                            </Link>
                        </div>

                    </div>

                    <div className="text-center mt-6">
                        <button disabled={isSubmitting} className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                            type="submit">
                            Sign In
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default LoginForm