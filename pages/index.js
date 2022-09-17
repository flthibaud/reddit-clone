import Head from 'next/head'
import PostBox from '../src/components/PostBox'
import Feed from '../src/components/Feed'

export default function Home() {
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
      </div>
    </div>
  )
}
