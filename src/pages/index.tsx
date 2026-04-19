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
import { useCreateTweet, useGetAllTweets } from "../../hooks/tweet";
import TwitterLayout from "./components/layouts/TwitterLayout";

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
  const query = useCurrentUser();

  const TweetQuery =useGetAllTweets(authToken);
  const tweets =TweetQuery.data?.getAllTweets;

  const {mutate} =useCreateTweet();

  const [content,SetContent] =useState("");
  
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
 



  const handleCreateTweet =useCallback(()=>{
     mutate({
      content
     })
  },[content,mutate])

  return (
   < TwitterLayout>
    
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
                  <textarea value={content} 
                  onChange={e=>SetContent(e.target.value)}
                  placeholder="What's happening ? " className="w-full bg-transparent text-xl px-3 border-b border-slate-700 " rows={3}></textarea>

                  <div className="mt-2 flex justify-between items-center">
                    <BiImageAlt onClick={handleSelectImage} className="text-xl" />
                    <button onClick={handleCreateTweet} className="bg-[#1d9bf0] rounded-full font-semibold text-sm  px-4 py-2">
                      Tweet
                    </button>
                  </div>

                </div>




              </div>


            </div>
          </div>


             {
              tweets?.map((tweet: any) => tweet ?<FeedCard key={tweet?.id} data={tweet} />: null)
             }
   </TwitterLayout>
  );
}
