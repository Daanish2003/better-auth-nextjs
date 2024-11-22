"use client"
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { Settings2 } from 'lucide-react'
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Switch } from '../ui/switch'
import { twoFactor, useSession } from '@/lib/auth-client'
import { Input } from '../ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { useForm } from 'react-hook-form'
import { PasswordSchema } from '@/helpers/zod/signup-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FormSuccess } from '../form-success'
import FormError from '../form-error'


const Settings = () => {
  const { data } = useSession();
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false)
  const [success, setSuccess] = useState<string | undefined>("")
  const [error, setError] = useState<string | undefined>("")

  const form = useForm<z.infer<typeof PasswordSchema>>({
    resolver: zodResolver(PasswordSchema),
    defaultValues: {
      password: '',
    }
  })

  if (data?.user.twoFactorEnabled === null) {
    return;
  }

  const onSubmit = async (values: z.infer<typeof PasswordSchema>) => {
    setSuccess("")
    setError("")
    setLoading(true)

    try {
      if(data?.user.twoFactorEnabled === false) {
        const res = await twoFactor.enable({
          password: values.password
        })
  
        if(res.data) {
           setSuccess("Enabled two Factor")
           setOpen(false)
        }
  
        if(res.error) {
          setError(res.error.message)
        }
      }
      if(data?.user.twoFactorEnabled === true)
      {
        const res = await twoFactor.disable({
          password: values.password
        })
  
        if(res.data) {
           setSuccess("Disabled two Factor")
           setOpen(false)
        }
  
        if(res.error) {
          setError(res.error.message)
        }
      }

    } catch(error: unknown) {
      console.error(error)
    } finally {
      setLoading(false)
      setSuccess("")
      setError("")
    }
  }

  return (
    <>
      {JSON.stringify(data?.user)}
      <Dialog open={open}
      onOpenChange={() => {setOpen(false)}}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm selection</DialogTitle>
            <DialogDescription>Please enter your password to confirm selection</DialogDescription>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          type='password'
                          placeholder='********'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormSuccess message={success} />
                <FormError message={error} />
                <Button 
              type="submit"
              className='w-full mt-4'
              >
              Submit
            </Button>
              </form>
            </Form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={"outline"}>
            <Settings2 />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Settings
            </DialogTitle>
            <DialogDescription>
              Make changes in your settings here
            </DialogDescription>
          </DialogHeader>
          <Card>
            <CardHeader className='p-4 flex flex-row justify-between'>
              <div>
                <CardTitle className='text-sm'>Enable 2FA</CardTitle>
                <CardDescription className='text-xs'>Select option to enable or disable two factor authentication</CardDescription>
              </div>
              <Switch
                checked={data?.user.twoFactorEnabled}
                onCheckedChange={() => { setOpen(true) }}
              />
            </CardHeader>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Settings