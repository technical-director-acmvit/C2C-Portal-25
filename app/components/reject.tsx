'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import PortalButton from './portal/ui/button'

export default function Reject() {
	const router = useRouter()

	return (
		<div className="fixed inset-0 w-screen h-screen relative">
			<Image src="/portal/bg1.svg" alt="" aria-hidden fill className="object-cover" priority={false} />
			
			<div className="flex flex-col items-center justify-center h-full px-4 text-center relative z-10">
				<div className="max-w-lg w-full text-center bg-black/80 backdrop-blur-sm border border-white/20 shadow-2xl rounded-xl p-8">
					<div className="mb-6">
						<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
							<svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</div>
						<h1 className="text-3xl font-bold text-red-400 mb-3">Application Not Approved</h1>
						<p className="text-gray-300 leading-relaxed">
							Unfortunately, your submission didn&apos;t meet our current requirements. 
							Don&apos;t let this discourage you...every rejection is a step closer to success.
						</p>
					</div>

					<div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
						<p className="text-sm text-gray-400">
							If you believe this decision was made in error or would like feedback on your submission, 
							please reach out to our support team.
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
