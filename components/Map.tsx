'use client'

import { useLocationStore } from '@/app/store/locationStore'
import { useEffect, useRef, useState } from 'react'

export default function Map() {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const { setLocation } = useLocationStore()
  const [isLoaded, setIsLoaded] = useState(false)

  // Initialize map
  const initMap = (position: { latitude: number; longitude: number } | null) => {
    if (!mapRef.current || !window.google || !window.google.maps) return

    const userLatLng = position
      ? { lat: position.latitude, lng: position.longitude }
      : { lat: 40.1215, lng: -100.4503 }

    const map = new window.google.maps.Map(mapRef.current, {
      center: userLatLng,
      zoom: 10
    })

    new window.google.maps.Marker({
      map,
      position: userLatLng,
      title: 'Your Location'
    })
  }

  useEffect(() => {
    if (window.google && window.google.maps) {
      setIsLoaded(true)
      return
    }

    const loadScript = (url: string) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = url
        script.async = true
        script.defer = true
        script.onload = resolve
        script.onerror = reject
        document.head.appendChild(script)
      })
    }

    loadScript(`https://maps.googleapis.com/maps/api/js?key=AIzaSyCsbpXh8pOVSYxfBy0-ygqN7o84NYusTUA`)
      .then(() => {
        setIsLoaded(true)
      })
      .catch((error) => {
        console.error('Error loading Google Maps script:', error)
      })
  }, [])

  useEffect(() => {
    if (!isLoaded) return

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          if (isFinite(latitude) && isFinite(longitude)) {
            setLocation({ latitude, longitude })
            initMap({ latitude, longitude })
          } else {
            console.error('Invalid coordinates received from geolocation.')
            initMap(null)
          }
        },
        (error) => {
          console.warn('User denied location access:', error.message)
          initMap(null)
        }
      )
    } else {
      console.error('Geolocation is not supported by this browser.')
      initMap(null)
    }
  }, [isLoaded])

  return (
    <div className='bg-black h-64 md:h-96 rounded-lg overflow-hidden shadow-inner relative'>
      <div className='absolute inset-0 flex items-center justify-center'>
        <div className='bg-white rounded-lg shadow-lg w-full h-full'>
          {!isLoaded ? (
            <p className='text-gray-500 text-center'>Loading map...</p>
          ) : (
            <div ref={mapRef} className='w-full h-full'></div>
          )}
        </div>
      </div>
    </div>
  )
}
