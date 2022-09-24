import React, { useEffect, useState } from 'react';
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
import { useForm } from 'react-hook-form';
import client from '../../apollo-client';
import Link from 'next/link';
import { useRouter } from "next/router";

import { GET_SEARCH } from '../graphql/queries';
import useSearch from '../store/store';

function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState(null);
  const setSearch = useSearch((state) => state.setSearchResult);
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    async function getUserImage() {
      const res = await fetch(`https://www.reddit.com/user/${session?.user?.name}/about.json`)
      const data = await res.json()
      
      if (data.data.snoovatar_img) {
        setUserInfo({
          image: data.data.snoovatar_img,
          karma: data.data.total_karma
        })
      } else {
        setUserInfo({
          image: data.data.icon_img,
          karma: data.data.total_karma
        })
      }
    }

    if (session) {
      getUserImage()
    }

    return () => {
      setUserInfo(null)
    }
  }, [session])

  const onSubmit = handleSubmit(async (formData) => {
    try {
      // Query for the subreddit topic
      const { data: searchResult, loading } = await client.query({
        query: GET_SEARCH,
        fetchPolicy: 'no-cache',
        variables: {
          filter: {
            title: {
              gt: formData.searchField,
            }
          },
          subredditCollectionFilter2: {
            topic: {
              gt: formData.searchField,
            }
          },
          commentCollectionFilter2: {
            text: {
              gt: formData.searchField,
            }
          }
        }
      });

      setSearch(searchResult);
      router.push("/search");
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <div className='sticky top-0 z-50 flex bg-white px-4 py-2 shadow-sm items-center dark:bg-[#1A1A1B]'>
      <div className='relative h-10 w-20 flex-shrink-0 cursor-pointer'>
        <Link href="/">
          <Image
            src="/images/reddit-logo.png"
            alt='Reddit Logo'
            layout='fill'
            objectFit='contain'
          />
        </Link>
      </div>

      <div className='flex items-center mx-7 xl:min-w-[300px]'>
        <HomeIcon className='h-5 w-5' />
        <p className='flex-1 ml-2 hidden lg:inline'>Home</p>
        <ChevronDownIcon className='h-5 w-5' />
      </div>

      {/* Search */}
      <form
        onSubmit={onSubmit}
        className='flex flex-1 items-center space-x-2 border border-gray-200 rounded-sm bg-gray-100 px-3 py-1 dark:bg-[#272729] dark:border-gray-600'
      >
        <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
        <input
          {...register('searchField', { required: true })}
          className='flex-1 bg-transparent outline-none'
          type="text"
          placeholder='Search Reddit'
        />
        <button type='submit' hidden />
      </form>

      {/* Icons */}
      <div className='text-gray-500 items-center space-x-2 mx-5 hidden lg:inline-flex dark:text-[#d7dadc]'>
        <SparklesIcon className='icon' />
        <GlobeEuropeAfricaIcon className='icon' />
        <VideoCameraIcon className='icon' />
        <hr className='h-10 border border-gray-100 dark:border-gray-600' />
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
          className='hidden lg:flex items-center space-x-2 border border-gray-100 p-2 cursor-pointer dark:border-gray-600'
        >
          <div className='relative h-5 w-5 flex-shrink-0'>
            <Image
              src={userInfo?.image || '/images/reddit-head.png'}
              alt="Avatar"
              layout='fill'
              objectFit='contain'
              height={5}
              width={5}
            />
          </div>
  
          <div className='flex-1 text-xs'>
            <p className='truncate'>{session?.user?.name}</p>
            <p className='text-sm font-semibold text-gray-400'>{userInfo?.karma} karma</p>
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