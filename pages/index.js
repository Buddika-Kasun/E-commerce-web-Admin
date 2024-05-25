import Layout from "@/components/Layout";
import { useSession, signIn, signOut } from "next-auth/react";
import axios from "axios";
import { useState } from "react";

//
const checkAdminStatus = (session) => {

  const [isAdmin, setIsAdmin] = useState();

  axios.get('/api/admin')
    .then(result => {
      const adminEmails = ['cybershock644@gmail.com', ...result.data.map(admin => admin.mail)];
      setIsAdmin(adminEmails.includes(session?.user?.email));
    })
    .catch(error => {
      console.error('Error fetching admin emails', error);
      setIsAdmin(false);
    });

  return isAdmin;

};
//

export default function Home() {
  const {data: session} = useSession();
  //console.log(session);

  //
  //if(!session){
    if(!checkAdminStatus(session)){
      return(
        <div className="bg-blue-950 w-screen h-screen flex flex-col items-center justify-between">
          <div className="text-white pt-20 dis">Welcome to Suppliment Store<br/>Admin</div>
          <div>pakaya</div>
          <div>
            <button onClick={() => {signIn('google')}} className="bg-white p-2 px-4 rounded-lg">Sign in</button>
          </div>
          <div className="text-white pb-5">Developed By Cyber Shock.</div>
          <div>pakaya</div>
        </div>
      );
    }
  //
  return(
    <Layout>
      <div className="flex justify-between text-blue-800">
        <h1>
          Hello, &nbsp; 
          <span className="font-bold">{session?.user?.name}</span>
        </h1>
        <div className="">
          <img src={session?.user?.image} alt="DP" className="rounded-full w-9 h-9"/>
          {/* <button onClick={() => signOut()}>Sign Out</button> */}
        </div>
      </div>
    </Layout>
  );
}
