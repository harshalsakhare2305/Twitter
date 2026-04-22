import {useRouter} from 'next/router'
import type { GetServerSideProps, NextPage } from "next";
import TwitterLayout from "./components/layouts/TwitterLayout";
import { BsArrowLeftShort } from "react-icons/bs";
import Image from "next/image";
import { useCurrentUser } from "../../hooks/user";
import FeedCard from "./components/FeedCard";
import { Tweet, User } from "../../gql/graphql";
import { getServerSideClient, graphqlclient } from '../../graphql-clients/api';
import { getUserById } from '../../graphql/queries/user';
import { useMemo } from 'react';


interface ServerProps{
    user?:User;
}
const UserProfilePage:NextPage<ServerProps>=(props)=>{

    const router =useRouter();

    const query =useCurrentUser();
    const currentUser =query.data?.getCurrentUser;

    const user =props.user;

   const AmiFollowing = useMemo(() => {
  if (!user || !user.followers || !currentUser?.id) {
    return false;
  }

 

  return user.followers.some(el => el?.id === currentUser.id);
}, [currentUser?.id, user]);


    
  


    return (
        <div>
           

                <TwitterLayout>
                  <div>
                    <nav className="flex items-center gap-3 py-3 px-3 ">

                        <BsArrowLeftShort className="text-4xl"/>
                   <div>
                     <h1 className="text-xl font-bold">{user? `${user.firstName} ${user.lastName?user.lastName:""}`:"Unknown User"}</h1>
                    <h1 className="text-md font-bold text-slate-500">{user?.tweets?.length} Tweets</h1>
                   </div>
                    </nav>

                    <div className="p-4 border-b border-slate-800">
                     {
                        user && user.profileImageURL && (
                             <Image  className="rounded-full" src={user?.profileImageURL} alt="user-image" width={100} height={100} />
                        )
                     }
                     <h1 className="text-xl font-bold mt-3">{user? `${user.firstName} ${user.lastName?user.lastName:""}`:"Unknown User"}</h1>

                    <div className='flex justify-between items-center'>

                       <div className='flex gap-4 mt-2 text-sm text-gray-400   '>
                      <span>{
                         user?.followers?.length
                        } Followers</span>
                      <span>{user?.following?.length} Following</span>
                     </div>

                    {
                      <>
                      {
                        AmiFollowing ? ((user?.id !==currentUser?.id) && ( <button className='bg-white text-black px-3 py-1 rounded-full text-sm'>Unfollow</button>)):((user?.id !==currentUser?.id) && ( <button className='bg-white text-black px-3 py-1 rounded-full text-sm'>Follow</button>))
                      }
                      </>
                    }

                    </div>
                    </div>

                    <div>
                        {user && user?.tweets && (
                            user?.tweets.map((tweet)=> <FeedCard data={tweet as Tweet} key={tweet?.id} />)
                        ) }
                    </div>


                  </div>
                </TwitterLayout>

        </div>
    );
};

export const getServerSideProps: GetServerSideProps<ServerProps> = async (context) => {
  const id = context.query.id as string | undefined;
  if (!id) return { notFound: true, props: { user: undefined } };

  // Read token from cookies
  const token = context.req.cookies["Twitter_token"];

  const client = getServerSideClient(token);
  const userInfo = await client.request(getUserById, { id });

  if (!userInfo?.getUserById) return { notFound: true };

  return {
    props: {
      user: userInfo.getUserById as User,  // <-- also fix: was "userInfo" not "user"
    },
  };
};

export default UserProfilePage