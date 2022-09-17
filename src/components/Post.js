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

function Post({ post }) {
  const [imageDimensions, setImageDimensions] = useState({});
  const [imageLoaded, setImageLoaded] = useState(false);

  if (post === undefined) {
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
          <ArrowUpIcon className='voteButtons hover:text-red-400' />
          <p className='text-black font-bold text-xs'>0</p>
          <ArrowDownIcon className='voteButtons hover:text-blue-400' />
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