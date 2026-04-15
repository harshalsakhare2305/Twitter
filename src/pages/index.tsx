"use client"

import Image from "next/image";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiHash, BiHomeCircle, BiImageAlt, BiMoney, BiUser } from "react-icons/bi";
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


  const handleSelectImage = useCallback(()=>{
      const input =document.createElement('input');
    
      input.setAttribute('type','file');
      input.setAttribute('accept','image/*');
      input.click();
  },[])
 

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




          <div>
            <div className='border border-r-0 border-l-0  border-b-0 border-gray-600 p-5 hover:bg-slate-900 transition-all cursor-pointer'>
              <div className='grid grid-cols-12 gap-3'>

                <div className="col-span-1">
                  {

                    user?.profileImageURL && (<Image src={user?.profileImageURL} alt='user-image'
                      height={50} width={50} className="rounded-full " />)
                  }
                </div>

                <div className="col-span-11">
                  <textarea placeholder="What's happening ? " className="w-full bg-transparent text-xl px-3 border-b border-slate-700 " rows={3}></textarea>

                  <div className="mt-2 flex justify-between items-center">
                    <BiImageAlt onClick={handleSelectImage} className="text-xl" />
                    <button className="bg-[#1d9bf0] rounded-full font-semibold text-sm  px-4 py-2">
                      Tweet
                    </button>
                  </div>

                </div>




              </div>


            </div>
          </div>


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
