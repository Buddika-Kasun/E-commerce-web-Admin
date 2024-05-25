import mongoose, { Schema, model, models  } from "mongoose";
//const { Schema, model, models } = require("mongoose");

const ProductSchema = new Schema({
    title: String,
    description: String,
    price: {type: Number, required: true},
    images: [{type: String}],
    category: {type:mongoose.Types.ObjectId, ref:'Category'},
});

export const Product = models.Product || model('Product', ProductSchema);