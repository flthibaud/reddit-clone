import Head from 'next/head';
import PostBox from '../src/components/PostBox';
import Feed from '../src/components/Feed';
import { useQuery } from '@apollo/client';
import SubredditRow from '../src/components/SubredditRow';
import { useTheme } from 'next-themes'

import { GET_SUBREDDIT_WITH_LIMIT } from '../src/graphql/queries';

export default function Home() {
  const { theme, setTheme } = useTheme();
  const { data } = useQuery(GET_SUBREDDIT_WITH_LIMIT, {
    variables: {
      first: 10
    }
  })

  const subreddits = data?.subredditCollection?.edges

  return (
    <div className='my-7 mx-auto max-w-5xl'>
      <Head>
        <title>Reddit 2.0 Clone</title>
      </Head>

      {/* Postbox */}
      <PostBox />

      <div className='flex'>
        {/* Feed */}
        <Feed />

        {/* Sidebar */}
        <div className='sticky top-36 mx-5 mt-5 hidden h-fit min-w-[300px] lg:inline'>
          <div className='rounded-md border-gray-300 bg-white mb-5 dark:bg-[#1A1A1B]'>
            <p className='text-md mb-1 p-4 pb-3 font-bold'>Top Communities</p>

            {/* Communities */}
            <div>
              {subreddits?.map((subreddit, i) => (
                <SubredditRow
                  key={subreddit.node.id}
                  topic={subreddit.node.topic}
                  index={i}
                />
              ))}
            </div>
          </div>

          <div className='rounded-md border-gray-300 bg-white dark:bg-[#1A1A1B]'>
            <p className='text-md mb-1 p-4 pb-3 font-bold'>Settings</p>

            {/* Settings */}
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              toggle
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
