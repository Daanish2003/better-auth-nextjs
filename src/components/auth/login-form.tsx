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
import Link from 'next/link'
import { Separator } from '../ui/separator'
import GithubButton from './github-button'



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
    try {
      await signIn.email({
        email: values.email,
        password: values.password
      }, {
        onResponse: () => {
          setLoading(false)
        },
        onRequest: () => {
          setSuccess("")
          setError("")
          setLoading(true)
        },
        onSuccess: (ctx) => {
          if (!ctx.data.twoFactorRedirect) {
            setSuccess("LoggedIn successfully")
            router.replace('/')
          }
        },
        onError: (ctx) => {
          setError(ctx.error.message);
        },
      });
    } catch (error) {
      console.log(error)
      setError("Something went wrong")
    }
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
                    {...field}
                  />
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
                    placeholder='********'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
                <Link href={"/forgot-password"} className='text-xs underline ml-60'>Forgot Password?</Link>
              </FormItem>

            )}
          />
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={loading} type="submit" className='w-full'>Login</Button>
          <Separator />
          <GithubButton />
        </form>
      </Form>
    </CardWrapper>
  )
}

export default LoginForm
