"use client"
import { useForm } from 'react-hook-form'
import CardWrapper from '../card-wrapper'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import LoginSchema from '@/helpers/zod/login-schema'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../ui/input'
import { signIn } from '@/lib/auth-client'
import { Button } from '../ui/button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import FormError from '../form-error'
import { FormSuccess } from '../form-success'



const LoginForm = () => {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    }
 })

 const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
  setSuccess("")
  setError("")
   await signIn.email({ 
    email: values.email,
    password: values.password 
 }, { 
    onResponse: () => {
      setLoading(false)
    },
    onRequest: () => { 
      setLoading(true)
    }, 
    onSuccess: () => { 
      setSuccess("You have loggedIn successful")
      router.replace('/')
    }, 
    onError: (ctx) => { 
      setError(ctx.error.message); 
    }, 
  }); 
}
  
  return (
    <CardWrapper
     cardTitle='Login'
     cardDescription='Welcome back!'
     cardFooterDescription="Don't have an account?"
     cardFooterLink='/signup'
     cardFooterLinkTitle='Sign up'
    >
     <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField 
              control = {form.control}
              name="email"
              render ={( {field}) => (
                <FormItem>
                   <FormLabel>Email</FormLabel>
                   <FormControl>
                      <Input 
                         disabled={loading}
                         type="email" 
                         placeholder='example@gmail.com' 
                         {...field}
                         />
                   </FormControl>
                   <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
              control = {form.control}
              name="password"
              render ={({field}) => (
                <FormItem>
                   <FormLabel>Password</FormLabel>
                   <FormControl>
                      <Input 
                          disabled={loading}
                          type="password" 
                          placeholder='********' 
                          {...field}
                          />
                   </FormControl>
                   <FormMessage />
                </FormItem>
              )}
            />
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button disabled={loading} type="submit" className='w-full'>Login</Button>
        </form>
     </Form>
    </CardWrapper>
  )
}

export default LoginForm
