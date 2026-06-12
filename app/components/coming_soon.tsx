'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import PortalButton from './portal/ui/button'

interface ComingSoonProps {
    title?: string
    message?: string
}

export default function Coming_Soon({ 
    title = "Result coming soon", 
    message = "The result is not out yet.\nWe are working hard to bring it to you soon!"
}: ComingSoonProps = {}) {
    const router = useRouter()

    return (
        <div className="fixed inset-0 w-screen h-screen relative">
            <Image src="/portal/bg1.svg" alt="" aria-hidden fill className="object-cover" priority={false} />
            
            <div className="flex flex-col items-center justify-center h-full px-4 text-center relative z-10">
                <div className="max-w-lg w-full text-center bg-black/80 backdrop-blur-sm border border-white/20 shadow-2xl rounded-xl p-8">
                    <div className="mb-6">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-400/20 flex items-center justify-center">
                            <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-yellow-400 mb-3">{title}</h1>
                        <p className="text-gray-300 leading-relaxed">
                            {message.split('\n').map((line, index) => (
                                <React.Fragment key={index}>
                                    {line}
                                    {index < message.split('\n').length - 1 && <br />}
                                </React.Fragment>
                            ))}
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <PortalButton onClick={() => router.push('/')}>
                            Return Home
                        </PortalButton>
                    </div>
                </div>
            </div>
        </div>
    )
}
