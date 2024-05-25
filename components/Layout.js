import { useSession, signIn, signOut } from "next-auth/react"
import Nav from "../components/Nav";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import axios from "axios";
import Spinner from "./Spinner";

/* async function check(session){

  const [adminEmails, setAdminEmails] = useState(['cybershock644@gmail.com']);

  await useEffect(()=>{
    axios.get('/api/admin').then(result => {
      const data = result.data;
      data.map(admin => {
        setAdminEmails([...adminEmails, admin.mail]);
      });
    }) 
  },[]);

  if(adminEmails.includes(session?.user?.email)){
    return true;
  }
  else{
    return false;
  }
} */

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

export default function Layout({children}) {

  const [showNav, setShowNav] = useState(false);
  const { data: session } = useSession();

  
  //if(!session){
  if(!checkAdminStatus(session)){
    /* return(
      <div className="bg-blue-950 w-screen h-screen flex flex-col items-center justify-between">
        <div className="text-white pt-20 dis">Welcome to Suppliment Store<br/>Admin</div>
        <div>
          <button onClick={() => {signIn('google')}} className="bg-white p-2 px-4 rounded-lg">Sign in</button>
        </div>
        <div className="text-white pb-5">Developed By Cyber Shock.</div>
      </div>
    ); */

    return(
      <div className="min-h-screen flex items-center justify-center">
        <Spinner type='hash' color='#6B7280' size='80px' />
      </div>
    );
    
  }
  
  
  return(
    <div className="bg-bgGray min-h-screen">
      <div className="p-3 md:hidden flex">
        <button onClick={() => showNav? setShowNav(false): setShowNav(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={(showNav? 'hidden ':' ')+"w-7 h-8 text-indigo-800"}>
            <path fill-rule="evenodd" d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className={(showNav? ' ':'hidden ')+"w-7 h-8 text-indigo-800"}>
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="flex grow items-center justify-center">
          <Logo />
        </div>
      </div>
      <div className= "flex">
        <Nav show={showNav} />
        <div className="flex-grow p-4 pt-0 md:pt-4">
            {children}
        </div>
      </div>
    </div>
  ); 

}
