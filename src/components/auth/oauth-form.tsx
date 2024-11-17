import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import GithubButton from './github-button'



const OAuthForm = () => {
  return (
    <Card className='w-[400px]'>
      <CardHeader>
         <CardTitle>Login</CardTitle>
         <CardDescription>Please login into your account</CardDescription>
      </CardHeader>
      <CardContent>
         <GithubButton />
      </CardContent>
    </Card>
  )
}

export default OAuthForm
