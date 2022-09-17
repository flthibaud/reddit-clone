import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { LinkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import client from '../../apollo-client';

import Avatar from './Avatar';
import { ADD_POST, ADD_SUBREDDIT } from '../graphql/mutations';
import { GET_ALL_POSTS, GET_SUBREDDIT_BY_TOPIC } from '../graphql/queries';
import toast from 'react-hot-toast';

function PostBox() {
  const { data: session } = useSession();
  const [addPost] = useMutation(ADD_POST, {
    refetchQueries: [
      GET_ALL_POSTS,
      'getAllPosts',
    ],
  });
  const [addSubreddit] = useMutation(ADD_SUBREDDIT);
  const [imageBoxOpen, setImageBoxOpen] = useState(false);
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  console.log('session', session);

  const onSubmit = handleSubmit(async (formData) => {
    console.log(formData.subreddit);
    const notification = toast.loading('Creating new post...');

    try {
      // Query for the subreddit topic
      const { data: getSubredditListByTopic } = await client.query({
        query: GET_SUBREDDIT_BY_TOPIC,
        fetchPolicy: 'no-cache',
        variables: {
          topic: formData.subreddit,
        },
      });

      const subredditExists = getSubredditListByTopic.subredditCollection.edges.length > 0;

      if (!subredditExists) {
        // Create the subreddit
        console.log('Creating subreddit');
        const {
          data: { insertIntosubredditCollection }
        } = await addSubreddit({
          variables: {
            topic: formData.subreddit,
          },
        });

        const image = formData.postImage || '';

        const { data } = await addPost({
          variables: {
            title: formData.postTitle,
            body: formData.postBody,
            subreddit_id: insertIntosubredditCollection.records[0].id,
            image,
            username: session?.user?.name,
          },
        })

        console.log('New post added: ', data);
      } else {
        // Use the existing subreddit ID
        console.log('Subreddit already exists');
        const subredditId = getSubredditListByTopic.subredditCollection.edges[0].node.id;
        const image = formData.postImage || '';
        const { data } = await addPost({
          variables: {
            title: formData.postTitle,
            body: formData.postBody,
            subreddit_id: subredditId,
            image,
            username: session?.user?.name,
          },
        });

        console.log(data);
      }

      // After the post is added, clear the form
      setValue('postBody', '');
      setValue('postTitle', '');
      setValue('subreddit', '');
      setValue('postImage', '');

      toast.success('Post created successfully!', {
        id: notification,
      });
    } catch (error) {
      toast.error('Error creating post', {
        id: notification,
      });
    }
  });


  return (
    <form
      onSubmit={onSubmit}
      className='sticky top-16 z-50 bg-white border rounded-md border-gray-300 p-2'
    >
      <div className='flex items-center space-x-3'>
        {/* Avatar */}
        <Avatar />

        <input
          {...register('postTitle', { required: true })}
          disabled={!session}
          className="bg-gray-50 p-2 pl-5 outline-none rounded-md flex-1"
          type="text"
          placeholder={session ? 'Create a post by entering a title !' : 'Sign in to post'}
        />

        <PhotoIcon onClick={() => setImageBoxOpen(!imageBoxOpen)} className={`h-6 text-gray-300 cursor-pointer ${imageBoxOpen && 'text-blue-300'}`} />
        <LinkIcon className='h-6 text-gray-300 cursor-pointer' />
      </div>

      {!!watch('postTitle') && (
        <div className='flex flex-col py-2'>
          <div className='flex items-center px-2'>
            <p className='min-w-[90px]'>Body:</p>
            <input
              {...register('postBody')}
              type="text"
              placeholder='Text (optional)'
              className='m-2 flex-1 bg-blue-50 outline-none'
            />
          </div>

          <div className='flex items-center px-2'>
            <p className='min-w-[90px]'>Subreddit:</p>
            <input
              {...register('subreddit', { required: true })}
              type="text"
              placeholder='i.e. reactjs'
              className='m-2 flex-1 bg-blue-50 outline-none'
            />
          </div>

          {imageBoxOpen && (
            <div className='flex items-center px-2'>
              <p className='min-w-[90px]'>Image URL:</p>
              <input
                {...register('postImage')}
                type="text"
                placeholder='Optional'
                className='m-2 flex-1 bg-blue-50 outline-none'
              />
            </div>
          )}

          {/* Errors */}
          {Object.keys(errors).length > 0 && (
            <div className='space-y-2 p-2 text-red-500'>
              {errors.postTitle?.type === 'required' && (
                <p>A Post Title is required</p>
              )}

              {errors.subreddit?.type === 'required' && (
                <p>A Subreddit is required</p>
              )}
            </div>
          )}

          {!!watch('postTitle') && (
            <button
              type='submit'
              className='w-full rounded-full bg-blue-400 p-2 text-white'
            >
              Create Post
            </button>
          )}
        </div>
      )}
    </form>
  )
}

export default PostBox