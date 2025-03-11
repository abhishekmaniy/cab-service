'use client'

import { GoogleMap, Marker } from '@react-google-maps/api'
import { LocateIcon } from 'lucide-react'
import { useRef, useState } from 'react'
import { Button } from './ui/button'

export default function Map() {
  const center = { lat: 27.2467, lng: 17.1346 }
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null)
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')

  const originRef = useRef<HTMLInputElement | null>(null)
  const destinationRef = useRef<HTMLInputElement | null>(null)

  function clearRoute() {
    setDirectionsResponse(null)
    setDistance('')
    setDuration('')
    
    if (originRef.current) originRef.current.value = ''
    if (destinationRef.current) destinationRef.current.value = ''
  }

  return (
    <div className="bg-black h-64 md:h-96 rounded-lg overflow-hidden shadow-inner relative">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg w-full h-full">
          <GoogleMap
            center={center}
            zoom={15}
            mapContainerStyle={{ width: '100%', height: '100%' }}
            options={{
              zoomControl: false,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
            onLoad={(mapInstance) => setMap(mapInstance)}
          >
            <Marker position={center} />
          </GoogleMap>
          <Button onClick={clearRoute} className="absolute bottom-2 right-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-2">
            <LocateIcon />
          </Button>
        </div>
      </div>
    </div>
  )
}
