import { useQuery } from "@tanstack/react-query"
import { graphqlclient } from "../graphql-clients/api";
import { getAllTweetsQuery } from "../graphql/queries/tweet";

export const useGetAllTweets=(token: string | null)=>{
    const query=useQuery({
          queryKey: ["all-tweets"],
           enabled: Boolean(token),
           queryFn: async () => await graphqlclient.request(getAllTweetsQuery as any),
         });
    return query;
}