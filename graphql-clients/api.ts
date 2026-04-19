// graphql-clients/api.ts
import { GraphQLClient } from 'graphql-request';

export const graphqlclient = new GraphQLClient("http://localhost:4000/graphql", {
  headers: () => ({                   
    Authorization:`Bearer ${window.localStorage.getItem('Twitter_token')}`
  }),
});

// A separate SSR-safe client factory:
export const getServerSideClient = (token?: string) =>{
    
  console.log("Token From GraphQL serverside client",token);

   return new GraphQLClient("http://localhost:4000/graphql", {
    headers: {
      Authorization: `Bearer ${token ?? ""}`,
    },
  });
}
  
