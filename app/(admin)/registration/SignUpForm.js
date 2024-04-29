"use client"
import React from 'react'
import Link from "next/link";
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from 'next-auth/react';

const SignUpForm = () => {

    let signUpFormSchema = z.object({
        name: z.string().min(1, { message: "Name Cannot be blank" }),
        email: z.string().email({
            message: 'Please Use Valid Email Address',
        }),
        password: z.string().min(6, { message: "Password Length should be more than 6 Charecters" }),
        confirm_password: z.string().min(6, { message: "Password Length should be more than 6 Charecters" })
    })


    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: zodResolver(signUpFormSchema),
    });


    async function onSubmit(formData) {

        const signInData = await signIn('credentials', {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            redirect: true
        })

    }

    return (
        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
            <div className="text-blueGray-400 text-center mb-3 font-bold">
                <small>Or sign up with credentials</small>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>

                <div className="relative w-full mb-3">
                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="grid-password">Name</label>
                    <input
                        {...register("name")}
                        type="text"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder="Name"
                    />
                    {errors.name && (
                        <small className="text-red-500">{`${errors.name.message}`}</small>
                    )}
                </div>

                <div className="relative w-full mb-3">
                    <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="grid-password"
                    >
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
                    <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="grid-password"
                    >
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

                <div className="relative w-full mb-3">
                    <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="grid-password"
                    >
                        Confirm Password
                    </label>
                    <input
                        {...register("confirm_password")}
                        type="password"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder="Password"
                    />
                    {errors.confirm_password && (
                        <small className="text-red-500">{`${errors.confirm_password.message}`}</small>
                    )}
                </div>

                <div className="w-full h-auto grid grid-cols-2">

                    <div className="flex justify-start items-center">
                        <label className="inline-flex items-left cursor-pointer">
                            <input id="customCheckLogin"
                                type="checkbox"
                                className="form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150" />
                            <span className="ml-2 text-sm font-semibold text-blueGray-600">
                                I agree with <a className="text-lightBlue-500" href="#">Privacy Policy</a>
                            </span>
                        </label>
                    </div>

                    <div className="flex justify-end items-center">
                        <Link href="/login">
                            <span className="ml-2 text-sm font-semibold text-blueGray-600 underline hover:text-blueGray-800 hover:no-underline">
                                Already a User
                            </span>
                        </Link>
                    </div>

                </div>

                <div className="text-center mt-6">
                    <button className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                        type="submit">
                        Sign Up
                    </button>
                </div>
            </form>

        </div>
    )
}

export default SignUpForm