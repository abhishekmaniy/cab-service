'use client'

import { useRideStore } from '@/app/store/rideStore'
import { Button } from '@/components/ui/button'
import { RideStatus as RS } from '@prisma/client'
import { Clock, MapPin, User } from 'lucide-react'

export default function RideStatus ({ role }: { role: 'rider' | 'driver' }) {
  const { currentRide } = useRideStore()

  console.log(currentRide)

  // const completeRide = async () => {
  //   if (!currentRide) return

  //   try {
  //     const response = await fetch('/api/complete-ride', {
  //       method: 'PATCH',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ rideId: currentRide.id })
  //     })

  //     if (response.ok) {
  //       setCurrentRide(null)
  //       alert('Ride completed Successfully')
  //     } else {
  //       alert('Error completing ride')
  //     }
  //   } catch (error) {
  //     console.error(error)
  //     alert('Something went wrong')
  //   }
  // }

  return (
    <div className='bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-200'>
      <h2 className='text-2xl font-bold mb-6 text-white'>Ride Status</h2>
      {currentRide?.status === RS.REQUESTED ? (
        <span>no Rides Accepted</span>
      ) : (
        <>
          <div className='space-y-4 mb-6'>
            <div className='flex items-center text-gray-400'>
              <User className='mr-2 text-blue-500' />
              <p>
                <strong>{role === 'rider' ? 'Driver' : 'Rider'}:</strong>{' '}
                {role === 'rider'
                  ? currentRide?.captainId
                  : currentRide?.passengerId}
              </p>
            </div>
            <div className='flex items-center text-gray-400'>
              <MapPin className='mr-2 text-green-500' />
              <p>
                <strong>Pickup:</strong> {currentRide?.pickup}
              </p>
            </div>
            <div className='flex items-center text-gray-400'>
              <MapPin className='mr-2 text-red-500' />
              <p>
                <strong>Dropoff:</strong> {currentRide?.destination}
              </p>
            </div>
            <div className='flex items-center text-gray-400'>
              <Clock className='mr-2 text-yellow-500' />
              <p>
                <strong>Status:</strong> {currentRide?.status}
              </p>
            </div>
          </div>
          <Button className='w-full bg-gray-800 hover:bg-gray-700'>
            {role === 'rider' ? 'Cancel Ride' : 'Complete Ride'}
          </Button>
        </>
      )}
    </div>
  )
}
