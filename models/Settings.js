import mongoose, { Schema, model, models  } from "mongoose";

const SettingsSchema = new Schema({
    id: {type:String, required:true},
});

export const Settings = models.Settings || model('Settings', SettingsSchema);