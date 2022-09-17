import { gql } from "@apollo/client";

export const GET_ALL_POSTS = gql`
  query getAllPosts($orderBy: [postOrderBy!]) {
    postCollection(orderBy: $orderBy) {
      edges {
        node {
          body
          created_at
          id
          image
          title
          subreddit_id
          username
          subreddit {
            id
            created_at
            topic
          }
          voteCollection {
            edges {
              node {
                created_at
                id
                post_id
                upvote
                username
              }
            }
          }
          commentCollection {
            edges {
              node {
                created_at
                id
                post_id
                text
                username
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_SUBREDDIT_BY_TOPIC = gql`
query ExampleQuery($topic: String!) {
  subredditCollection(filter: {topic: {eq: $topic}}) {
    edges {
      node {
        id
        topic
        created_at
      }
    }
  }
}
`