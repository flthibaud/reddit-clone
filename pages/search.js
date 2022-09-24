import React, { useEffect, useState } from 'react';
import {useRouter} from 'next/router';
import useSearch from '../src/store/store';
import Post from '../src/components/Post';

function Search() {
  const router = useRouter();
  const { searchResult } = useSearch();
  const clearSearch = useSearch((state) => state.clearSearch)

  const [buttonType, setButtonType] = useState('post');

  useEffect(() => {
    console.log(searchResult)
    if (searchResult === null || searchResult === undefined) {
      router.push('/')
    }
  }, [searchResult, router]);

  return (
    <div className='my-7 mx-auto max-w-5xl'>
      <div className='flex justify-between'>
        <div className='flex gap-2'>
          {searchResult !== null && Object.keys(searchResult).map((key) => (
            <div key={key}>
              <button
                className={`text-white font-bold py-2 px-4 rounded-full capitalize ${key === buttonType ? 'bg-[#272729] hover:bg-[#2F2F31]' : 'bg-transparent hover:bg-[#2F2F31]'}`}
                onClick={() => setButtonType(key)}
              >
                {key}
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={clearSearch}
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
        >
          Clear Search
        </button>
      </div>

      <div className='mt-5 space-y-4'>
        {searchResult !== null && searchResult[buttonType]?.edges?.map((item) => {
          if (buttonType === 'post') {
            return (
              <Post key={item.node.id} post={item} />
            )
          } else if (buttonType === 'comment') {
            return (
              <div key={item.node.id}>
                <p>{item.node.text}</p>
              </div>
            )
          } else if (buttonType === 'subreddit') {
            return (
              <div key={item.node.id}>
                <p>{item.node.topic}</p>
              </div>
            )
          }
        })}
      </div>
    </div>
  )
}

export default Search;