'use client'

import useWebSocket from '@/hooks/useSocket'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const DriverCallback = () => {
  const [isDriverAssigned, setIsDriverAssigned] = useState(false)
  const { userId } = useAuth()
  const router = useRouter()

  const socket = useWebSocket(userId ?? '', 'rider')

  useEffect(() => {
    if (!socket) return

    socket.on('event:ride_confirmed', async ({ driverId, rideId }) => {
      router.push(`/rides/${rideId}`)
    })
  }, [])

  return <>{!isDriverAssigned && <div>waiting for driver</div>}</>
}

export default DriverCallback
