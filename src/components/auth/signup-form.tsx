"use client"
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../ui/input'
// import { useRouter } from 'next/navigation'
import { SignupSchema } from '@/helpers/zod/signup-schema'
import CardWrapper from '../card-wrapper'
import FormError from '../form-error'
import { FormSuccess } from '../form-success'
import { signUp } from '@/lib/auth-client'



const SignupForm = () => {
    // const router = useRouter()
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");

    const form = useForm<z.infer<typeof SignupSchema>>({
        resolver: zodResolver(SignupSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        }
    })

    const onSubmit = async (values: z.infer<typeof SignupSchema>) => {
        setError("")
        setSuccess("")

        await signUp.email({
            name: values.name, 
            email: values.email, 
            password: values.password,
         }, { 
            onRequest: () => { 
             setLoading(true)
            }, 
            onSuccess: () => {
              setSuccess("Email verification link has been sent")
            }, 
            onError: (ctx) => { 
              setError(ctx.error.message); 
            }, 
          });

    }


    return (
        <CardWrapper
            cardTitle='Signup'
            cardDescription='create an new account'
            cardFooterLink='/login'
            cardFooterDescription='Already have an account?'
            cardFooterLinkTitle='Login'
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={loading}
                                        type="text"
                                        placeholder='john'
                                        {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={loading}
                                        type="email"
                                        placeholder='example@gmail.com'
                                        {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={loading}
                                        type="password"
                                        placeholder='************'
                                        {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={loading}
                                        type="password"
                                        placeholder='*************'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <Button type="submit" className="w-full" disabled={loading}>Submit</Button>
                </form>
            </Form>
        </CardWrapper>
    )
}

export default SignupForm