import { mongooseConnection } from "@/lib/mongoose";
import { Admin } from "@/models/Admin";

export default async function handle(req, res) {
    const {method} = req;
    await mongooseConnection();

    if (method === 'GET') {
        res.json(await Admin.find());
    }

    if (method === 'POST') {
        const {mail} = req.body;
        const adminDoc = await Admin.create({mail});
        res.json(adminDoc);
    }

    if (method === 'DELETE') {
        const {_id} = req.query;
        await Admin.deleteOne({_id});
        res.json('Ok');
    }
}