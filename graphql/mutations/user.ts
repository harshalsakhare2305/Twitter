import { graphql } from "../../gql";

export const followUserMutation=graphql(`#graphql
        mutation FollowUser($to: ID!) {
  followUser(to: $to)
}
    `);


export const UnfollowUserMutation =graphql(`#graphql
       mutation unfollowUser($to: ID!) {
  UnfollowUser(to: $to)
}  
  
`)