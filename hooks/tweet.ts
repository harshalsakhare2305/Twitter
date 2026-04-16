import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { graphqlclient } from "../graphql-clients/api";
import { getAllTweetsQuery } from "../graphql/queries/tweet";
import { CreateTweetData } from "../gql/graphql";
import { createTweetMutation } from "../graphql/mutations/tweet";
import toast from "react-hot-toast";

export const useCreateTweet = ()=>{
    const queryClient =useQueryClient();
 const mutation=useMutation({
    mutationFn:(payload:CreateTweetData)=>graphqlclient.request(createTweetMutation as any,{payload}),
    onMutate:()=>toast.loading("Creating Tweet",{id:"1"}),
    onSuccess:async()=>{
        await queryClient.invalidateQueries({queryKey:["all-tweets"]});
        toast.success("Tweet Created Successfully!",{id:"1"});
    }
    
    
 });

 return mutation;
}
export const useGetAllTweets=(token: string | null)=>{
    const query=useQuery({
          queryKey: ["all-tweets"],
           enabled: Boolean(token),
           queryFn: async () => await graphqlclient.request(getAllTweetsQuery as any),
         });
    return query;
}