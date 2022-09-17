import { gql } from "@apollo/client"

export const ADD_COMMENT = gql`
  mutation addComment($objects: [commentInsertInput!]!) {
    insertIntocommentCollection(objects: $objects) {
      records {
        id
        created_at
        post_id
        text
        username
      }
    }
  }
`;

export const ADD_POST = gql`
  mutation addPost($title: String!, $body: String!, $subreddit_id: ID!, $image: String, $username: String!) {
    insertIntopostCollection(objects: [{ title: $title, body: $body, subreddit_id: $subreddit_id, image: $image, username: $username }]) {
      records {
        id
        title
        body
        image
        username
        subreddit_id
      }
    }
  }
`;

export const ADD_SUBREDDIT = gql`
  mutation addSubreddit($topic: String!) {
    insertIntosubredditCollection(objects: [{ topic: $topic }]) {
      records {
        id
        topic
        created_at
      }
    }
  }
`;