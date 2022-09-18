import React from 'react';
import { useRouter } from 'next/router';
import Avatar from '../../src/components/Avatar';
import PostBox from '../../src/components/PostBox';
import Feed from '../../src/components/Feed';

function Subreddit() {
  const { query: { topic } } = useRouter();
  return (
    <div className={`h-24 bg-red-400 p-8`}>
      <div className='-mx-8 mt-10 bg-white dark:bg-[#1A1A1B]'>
        <div className='mx-auto flex max-w-5xl items-center space-x-4 pb-3'>
          <div className='-mt-5'>
            <Avatar seed={topic} large />
          </div>
          <div className='py-2'>
            <h1 className='text-3xl font-semibold'>Welcome to the r/{topic} subreddit</h1>
            <p className='text-sm text-gray-400'>r/{topic}</p>
          </div>
        </div>
      </div>

      <div className='mx-auto max-w-5xl mt-5 pb-10'>
        <PostBox subreddit={topic} />
        <Feed topic={topic} />
      </div>
    </div>
  )
}

export default Subreddit;