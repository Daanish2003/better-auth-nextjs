import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import Link from 'next/link'

interface CardWrapperType {
    children: React.ReactNode,
    cardTitle: string,
    cardDescription: string
    cardFooterLinkTitle?: string,
    cardFooterDescription?: string
    cardFooterLink: string
}

const CardWrapper = ({
    children,
    cardTitle,
    cardDescription,
    cardFooterLinkTitle,
    cardFooterDescription,
    cardFooterLink,
}: CardWrapperType) => {
    return (
        <Card className="w-[400px] relative">
            <CardHeader>
                <CardTitle>{cardTitle}</CardTitle>
                <CardDescription>{cardDescription}</CardDescription>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
            <CardFooter className='flex items-center justify-center gap-x-1'>
                <span>{cardFooterDescription}</span>
                <Link
                    href={cardFooterLink}
                    className='underline '
                >
                    {cardFooterLinkTitle}
                </Link>
            </CardFooter>
        </Card>
    )
}

export default CardWrapper