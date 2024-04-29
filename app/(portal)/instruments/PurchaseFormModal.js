"use client"
import React from 'react'
import { FaTimes } from "react-icons/fa";
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form'
import { useState } from 'react';
import { buy_instrument } from '@/app/actions';

const PurchaseFormModal = ({ instrument, index, onClose }) => {

    const [showStopLossInput, setShowStopLossInput] = useState(false);

    const closeModal = () => {
        reset()
        setShowStopLossInput(false); // Reset the showStopLossInput state
        onClose(); // Call the onClose function passed as a prop
    };

    let purchaseFormSchema = z.object({
        instrument_token: z.string({
            required_error: "Instrument Token is required",
            invalid_type_error: "Instrument Token must be a string",
        }),
        price: z.preprocess((val) => Number(val), z.number({
            required_error: "Price is required",
            invalid_type_error: "Price must be a number",
        }).gte(1, { message: "Price must be greater than or equal to 1" })),

        stopLossAmount: z.preprocess((val) => Number(val), z.number({
            required_error: "Stop Loss is required",
            invalid_type_error: "Stop Loss must be a number",
        }).superRefine((val, ctx) => {
            if (showStopLossInput) {
                if (val < 1) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: `Stop Loss must be greater than or equal to 1`,
                    });
                }
            }
        }))
    });

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: zodResolver(purchaseFormSchema),
    });


    async function onSubmit(formData) {

        const response = await buy_instrument(formData)

        console.log(response);

    }

    return (
        <>
            <div id={'crud_modal_' + index} tabindex="-1" aria-hidden="true" className={"overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-[999] flex justify-center items-center w-full h-full md:inset-0 min-h-full"} style={{ backgroundColor: '#0000008a' }}>
                <div className="relative p-4 w-full max-w-md max-h-full">
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Buy Instrument
                            </h3>
                            <button onClick={() => closeModal(index)} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                                <FaTimes className='w-[10px] h-[10px] text-black' />
                            </button>
                        </div>


                        <form onSubmit={handleSubmit(onSubmit)} className="p-4 md:p-5">

                            <input type="hidden" {...register("instrument_token")} value={instrument.instrument_token} />

                            <div className="grid gap-4 mb-[30px] grid-cols-1">
                                <div className="col-span-2 sm:col-span-1">
                                    <label for="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Quantity</label>
                                    <input type="number" {...register("price")} id="price" className="m-[0px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="100" />
                                    {errors.price && (
                                        <>
                                            <small className="text-red-500">{`${errors.price.message}`}</small>
                                            <br />
                                        </>
                                    )}
                                    <small><i>** Instruments will be purchased on current trading price **</i></small>
                                </div>
                            </div>

                            <div class="flex items-start mb-5">
                                <div class="flex items-center h-5">
                                    {showStopLossInput ? (<input checked {...register("stopLosscheck")} onChange={() => setShowStopLossInput(prevState => !prevState)} id="stopLossCheckbox" type="checkbox" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" />) : (<input {...register("stopLosscheck")} onChange={() => setShowStopLossInput(prevState => !prevState)} id="stopLossCheckbox" type="checkbox" value="" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" />)}
                                </div>
                                <label htmlFor="stopLossCheckbox" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Add Stop Loss</label>
                            </div>

                            {showStopLossInput && (
                                <div className="grid gap-4 mb-4 grid-cols-2">
                                    <div className="col-span-2 sm:col-span-1">
                                        <label htmlFor="stopLossAmount" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Stop Loss Amount</label>
                                        <input {...register("stopLossAmount")} type="number" id="stopLossAmount" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Enter stop loss amount" />
                                        {errors.stopLossAmount && (
                                            <small className="text-red-500">{`${errors.stopLossAmount.message}`}</small>
                                        )}
                                    </div>
                                </div>
                            )}

                            <hr className='mb-[10px]' />

                            <button type="submit" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                Submit Order
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PurchaseFormModal