"use client"

import { useQuery } from "@tanstack/react-query";
import { graphqlclient } from "../graphql-clients/api";
import { getCurrentUserQuery } from "../graphql/queries/user";

export const useCurrentUser = (token: string | null) => {
  return useQuery({
    queryKey: ["current-user", token],
    enabled: Boolean(token),
    queryFn: () => graphqlclient.request(getCurrentUserQuery),
  });
};
