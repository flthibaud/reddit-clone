import Head from 'next/head'
import PostBox from '../src/components/PostBox'
import Feed from '../src/components/Feed'
import { useQuery } from '@apollo/client'
import SubredditRow from '../src/components/SubredditRow'

import { GET_SUBREDDIT_WITH_LIMIT } from '../src/graphql/queries'

export default function Home() {
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

        <div className='sticky top-36 mx-5 mt-5 hidden h-fit min-w-[300px] rounded-md border-gray-300 bg-white lg:inline'>
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
      </div>
    </div>
  )
}
