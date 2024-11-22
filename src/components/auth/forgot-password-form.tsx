"use client"
import { useForm } from 'react-hook-form'
import CardWrapper from '../card-wrapper'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../ui/input'
import { forgetPassword } from '@/lib/auth-client'
import { Button } from '../ui/button'
import { useState } from 'react'
import FormError from '../form-error'
import { FormSuccess } from '../form-success'
import { ForgotPasswordSchema } from '@/helpers/zod/forgot-password-schema'



const ForgotPasswordForm = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: '',
    }
  })

  const onSubmit = async (values: z.infer<typeof ForgotPasswordSchema>) => {
    await forgetPassword({
      email: values.email,
      redirectTo: "/reset-password"
    }, {
      onResponse: () => {
        setLoading(false)
      },
      onRequest: () => {
        setSuccess("")
        setError("")
        setLoading(true)
      },
      onSuccess: () => {
        setSuccess("Reset password link has been sent")
      },
      onError: (ctx) => {
        setError(ctx.error.message);
      },
    });
  }

  return (
    <CardWrapper
      cardTitle='Forgot Password'
      cardDescription='Enter your email to send link to reset password'
      cardFooterDescription="Remember your password?"
      cardFooterLink='/login'
      cardFooterLinkTitle='Login'
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
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={loading} type="submit" className='w-full'>Submit</Button>
        </form>
      </Form>

    </CardWrapper>
  )
}

export default ForgotPasswordForm
