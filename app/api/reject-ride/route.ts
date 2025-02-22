import { NextResponse } from 'next/server'
import amqp from 'amqplib'

const QUEUE_NAME = process.env.QUEUE_NAME!
const RABBITMQ_URL = process.env.RABBITMQ_URL!

async function republishRide (ride: any) {
  const connection = await amqp.connect(RABBITMQ_URL)
  const channel = await connection.createChannel()
  await channel.assertQueue(QUEUE_NAME, { durable: true })

  channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(ride)), {
    persistent: true
  })

  console.log('Ride request pushed back to queue:', ride)
  setTimeout(() => connection.close(), 500)
}

export async function POST (req: Request) {
  try {
    const body = await req.json()
    const { ride } = body

    if (!ride) {
      return NextResponse.json({ error: 'Ride not provided' }, { status: 400 })
    }

    await republishRide(ride)

    return NextResponse.json(
      { message: 'Ride pushed back to queue' },
      { status: 200 }
    )
  } catch (error) {
    console.log('Error rejecting ride', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
