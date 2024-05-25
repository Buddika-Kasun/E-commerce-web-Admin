import { mongooseConnection } from "@/lib/mongoose";
import { Settings } from "@/models/Settings";

export default async function handle(req, res) {
    const {method} = req;
    await mongooseConnection();   

    if (method === 'POST') {
        const {id} = req.body;

        await Settings.deleteMany();

        const setting = await Settings.create({id});
        res.json(setting);
    }

    if (method === 'GET') {
        const setting = await Settings.findOne();
        res.json(setting);
    }
}