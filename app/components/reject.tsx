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
        <div className="max-w-xl w-full text-center bg-white/5 backdrop-blur-md border border-white/15 shadow-2xl rounded-2xl p-6 sm:p-8">
          <div className="mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-amber-400/15 ring-1 ring-amber-400/20 flex items-center justify-center">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">We couldn&apos;t onboard you this time</h1>
            <p className="text-base sm:text-lg text-neutral-200">But your journey doesn&apos;t have to stop here.</p>
          </div>

          <div className="space-y-4 sm:space-y-5 text-neutral-300 leading-relaxed">
            <p>
              You can continue working on your project online and share your updates with the community on our Discord server.
            </p>
            <p className="text-neutral-300">
              Who knows - if spots open up in the later rounds, we might just reach out to you!
            </p>
          </div>

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white text-sm sm:text-base transition-colors"
            >
              <Image src="/footer/discord.svg" alt="Discord" width={20} height={20} className="opacity-90" />
              Join our Discord
            </a>
            <PortalButton onClick={() => router.push('/')}>
              Return Home
            </PortalButton>
          </div>
        </div>
      </div>
    </div>
  )
}
