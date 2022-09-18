import React from 'react'
import { useRouter } from 'next/router'
import { useQuery, useMutation } from '@apollo/client';
import { GET_POST_BY_POST_ID } from '../../src/graphql/queries';
import { ADD_COMMENT } from '../../src/graphql/mutations';
import Post from '../../src/components/Post';
import { useSession } from 'next-auth/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Avatar from '../../src/components/Avatar';
import moment from 'moment';

function PostPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [addComment] = useMutation(ADD_COMMENT, {
    refetchQueries: [GET_POST_BY_POST_ID, 'getPostByPostId'],
  });
  const { data } = useQuery(GET_POST_BY_POST_ID, {
    variables: {
      filter: {
        id: {
          eq: router.query.postId
        }
      }
    }
  });

  const post = data?.postCollection?.edges[0];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    // Add comment to post
    const notification = toast.loading('Posting your comment...');

    await addComment({
      variables: {
        objects: [
          {
            post_id: router.query.postId,
            text: data.comment,
            username: session.user.name,
          }
        ]
      }
    });

    setValue('comment', '');

    toast.success('Comment posted!', {
      id: notification,
    })
  }

  return (
    <div className='mx-auto my-7 max-w-5xl'>
      <Post post={post} />

      {/* Comments Form */}
      <div className='-mt-1 rounded-b-md border border-t-0 border-gray-300 bg-white p-5 pl-16'>
        <p className='text-sm'>
          Comment as <span className='text-red-500'>{session?.user?.name}</span>
        </p>

        <form
          className='flex flex-col space-y-2'
          onSubmit={handleSubmit(onSubmit)}
        >
          <textarea
            {...register('comment', { required: true })}
            disabled={!session}
            className='h-24 rounded-md border border-gray-200 p-2 pl-4 outline-none disabled:bg-gray-50'
            placeholder={session ? 'Add a comment...' : 'Log in to comment'}
          />

          <button
            type='submit'
            className='rounded-full bg-red-500 p-3 font-semibold text-white disabled:bg-gray-200'
          >
            Comment
          </button>
        </form>
      </div>

      {/* Comments */}
      <div className='-my-5 rounded-b-md border border-t-0 border-gray-300 bg-white py-5 px-10'>
        <hr className='py-2' />
        {post?.node?.commentCollection?.edges.map((comment) => (
          <div
            className='relative flex items-center space-x-2 space-y-5'
            key={comment.node.id}
          >
            <hr className='absolute top-10 h-16 border left-7 z-0' />
            <div className='z-50'>
              <Avatar seed={comment.username} />
            </div>

            <div className='flex flex-col'>
              <p className='py-2 text-xs text-gray-400'>
                <span className='font-semibold text-gray-600'>{comment.node.username}</span>
                {' '}
                {moment(comment.node.created_at).fromNow()}
              </p>
              <p>
                {comment.node.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PostPage;