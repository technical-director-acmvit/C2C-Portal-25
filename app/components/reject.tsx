'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import PortalButton from './portal/ui/button'
import { DISCORD_URL } from '@/lib/env'

export default function Reject() {
  const router = useRouter()

  return (
    <div className="fixed inset-0 w-screen h-screen relative">
      <Image src="/portal/bg1.svg" alt="" aria-hidden fill className="object-cover" priority={false} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/80" />

      <div className="flex flex-col items-center justify-center h-full px-4 py-8 text-center relative z-10">
        <div className="max-w-sm sm:max-w-lg lg:max-w-2xl xl:max-w-3xl w-full text-center bg-white/5 backdrop-blur-md border border-white/15 shadow-2xl rounded-2xl p-6 sm:p-8 lg:p-10 xl:p-12">
          <div className="mb-6 sm:mb-8 lg:mb-10">
            {/* <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-4 sm:mb-6 rounded-full bg-amber-400/15 ring-1 ring-amber-400/20 flex items-center justify-center">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
              </svg>
            </div> */}
            <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-2 sm:mb-3 lg:mb-4 leading-tight">
              Unfortunately you didn&apos;t make the cut.
            </h1>
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-neutral-200 leading-relaxed">
              But hey, that&apos;s no reason to stop building your project :)
            </p>
          </div>

          <div className="space-y-4 sm:space-y-5 lg:space-y-6 text-neutral-300 leading-relaxed mb-6 sm:mb-8 lg:mb-10">
            <p className="text-sm sm:text-base lg:text-lg text-neutral-300">
              You can keep building and share updates with the community on our Discord server.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 lg:gap-5">
            <PortalButton onClick={() => typeof window !== 'undefined' && window.open(DISCORD_URL, '_blank', 'noopener')}>
              <span className="inline-flex items-center gap-2 text-sm sm:text-base lg:text-lg">
                <Image src="/footer/discord.svg" alt="Discord" width={20} height={20} className="opacity-90" />
                Join our Discord
              </span>
            </PortalButton>
            <PortalButton onClick={() => router.push('/')}>
              <span className="text-sm sm:text-base lg:text-lg">Return Home</span>
            </PortalButton>
          </div>
        </div>
      </div>
    </div>
  )
}