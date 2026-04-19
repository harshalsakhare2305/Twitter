"use client"

import { useQuery } from "@tanstack/react-query";
import { graphqlclient } from "../graphql-clients/api";
import { getCurrentUserQuery } from "../graphql/queries/user";

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["current-user"],
    enabled: true,
    queryFn: () => graphqlclient.request(getCurrentUserQuery),
  });
};
