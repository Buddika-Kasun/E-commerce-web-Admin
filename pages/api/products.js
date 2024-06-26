import { mongooseConnection } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
    const {method} = req;
    await mongooseConnection();
    //isAdminRequest(req,res);

    if (method === 'GET'){
        if (req.query?.id) {
            res.json(await Product.findOne({_id:req.query.id}));
        }
        else{
           res.json(await Product.find()); 
        }
        
    }

    if (method === 'POST'){
        const {title,description,price,images,category} = req.body;
        const productDoc = Product.create({
            title,description,price,images,category,
        })
        res.json(productDoc);
    }

    if (method === 'PUT') {
        const {title,description,price,images,category,_id} = req.body;
        await Product.updateOne({_id}, {title,description,price,images,category});
        res.json(true);
    }

    if (method === 'DELETE') {
        if (req.query?.id) {
            await Product.deleteOne({_id:req.query?.id});
            res.json(true);
        }
    }
}