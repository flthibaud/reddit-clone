import { gql } from "@apollo/client";

export const GET_POST_BY_POST_ID = gql`
  query getPostByPostId($filter: postFilter) {
    postCollection(filter: $filter) {
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

export const GET_ALL_POST_BY_TOPIC = gql`
query getAllPostsByTopic($orderBy: [postOrderBy!], $filter: subredditFilter) {
  subredditCollection(filter: $filter) {
    edges {
      node {
        postCollection(orderBy: $orderBy) {
          edges {
            node {
              id
              created_at
              title
              body
              image
              username
              subreddit_id
              commentCollection {
                edges {
                  node {
                    id
                    created_at
                    post_id
                    text
                    username
                  }
                }
              }
              voteCollection {
                edges {
                  node {
                    id
                    created_at
                    post_id
                    upvote
                    username
                  }
                }
              }
              subreddit {
                id
                created_at
                topic
              }
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