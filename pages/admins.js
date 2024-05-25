import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from 'react-sweetalert2';

function Admins({swal}) {

    const [mail, setMail] = useState('');
    const [admins, setAdmins] = useState([]);

    function fetchAdmins() {
        axios.get('/api/admins').then(result => {
            setAdmins(result.data);
        }) 
    }
    
    useEffect(() => {
        fetchAdmins();
    },[]);

    async function saveAdmin(ev) {
        ev.preventDefault();

        await axios.post('/api/admins', {mail});
        
        fetchAdmins();
        setMail('');
    }

    function deleteAdmin(admin) {
        swal.fire({
            title: 'Are you sure ?',
            text: `Do you want to remove ${admin.mail}?`,
            showCancelButton: true,
            cancleButtonText: 'Cancel',
            confirmButtonText: 'Yes, Remove!', 
            confirmButtonColor: '#d55',
            reverseButtons: true,
        }).then(async result => {
            if (result.isConfirmed){
                const {_id} = admin;
                await axios.delete('/api/admins?_id='+_id);
                fetchAdmins();
            }
        });
    }

    return (
        <Layout>
            <h1>Admins</h1>
            <label>Add new admin</label>
            <form onSubmit={saveAdmin} className="flex gap-1">
                <input type="text" placeholder="Google mail" value={mail} onChange={ev => setMail(ev.target.value)} className="h-8 "></input>
                <button type="submit" className="bg-primary text-white px-4 ml-4 h-8 rounded-md">Add</button>
            </form>
            <table className="basic mt-4">
                <thead>
                    <tr>
                        <td>Admin google mail</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>cybershock644@gmail.com</td>
                        <td className="text-sm text-red-400">( Permanent )</td>
                    </tr>
                    {admins.length > 0 && admins.map(admin => (
                        <tr key={admin._id}>
                            <td>{admin.mail}</td>
                            <td>
                                <button onClick={() => deleteAdmin(admin)} className="btn-red">Remove</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    )
}

export default withSwal(({swal, ref}) => (
    <Admins swal={swal} />
));