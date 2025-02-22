'use client'

import { useRideStore } from '@/app/store/rideStore'
import { Button } from '@/components/ui/button'
import { Clock, MapPin, User } from 'lucide-react'
import { RideStatus as RS } from '@prisma/client'

export default function RideStatus ({ role }: { role: 'rider' | 'driver' }) {
  const { currentRide, setCurrentRide } = useRideStore()

  console.log(currentRide)

  const completeRide = async () => {
    if (!currentRide) return

    try {
      const response = await fetch('/api/complete-ride', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rideId: currentRide.id })
      })

      if (response.ok) {
        setCurrentRide(null)
        alert('Ride completed Successfully')
      } else {
        alert('Error completing ride')
      }
    } catch (error) {
      console.error(error)
      alert('Something went wrong')
    }
  }

  return (
    <div className='bg-white p-6 rounded-lg shadow-lg border border-gray-200'>
      <h2 className='text-2xl font-bold mb-6 text-gray-800'>Ride Status</h2>
      {currentRide?.status === RS.REQUESTED ? (
        <span>no Rides Accepted</span>
      ) : (
        <>
          <div className='space-y-4 mb-6'>
            <div className='flex items-center text-gray-700'>
              <User className='mr-2 text-blue-500' />
              <p>
                <strong>{role === 'rider' ? 'Driver' : 'Rider'}:</strong>{' '}
                {role === 'rider'
                  ? currentRide?.captainId
                  : currentRide?.passengerId}
              </p>
            </div>
            <div className='flex items-center text-gray-700'>
              <MapPin className='mr-2 text-green-500' />
              <p>
                <strong>Pickup:</strong> {currentRide?.pickup}
              </p>
            </div>
            <div className='flex items-center text-gray-700'>
              <MapPin className='mr-2 text-red-500' />
              <p>
                <strong>Dropoff:</strong> {currentRide?.destination}
              </p>
            </div>
            <div className='flex items-center text-gray-700'>
              <Clock className='mr-2 text-yellow-500' />
              <p>
                <strong>Status:</strong> {currentRide?.status}
              </p>
            </div>
          </div>
          <Button className='w-full bg-uber-gradient hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105'>
            {role === 'rider' ? 'Cancel Ride' : 'Complete Ride'}
          </Button>
        </>
      )}
    </div>
  )
}
