"use client"

import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiHash, BiHomeCircle, BiMoney, BiUser } from "react-icons/bi";
import { BsBell, BsBookmark, BsEnvelope, BsTwitter } from "react-icons/bs";
import { SlOptions } from "react-icons/sl";
import { graphqlclient } from "../../graphql-clients/api";
import { verifyUserGoogleTokenQuery } from "../../graphql/queries/user";
import { useCurrentUser } from "../../hooks/user";
import FeedCard from "./components/FeedCard/index";

interface TwitterSidebarButton {
  title: string;
  icon: React.ReactNode;
}

const sidebarMenuItems: TwitterSidebarButton[] = [
  {
    title: "Home",
    icon: <BiHomeCircle />,
  },
  {
    title: "Explore",
    icon: <BiHash />,
  },
  {
    title: "Notifications",
    icon: <BsBell />,
  },
  {
    title: "Messages",
    icon: <BsEnvelope />,
  },
  {
    title: "Bookmarks",
    icon: <BsBookmark />,
  },
  {
    title: "Twitter Blue",
    icon: <BiMoney />,
  },
  {
    title: "Profile",
    icon: <BiUser />,
  },
  {
    title: "More",
    icon: <SlOptions />,
  },
];

export default function Home() {
  const queryClient = useQueryClient();
  const [authToken, setAuthToken] = useState<string | null>(null);
  const query = useCurrentUser(authToken);
  const user = query.data?.getCurrentUser;

  useEffect(() => {
    setAuthToken(window.localStorage.getItem("Twitter_token"));
  }, []);

  const handleLoginWithGoogle = useCallback(
    async (cred: CredentialResponse) => {
      const googleToken = cred.credential;
      if (!googleToken) {
        toast.error("Google token not found");
        return;
      }

      const { verifyGoogleToken } = await graphqlclient.request(
        verifyUserGoogleTokenQuery,
        {
          token: googleToken,
        }
      );

      if (verifyGoogleToken) {
        window.localStorage.setItem("Twitter_token", verifyGoogleToken);
        setAuthToken(verifyGoogleToken);
        await queryClient.invalidateQueries({ queryKey: ["current-user"] });
        toast.success("Verified Success");
      }
    },
    [queryClient]
  );

  return (
    <div>
      <div className="grid grid-cols-12 h-screen w-screen px-56">
        <div className="col-span-3 pt-8 px-4 ml-7">
          <div className="text-2xl w-fit h-fit hover:bg-gray-800 rounded-full p-4 cursor-pointer transition-all">
            <BsTwitter />
          </div>
          <div className="mt-1 text-lg pr-4">
            <ul>
              {sidebarMenuItems.map((item) => (
                <li
                  className="flex justify-start items-center gap-4 hover:bg-gray-800 rounded-2xl px-3 py-2 w-fit cursor-pointer mt-2"
                  key={item.title}
                >
                  <span className="text-3xl">{item.icon}</span>
                  <span>{item.title}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 px-3">
              <button className="bg-[#1d9bf0] rounded-full font-semibold text-lg w-full px-4 py-2">
                Tweet
              </button>
            </div>
          </div>
        </div>

        <div className="col-span-5 border-r-[1px] border-l-[1px] border-gray-600 h-screen overflow-y-scroll">
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
        </div>

        <div className="col-span-4 p-5">
          {!user && (
            <div className="p-5 bg-slate-700 rounded-lg">
              <h1 className="my-2 text-2xl">New To Twitter?</h1>
              <GoogleLogin
                onSuccess={(credentialResponse) =>
                  handleLoginWithGoogle(credentialResponse)
                }
                onError={() => console.log("Login Failed")}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
