import { mongooseConnection } from "@/lib/mongoose";
import { Admin } from "@/models/Admin";

export default async function handle(req, res) {
    const {method} = req;
    await mongooseConnection();

    if (method === 'GET') {
        res.json(await Admin.find());
    }
}