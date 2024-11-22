"use client"
import React, { useState } from 'react'
import CardWrapper from '../card-wrapper'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { useForm } from 'react-hook-form'
import { twoFactorSchema } from '@/helpers/zod/two-factor-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import FormError from '../form-error'
import { Button } from '../ui/button'
import { FormSuccess } from '../form-success'
import { twoFactor } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'


const TwoFactorForm = () => {
    const router = useRouter()
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");

    const form = useForm<z.infer<typeof twoFactorSchema>>({
        mode: "onBlur",
        resolver: zodResolver(twoFactorSchema),
    })

    const requestOTP = async () => {
        try {
            await twoFactor.sendOtp({
              
            }, {
                onResponse: () => {
                    setLoading(false)
                },
                onRequest: () => {
                    setError("")
                    setSuccess("")
                    setLoading(true)
                },
                onSuccess: () => {
                    setSuccess("OTP has been sent")
                },
                onError: (ctx) => {
                    setError(ctx.error.message)
                }
            })
        } catch (error: unknown) {
            console.error(error)
        }


    }

    const onSubmit = async (values: z.infer<typeof twoFactorSchema>) => {
        await twoFactor.verifyOtp({
            code: values.code
        }, {
            onRequest: () => {
                setError("")
                setSuccess("")
                setLoading(true)
            },
            onSuccess() {
                setSuccess("OTP validated successfully")
                setLoading(false)
                router.replace("/")
            },
            onError(ctx) {
                setError(ctx.error.message)
                setLoading(false)
            }
        })
    }

    return (
        <CardWrapper
            cardTitle='Two-Factor Authentication'
            cardDescription='Verify your identity with a one-time password'
            cardFooterDescription="Entered wrong email?"
            cardFooterLink='/login'
            cardFooterLinkTitle='Login'
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name='code'
                        render={({ field }) => (
                            <>
                                <FormItem>
                                    <FormLabel>One-Time Password</FormLabel>
                                    <InputOTP
                                        maxLength={6}
                                        pattern={REGEXP_ONLY_DIGITS}
                                        {...field}
                                        disabled={loading}

                                    >
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                    <FormMessage />
                                </FormItem>
                                <Button onClick={requestOTP} variant={"link"} className='text-xs underline ml-60'>
                                    Resend OTP
                                </Button>
                            </>
                        )}
                    />
                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <Button type='submit' disabled={loading} className='w-full mt-4'>Verify</Button>
                </form>
            </Form>
        </CardWrapper>
    )
}

export default TwoFactorForm