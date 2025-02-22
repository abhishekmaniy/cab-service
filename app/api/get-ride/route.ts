import amqp from 'amqplib'
import { NextResponse } from 'next/server'

const RABBITMQ_URL = process.env.RABBITMQ_URL!
const QUEUE_NAME = process.env.QUEUE_NAME!

async function getRideFromQueue() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL)
    const channel = await connection.createChannel()

    await channel.assertQueue(QUEUE_NAME, { durable: true })

    console.log(`🚀 Waiting for a ride from queue: "${QUEUE_NAME}"`)

    const msg = await channel.get(QUEUE_NAME, { noAck: false }) 

    if (msg) {
      const ride = JSON.parse(msg.content.toString())
      console.log('✅ Ride received from queue:', ride)

      channel.ack(msg) // Acknowledge the message

      await channel.close()
      await connection.close()

      return ride
    } else {
      console.log('❌ No ride available in the queue.')
      await channel.close()
      await connection.close()
      return null
    }
  } catch (error) {
    console.error('Error consuming ride from queue:', error)
    return null
  }
}

export async function PATCH() {
  try {
    const ride = await getRideFromQueue()

    if (!ride) {
      return NextResponse.json({ message: 'No rides available' }, { status: 200 })
    }

    return NextResponse.json({ message: 'Ride fetched successfully', ride }, { status: 200 })
  } catch (error) {
    console.error('Error fetching ride:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
