import React from 'react';
import Image from 'next/image';
import {
  BellIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  GlobeEuropeAfricaIcon,
  PlusIcon,
  SparklesIcon,
  MegaphoneIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
} from '@heroicons/react/24/solid';
import { signIn, signOut, useSession } from 'next-auth/react';

function Header() {
  const { data: session } = useSession();
  return (
    <div className='sticky top-0 z-50 flex bg-white px-4 py-2 shadow-sm'>
      <div className='relative h-10 w-20 flex-shrink-0 cursor-pointer'>
        <Image
          src="/images/reddit-logo.png"
          alt='Reddit Logo'
          layout='fill'
          objectFit='contain'
        />
      </div>

      <div className='flex items-center mx-7 xl:min-w-[300px]'>
        <HomeIcon className='h-5 w-5' />
        <p className='flex-1 ml-2 hidden lg:inline'>Home</p>
        <ChevronDownIcon className='h-5 w-5' />
      </div>

      {/* Search */}
      <form className='flex flex-1 items-center space-x-2 border border-gray-200 rounded-sm bg-gray-100 px-3 py-1'>
        <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
        <input className='flex-1 bg-transparent outline-none' type="text" placeholder='Search Reddit' />
        <button type='submit' hidden />
      </form>

      {/* Icons */}
      <div className='text-gray-500 items-center space-x-2 mx-5 hidden lg:inline-flex'>
        <SparklesIcon className='icon' />
        <GlobeEuropeAfricaIcon className='icon' />
        <VideoCameraIcon className='icon' />
        <hr className='h-10 border border-gray-100' />
        <ChatBubbleOvalLeftEllipsisIcon className='icon' />
        <BellIcon className='icon' />
        <PlusIcon className='icon' />
        <MegaphoneIcon className='icon' />
      </div>
      <div className='ml-5 flex items-center lg:hidden'>
        <Bars3Icon className='icon' />
      </div>

      {/* SignIn / Sign out button */}
      {session ? (
        <div
          onClick={() => signOut()}
          className='hidden lg:flex items-center space-x-2 border border-gray-100 p-2 cursor-pointer'
        >
          <div className='relative h-5 w-5 flex-shrink-0'>
            <Image
              src="/images/reddit-head.png"
              alt="logo reddit"
              layout='fill'
              objectFit='contain'
              height={5}
              width={5}
            />
          </div>
  
          <div className='flex-1 text-xs'>
            <p className='truncate'>{session?.user?.name}</p>
            <p className='text-sm font-semibold text-gray-400'>1 Karma</p>
          </div>

          <ChevronDownIcon className='h-5 w-5 flex-shrink-0 text-gray-400' />
        </div>
      ) : (
        <div
          onClick={() => signIn()}
          className='hidden lg:flex items-center space-x-2 border border-gray-100 p-2 cursor-pointer'
        >
          <div className='relative h-5 w-5 flex-shrink-0'>
            <Image
              src="/images/reddit-head.png"
              alt="logo reddit"
              layout='fill'
              objectFit='contain'
              height={5}
              width={5}
            />
          </div>

          <p className='text-sm font-semibold text-gray-400'>Sign In</p>
        </div>
      )}

    </div>
  )
}

export default Header