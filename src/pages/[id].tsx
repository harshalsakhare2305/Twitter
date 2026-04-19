import {useRouter} from 'next/router'
import type { NextPage } from "next";
import TwitterLayout from "./components/layouts/TwitterLayout";
import { BsArrowLeftShort } from "react-icons/bs";
import Image from "next/image";
import { useCurrentUser } from "../../hooks/user";
import FeedCard from "./components/FeedCard";
import { Tweet } from "../../gql/graphql";
const UserProfilePage:NextPage=()=>{
    const query = useCurrentUser();
    const user =query.data?.getCurrentUser;
    const router =useRouter();


    console.log("Router Query",router.query);
    return (
        <div>
           

                <TwitterLayout>
                  <div>
                    <nav className="flex items-center gap-3 py-3 px-3 ">

                        <BsArrowLeftShort className="text-4xl"/>
                   <div>
                     <h1 className="text-xl font-bold">{user? `${user.firstName} ${user.lastName?user.lastName:""}`:"Unknown User"}</h1>
                    <h1 className="text-md font-bold text-slate-500">100 Tweets</h1>
                   </div>
                    </nav>

                    <div className="p-4 border-b border-slate-800">
                     {
                        user && user?.profileImageURL && (
                             <Image  className="rounded-full" src={user?.profileImageURL} alt="user-image" width={100} height={100} />
                        )
                     }
                     <h1 className="text-xl font-bold mt-3">{user? `${user.firstName} ${user.lastName?user.lastName:""}`:"Unknown User"}</h1>
                    </div>

                    <div>
                        {user && user?.tweets && (
                            user?.tweets.map((tweet)=> <FeedCard data={tweet as Tweet} key={tweet?.id} />)
                        ) }
                    </div>


                  </div>
                </TwitterLayout>

        </div>
    )
}

export default UserProfilePage