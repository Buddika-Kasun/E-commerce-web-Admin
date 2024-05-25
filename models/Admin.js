const { Schema, models, model } = require("mongoose");

const AdminSchema = new Schema({
    mail: {type:String, required:true},
});

export const Admin = models.Admin || model('Admin', AdminSchema);