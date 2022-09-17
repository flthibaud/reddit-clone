import { gql } from "@apollo/client";

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