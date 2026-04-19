import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { BiHash, BiHomeCircle, BiImageAlt, BiMoney, BiUser } from 'react-icons/bi';
import { BsBell, BsBookmark, BsEnvelope, BsTwitter } from 'react-icons/bs';
import { SlOptions } from 'react-icons/sl';

import { useQueryClient } from '@tanstack/react-query';

import { useCurrentUser } from '../../../../hooks/user';
import toast from 'react-hot-toast';
import { graphqlclient } from '../../../../graphql-clients/api';
import { verifyUserGoogleTokenQuery } from '../../../../graphql/queries/user';
import Image from 'next/image';
import Link from 'next/link';


interface TwitterLayoutProps{
    children:React.ReactNode;
}

interface TwitterSidebarButton {
  title: string;
  icon: React.ReactNode;
  link: string;
}






const TwitterLayout: React.FC<TwitterLayoutProps> = (props) => {

 
  const queryClient = useQueryClient();
  const [authToken, setAuthToken] = useState<string | null>(null);
  const query = useCurrentUser();

  const user = query.data?.getCurrentUser;

  useEffect(() => {
    setAuthToken(window.localStorage.getItem("Twitter_token"));
  }, []);


   const sidebarMenuItems:TwitterSidebarButton[] = useMemo(()=> [
  {
    title: "Home",
    icon: <BiHomeCircle />,
    link:'/'
  },
  {
    title: "Explore",
    icon: <BiHash />,
     link:'/',
  },
  {
    title: "Notifications",
    icon: <BsBell />,
     link:'/',
  },
  {
    title: "Messages",
    icon: <BsEnvelope />,
     link:'/',
  },
  {
    title: "Bookmarks",
    icon: <BsBookmark />,
     link:'/',
  },
  {
    title: "Twitter Blue",
    icon: <BiMoney />,
     link:'/',
  },
  {
    title: "Profile",
    icon: <BiUser />,
     link: `/${user?.id}`,
  },
  {
    title: "More",
    icon: <SlOptions />,
     link:'/',
  },
]
    ,[user?.id])


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
      <div className="grid grid-cols-12 h-screen w-screen sm:px-56">

        {/* Sidebar — col-span goes 2 → 3 → 3 across sm/md/lg */}
        <div className="col-span-2 md:col-span-3 sm:col-span-3 pt-8 flex md:justify-end sm:justify-end pr-4 md:px-4 sm:px-4 relative">
          <div>
            <div className="text-2xl w-fit h-fit hover:bg-gray-800 rounded-full p-4 cursor-pointer transition-all">
              <BsTwitter />
            </div>

            <div className="mt-1 text-lg pr-4">
              <ul>
                {sidebarMenuItems.map((item) => (
                  <li
                    key={item.title}
                  >
                   <Link  className="flex justify-start items-center gap-4 hover:bg-gray-800 rounded-2xl px-3 py-2 w-fit cursor-pointer mt-2" href={item.link}>
                    <span className="text-3xl">{item.icon}</span>
                    {/* hidden on mobile, abbreviated on md, full on sm (desktop) */}
                    <span className="hidden md:inline sm:inline">{item.title}</span>
                   </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-5 px-3">
                {/* Text Tweet button: visible from md up */}
                <button className="hidden md:block sm:block bg-[#1d9bf0] rounded-full font-semibold text-lg w-full px-4 py-2">
                  Tweet
                </button>
                {/* Icon-only Tweet button: only on mobile (below md) */}
                <button className="block md:hidden bg-[#1d9bf0] rounded-full font-semibold text-lg w-full px-4 py-2">
                  <BsTwitter />
                </button>
              </div>
            </div>
          </div>

          {/* User profile chip */}
          {user && (
            <div className="absolute bottom-5 flex gap-2 items-center bg-slate-800 px-3 rounded-full">
              {user.profileImageURL && (
                <Image
                  className="rounded-full"
                  src={user.profileImageURL}
                  alt="user-image"
                  height={50}
                  width={50}
                />
              )}
              {/* Show name from md up */}
              <div className="hidden md:block sm:block">
                <h3 className="text-lg">{`${user.firstName} ${user.lastName}`}</h3>
              </div>
            </div>
          )}
        </div>

        {/* Feed — col-span goes 10 → 6 → 5 across sm/md/lg */}
        <div className="col-span-10 md:col-span-6 sm:col-span-5 border-r-[1px] border-l-[1px] border-gray-600 h-screen overflow-y-scroll">
          {props.children}
        </div>

        {/* Right panel — hidden on mobile, visible from md up */}
        <div className="hidden md:block md:col-span-2 sm:col-span-3 p-3">
  {!user && (
    <div className="p-3 bg-slate-700 rounded-lg">
      <h1 className="my-2 text-lg md:text-xl">New To Twitter?</h1>
      <GoogleLogin
        onSuccess={(credentialResponse) => handleLoginWithGoogle(credentialResponse)}
        onError={() => console.log("Login Failed")}
      />
    </div>
  )}
</div>


      </div>
    </div>
  );
}

export default TwitterLayout