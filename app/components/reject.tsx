'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

export default function Reject() {
	const router = useRouter()

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
			<div className="max-w-md w-full text-center bg-white shadow rounded p-8">
				<h1 className="text-3xl font-bold text-red-600 mb-2">Application Rejected</h1>
				<p className="text-sm text-gray-600 mb-6">We're sorry — your submission was not approved. If you believe this is a mistake, please contact support.</p>
				<div className="flex justify-center gap-3">
					<button
						onClick={() => router.back()}
						className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
					>
						Go back
					</button>
					<button
						onClick={() => router.push('/')}
						className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
					>
						Home
					</button>
				</div>
			</div>
		</div>
	)
}
