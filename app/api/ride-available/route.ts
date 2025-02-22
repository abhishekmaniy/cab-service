import db from '@/db'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH (req: NextRequest) {
  try {
    const body = await req.json()
    const { isAvailable, userId } = body

    if (isAvailable === null && !userId) {
      return NextResponse.json({ error: 'Status required' }, { status: 400 })
    }

    console.log(isAvailable)

    const updatedUser = await db.user.update({
      where: {
        id: userId
      },
      data: {
        available: isAvailable
      }
    })

    return NextResponse.json(
      { message: 'ride created successfully', updatedUser },
      { status: 200 }
    )
  } catch (error) {
    console.log('Error ubdating Availablity ', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
