const { Schema, models, model } = require("mongoose");

const OrderSchema = new Schema({
    line_item:Object,
    name:String,
    email:String,
    city:String,
    postalCode:String,
    streetAddress:String,
    country:String,
},{
    timestamps: true,
});

export const Order = models.Order || model('Order', OrderSchema);