import { prisma, RideStatus } from '@repo/db'
import { NextResponse } from 'next/server'

export const POST = async (req: Request) => {
  try {
    const { riderId, pickupLat, pickupLng, destinationLat, destinationLng } = await req.json()
    console.log(riderId, pickupLat, pickupLng, destinationLat, destinationLng)

    if (
      !riderId ||
      !pickupLat ||
      !pickupLng ||
      !destinationLat ||
      !destinationLng
    ) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const ride = await prisma.ride.create({
      data: {
        passengerId: riderId,
        pickupLat,
        pickupLng,
        destinationLat,
        destinationLng,
        status: RideStatus.REQUESTED
      }
    })

    return NextResponse.json(ride , { status: 201 })
  } catch (error) {
    console.error('Error In Create Ride', error)
    return NextResponse.json(
      { error : 'Internal server error' },
      { status : 500 }
    )
  }
}
