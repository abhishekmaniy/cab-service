import { NextRequest, NextResponse } from 'next/server'
import { clerkClient, getAuth } from '@clerk/nextjs/server'
import { Role } from '@prisma/client'
import db from '@/db'

export async function POST (req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, role } = body


    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }

    const client = await clerkClient()

    const user = userId ? await client.users.getUser(userId) : undefined
    const roleEnum = role === 'rider' ? Role.PASSENGER : Role.CAPTAIN

    const existingUser = await db.user.findUnique({
      where: { id: userId }
    })

    if (existingUser && existingUser?.role !== roleEnum) {
      return NextResponse.json(
        { message: 'Role is Not matched' },
        { status: 400 }
      )
    }

    if (existingUser) {
      return NextResponse.json({ user: existingUser }, { status: 200 })
    }

    const newUser = await db.user.create({
      data: {
        id: userId,
        name: `${user?.firstName} ${user?.lastName}`,
        email: user?.emailAddresses[0]?.emailAddress || '',
        role: roleEnum,
        rides: { connect: [] }
      }
    })

    return NextResponse.json(
      { message: 'User created successfully', user: newUser },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
