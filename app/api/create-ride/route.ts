import db from '@/db'
import { Ride, RideStatus } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import amqp from 'amqplib'

const QUEUE_NAME = 'ride_requests'
const RABBITMQ_URL = process.env.RABBITMQ_URL!

async function publishRideRequest (ride: Ride) {
  const connection = await amqp.connect(RABBITMQ_URL)
  const channel = await connection.createChannel()
  await channel.assertQueue(QUEUE_NAME, { durable: true })

  const sent = channel.sendToQueue(
    QUEUE_NAME,
    Buffer.from(JSON.stringify(ride)),
    { persistent: true }
  )
  console.log(sent)

  if (sent) {
    console.log('✅ Ride successfully added to the queue')
  } else {
    console.log('❌ Failed to add ride to the queue')
  }

  await channel.close()
  await connection.close()
}

export async function POST (req: NextRequest) {
  try {
    const body = await req.json()
    const { pickup, dropoff, userId } = body

    if (!pickup || !dropoff || !userId) {
      return NextResponse.json({ error: 'Data not provided' }, { status: 400 })
    }

    // Create ride in the database
    const ride = await db.ride.create({
      data: {
        pickup,
        destination: dropoff,
        passengerId: userId,
        status: RideStatus.REQUESTED
      }
    })

    // Push ride request to RabbitMQ
    await publishRideRequest(ride)

    return NextResponse.json(
      { message: 'Ride created successfully and pushed to queue', ride },
      { status: 201 }
    )
  } catch (error) {
    console.log('Error creating ride', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
