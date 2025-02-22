import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'

export default async function Header () {
  const { userId } = await auth()

  return (
    <header className='bg-uber-gradient text-white p-4 shadow-lg'>
      <div className='container mx-auto flex justify-between items-center'>
        <Link href='/' className='text-2xl font-bold'>
          Uber Clone
        </Link>
        <nav>
          <ul className='flex space-x-4'>
            <li>{userId ? <UserButton /> : <SignInButton />}</li>
            <li>
              <Link href='/rider'>
                <Button variant='secondary'>Rider</Button>
              </Link>
            </li>
            <li>
              <Link href='/driver'>
                <Button variant='secondary'>Driver</Button>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
