"use client"
import { graphql } from "../../gql";

export const getAllTweetsQuery = graphql(`
  query GetAllTweets {
    getAllTweets {
      id
      content
      imageURL
      author {
      id
        firstName
        lastName
        profileImageURL
      }
    }
  }
`);

export const getSignedURLTweetQuery=graphql(`#graphql
  query GetSignedURL($imageType: String!, $imagename: String!) {
  getSignedURLForTweet(imageType: $imageType, Imagename: $imagename)
}`)