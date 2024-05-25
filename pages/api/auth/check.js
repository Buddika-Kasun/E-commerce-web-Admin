import { getServerSession } from 'next-auth'
import { authOption } from "./[...nextauth]";
import { SetAdmins } from '@/pages/SetAdmins';

function check(session,adminEmails){

    if(adminEmails.includes(session?.user?.email)){
      return true;
    }
    else{
      return false;
    } 

}

export async function isAdminRequest(req,res) {
    const session = await getServerSession(req,res,authOption);

    const datas = await axios.get('/api/admin').then(result => {
        const data = result.data;
        return data;
    });
    
    const adminEmails = await SetAdmins(datas);

    //res.json(session);
    res.json(check(session,adminEmails));

    /* if (!check(session)) {
      res.status(401);
      res.end();
      throw 'Not an admin';
    } */
}