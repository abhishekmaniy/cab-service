'use client'

import { Button } from '@/components/ui/button'
import useWebSocket from '@/hooks/useSocket'
import { getLatLng } from '@/lib/getLatLng'
import { autoComplete } from '@/lib/google'
import { useAuth } from '@clerk/nextjs'
import { PlaceAutocompleteResult } from '@googlemaps/google-maps-services-js'
import { useCallback, useEffect, useState } from 'react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from './ui/command'

export default function RideRequest () {
  const [pickup, setPickup] = useState('')
  const [destination, setDestination] = useState('')
  const { userId } = useAuth()
  const socket = useWebSocket()


  const [pickupPrediction, setPickupPrediction] = useState<
    PlaceAutocompleteResult[]
  >([])
  const [dropoffPrediction, setDropoffPrediction] = useState<
    PlaceAutocompleteResult[]
  >([])

  const [selectedPickup, setSelectedPickup] = useState<{
    description: string
    place_id: string
  } | null>(null)
  const [selectedDropoff, setSelectedDropoff] = useState<{
    description: string
    place_id: string
  } | null>(null)

  const fetchPredictions = useCallback(
    async (
      input: string,
      setter: (predictions: PlaceAutocompleteResult[]) => void
    ) => {
      if (input.length > 2) {
        try {
          const predictions = await autoComplete(input)
          setter(predictions ?? [])
        } catch (error) {
          console.error('Error fetching predictions:', error)
        }
      } else {
        setter([])
      }
    },
    []
  )

  useEffect(() => {
    fetchPredictions(pickup, setPickupPrediction)
  }, [pickup, fetchPredictions])

  useEffect(() => {
    fetchPredictions(destination, setDropoffPrediction)
  }, [destination, fetchPredictions])

  const handleRequest = async () => {
    if (!selectedPickup || !selectedDropoff) {
      alert('Please enter both pickup & dropoff locations')
      return
    }
    try {
      const pickupLocation = await getLatLng(selectedPickup.place_id)
      const destinationLocation = await getLatLng(selectedDropoff.place_id)

      if (!pickupLocation || !destinationLocation) {
        return alert('Invalid pickup & destination location')
      }
      console.log('PickupLocation', pickupLocation?.lat, pickupLocation?.lng)
      console.log(
        'destinationLocation',
        destinationLocation?.lat,
        destinationLocation?.lng
      )

      const response = await fetch('/api/create-ride', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pickupLat: pickupLocation?.lat ?? null,
          pickupLng: pickupLocation?.lng ?? null,
          destinationLat: destinationLocation?.lat ?? null,
          destinationLng: destinationLocation?.lng ?? null,
          riderId: userId ?? null
        })
      })

      if (!response.ok) throw new Error('Error while creating ride')

      if (socket) {
        socket.emit('event:request_ride', {
          riderId: userId,
          pickup: pickupLocation,
          destination: destinationLocation
        })
        alert('Ride Created')
      } else {
        alert('Socket connection not established')
      }
    } catch (error) {
      console.error('Error Creating Ride:', error)
      alert('Something went wrong!')
    }
  }

  return (
    <div className='bg-gray-900 p-6 rounded-lg shadow-lg'>
      <h2 className='text-2xl font-bold mb-6 text-white'>Request a Ride</h2>
      <div className='space-y-6'>
        {/* Pickup Location */}
        <div className='relative'>
          <Command className='bg-gray-700 text-white'>
            <CommandInput
              placeholder='Enter pickup location'
              value={pickup}
              onValueChange={setPickup}
            />
            <CommandList className='bg-black text-white'>
              <CommandGroup heading='Suggestions'>
                {pickupPrediction.length ? (
                  pickupPrediction.map(item => (
                    <CommandItem
                      key={item.place_id}
                      onSelect={() => {
                        setSelectedPickup({
                          description: item.description,
                          place_id: item.place_id
                        })
                        setPickup(item.description)
                      }}
                      className='text-white'
                    >
                      {item.description}
                    </CommandItem>
                  ))
                ) : (
                  <CommandEmpty>No results found.</CommandEmpty>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>

        {/* Dropoff Location */}
        <div className='relative'>
          <Command className='bg-gray-700 text-white'>
            <CommandInput
              placeholder='Enter dropoff location'
              value={destination}
              onValueChange={setDestination}
            />
            <CommandList className='bg-black text-white'>
              <CommandGroup heading='Suggestions'>
                {dropoffPrediction.length ? (
                  dropoffPrediction.map(item => (
                    <CommandItem
                      key={item.place_id}
                      onSelect={() => {
                        setSelectedDropoff({
                          description: item.description,
                          place_id: item.place_id
                        })
                        setDestination(item.description)
                      }}
                      className='text-white'
                    >
                      {item.description}
                    </CommandItem>
                  ))
                ) : (
                  <CommandEmpty>No results found.</CommandEmpty>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleRequest}
          className='w-full bg-gray-800 hover:bg-gray-700'
        >
          Request Ride
        </Button>
      </div>
    </div>
  )
}
