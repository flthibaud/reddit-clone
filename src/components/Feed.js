import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_POSTS, GET_ALL_POST_BY_TOPIC } from '../graphql/queries';
import Post from './Post';

function Feed({ topic }) {
  const { data, error } = !topic
  ? useQuery(GET_ALL_POSTS, {
    variables: {
      orderBy: [
        {
          created_at: "DescNullsFirst"
        }
      ]
    },
  })
  : useQuery(GET_ALL_POST_BY_TOPIC, {
    variables: {
      orderBy: [
        {
          created_at: "DescNullsFirst"
        }
      ],
      filter: {
        topic: {
          eq: topic
        }
      }
    },
  });

  const posts = !topic ? data?.postCollection?.edges : data?.subredditCollection?.edges[0]?.node?.postCollection?.edges;

  return (
    <div className='mt-5 space-y-4'>
      {posts?.map((post) => (
        <Post key={post.node.id} post={post} />
      ))}
    </div>
  )
}

export default Feed