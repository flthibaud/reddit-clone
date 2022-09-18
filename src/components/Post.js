import React, { useState, useEffect } from 'react'
import moment from 'moment'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BookmarkIcon,
  ChatBubbleLeftEllipsisIcon,
  EllipsisHorizontalIcon,
  GiftIcon,
  ShareIcon
} from '@heroicons/react/24/outline'
import Avatar from './Avatar'
import Image from 'next/image'
import Link from 'next/link'
import { Jelly } from '@uiball/loaders';
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { useQuery, useMutation } from '@apollo/client'

import { GET_ALL_VOTES_BY_POST_ID } from '../graphql/queries'
import { ADD_VOTE } from '../graphql/mutations'

function Post({ post }) {
  const [imageDimensions, setImageDimensions] = useState({});
  const [imageLoaded, setImageLoaded] = useState(false);
  const [vote, setVote] = useState(undefined);
  const { data: session } = useSession();

  const { data, loading } = useQuery(GET_ALL_VOTES_BY_POST_ID, {
    variables: {
      orderBy: [
        {
          created_at: "DescNullsFirst"
        }
      ],
      filter: {
        post_id: {
          eq: post?.node.id
        },
      }
    }
  })
  
  const [addVote] = useMutation(ADD_VOTE, {
    refetchQueries: [GET_ALL_VOTES_BY_POST_ID, 'getAllVotesByPostId'],
  })

  const upVote = async (isUpvote) => {
    if (!session) {
      toast('You must be logged in to vote');
    }

    if (vote && isUpvote) return;
    if (vote === false && !isUpvote) return;

    await addVote({
      variables: {
        objects: [
          {
            post_id: post.node.id,
            upvote: isUpvote,
            username: session?.user?.name,
          }
        ]
      }
    })
  }

  useEffect(() => {
    const votes = data?.voteCollection?.edges;
    const userVote = votes?.find(vote => vote.node.username === session?.user?.name);
    setVote(userVote?.node.upvote);
  }, [data, session])

  const displayVotes = (data) => {
    const votes = data?.voteCollection?.edges;
    const displayNumber = votes?.reduce((total, vote) => vote.node.upvote ? total += 1 : total -= 1 , 0);

    if (votes?.length === 0) return 0;

    if (displayNumber === 0) {
      return votes[0].node.upvote ? 1 : -1;
    }

    return displayNumber;
  }

  if (!post) {
    return (
      <div className='flex w-full items-center justify-center p-10 text-xl'>
        <Jelly size={50} color="#FF4501" />
      </div>
    )
  }

  return (
    <Link href={`/post/${post.node.id}`}>
      <div className='flex cursor-pointer rounded-md border border-gray-300 bg-white shadow-sm hover:border hover:border-gray-600'>
        {/* Votes */}
        <div className='flex flex-col items-center justify-start space-y-1 rounded-l-md bg-gray-50 p-4 text-gray-400'>
          <ArrowUpIcon
            className={`voteButtons hover:text-red-400 ${vote &&'text-red-400'}`}
            onClick={() => upVote(true)}
          />
          <p className='text-black font-bold text-xs'>
            {displayVotes(data)}
          </p>
          <ArrowDownIcon
            className={`voteButtons hover:text-blue-400 ${vote === false &&'text-blue-400'}`}
            onClick={() => upVote(false)}
          />
        </div>

        <div className='p-3 pb-1'>
          {/* Header */}
          <div className='flex items-center space-x-2'>
            <Avatar seed={ post.node.subreddit.topic } />
            <p className='text-xs text-gray-400'>
              <Link href={`/subreddit/${post.node.subreddit.topic}`}>
                <span className='font-bold text-black hover:text-blue-400 hover:underline'>r/{ post.node.subreddit.topic }</span>
              </Link>
              {' '}
              • Posted by u/{post.node.username} {moment(post.node.created_at).fromNow()}
            </p>
          </div>

          {/* Body */}
          <div className='py-4'>
            <h2 className='text-xl font-semibold'>{post.node.title}</h2>
            <p className='mt-2 text-sm font-light'>{post.node.body}</p>
          </div>

          {/* Image */}
          {post.node.image && (
            <div className='relative'>
              <Image
                src={post.node.image}
                alt='Post Image'
                className='rounded-md'
                priority={true}
                objectFit='cover'
                placeholder='blur'
                layout={imageLoaded ? '' : 'fill'}
                blurDataURL={post.node.image}
                width={imageDimensions.width}
                height={imageDimensions.height}
                onLoadingComplete={target => {
                  setImageLoaded(true);
                  setImageDimensions({
                    width: target.naturalWidth,
                    height: target.naturalHeight
                  });
                }}
              />
            </div>
          )}

          {/* Footer */}
          <div className='flex space-x-4 text-gray-400'>
            <div className='postButton'>
              <ChatBubbleLeftEllipsisIcon className='h-6 w-6' />
              <p className=''>
                {post.node.commentCollection.edges.length} Comments
              </p>
            </div>

            <div className='postButton'>
              <GiftIcon className='h-6 w-6' />
              <p className='hidden sm:inline'>
                Award
              </p>
            </div>

            <div className='postButton'>
              <ShareIcon className='h-6 w-6' />
              <p className='hidden sm:inline'>
                Share
              </p>
            </div>

            <div className='postButton'>
              <BookmarkIcon className='h-6 w-6' />
              <p className='hidden sm:inline'>
                Save
              </p>
            </div>

            <div className='postButton'>
              <EllipsisHorizontalIcon className='h-6 w-6' />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default Post