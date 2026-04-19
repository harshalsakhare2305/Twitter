import type { NextPage } from "next";
import TwitterLayout from "./components/layouts/TwitterLayout";
import { BsArrowLeftShort } from "react-icons/bs";
import Image from "next/image";
import { useCurrentUser } from "../../hooks/user";
const UserProfilePage:NextPage=()=>{
    const query = useCurrentUser();
    const user =query.data?.getCurrentUser;
    return (
        <div>
           

                <TwitterLayout>
                  <div>
                    <nav className="flex items-center gap-3 py-3 px-3 ">

                        <BsArrowLeftShort className="text-4xl"/>
                   <div>
                     <h1 className="text-2xl font-bold">{user? `${user.firstName} ${user.lastName?user.lastName:""}`:"Unknown User"}</h1>
                    <h1 className="text-md font-bold text-slate-500">100 Tweets</h1>
                   </div>
                    </nav>

                    <div className="p-4 border">
                     {
                        user && user?.profileImageURL && (
                             <Image  className="rounded-full" src={user?.profileImageURL} alt="user-image" width={100} height={100} />
                        )
                     }
                    </div>


                  </div>
                </TwitterLayout>

        </div>
    )
}

export default UserProfilePage