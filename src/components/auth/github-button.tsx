"use client"
import React from 'react'

import { FaGithub } from 'react-icons/fa'
import { signIn } from '@/lib/auth-client'
import { Button } from '../ui/button'

const GithubButton = () => {
    const handleSignIn = async () => {
        try {
          const response = await signIn.social({
            provider: "github", // Ensure this matches the configured provider name
            callbackURL: "/",    // or callbackURL depending on your library's configuration
          });
    
          console.log("Sign-in response:", response);
        } catch (error) {
          console.error("Sign-in error:", error);
        }
      };
  return (
    <>
    <Button className='w-full' onClick={handleSignIn}>
          <div className='flex gap-x-2 items-center justify-center'>
            <FaGithub />
            Login with github
          </div>
         </Button>
    </>
  )
}

export default GithubButton