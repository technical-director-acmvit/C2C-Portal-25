"use client"

import type React from "react"
import { useEffect, useState } from "react"
import PortalLoader from "@/app/components/portal/portal-loader"
import { getUserData } from "@/app/actions/user"
import type { GetUserResponse } from "@/types/user"

interface SlotRouterProps {
  portal: React.ReactNode
  dash: React.ReactNode
}

export default function SlotRouter({ portal, dash }: SlotRouterProps) {
  const [userData, setUserData] = useState<GetUserResponse | null>(null)
  const [forcePortal, setForcePortal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getUserData()
      .then((data) => {
        setUserData(data as GetUserResponse)
        setLoading(false)
      })
      .catch((err) => {
        if (err instanceof Error) {
          if (err.message === "User not found") {
            // Treat "User not found" as portal (no team/rounds)
            setForcePortal(true)
          } else {
            setError(err.message)
          }
        } else {
          setError("An unknown error occurred")
        }
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <PortalLoader />
  }

  if (error) {
    return <div className="p-4 text-red-600">Error loading user data: {error}</div>
  }

  // Determine rounds count: if team or rounds are missing, treat as 0 rounds.
  const rounds = userData?.user?.team?.rounds ?? []
  const roundsCount = Array.isArray(rounds) ? rounds.length : 0
  // If forcePortal is true (User not found) OR roundsCount is 0 or 1 -> show portal.
  const shouldShowDash = !forcePortal && roundsCount > 1

  console.log("[v0] SlotRouter - shouldShowDash:", shouldShowDash, "roundsCount:", roundsCount)

  return <>{shouldShowDash ? dash : portal}</>
}
