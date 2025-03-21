'use client'

import useWebSocket from '@/hooks/useSocket'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const DriverCallback = () => {
  const { userId } = useAuth()
  const router = useRouter()

  const socket = useWebSocket(userId ?? '', 'rider')

  useEffect(() => {
    if (!socket) return

    socket.on('event:ride_confirmed', async ({ rideId }) => {
      router.push(`/rides/${rideId}`)
    })
  }, [router , socket])

  return (
    <>
      {' '}
      <div>waiting for driver</div>
    </>
  )
}

export default DriverCallback
