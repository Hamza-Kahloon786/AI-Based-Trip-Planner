import mongoose from "mongoose";

import { Schema } from "mongoose";

const UserBasicInformation = new Schema({
  userId: {
    required: true,
    type:String
  },
  projectId:{
  required: true,
    type:String
  },
  weddingDate: { type: Date, required: true },
  events: [{ type: String, required: true }], 
});

export default mongoose.model('userInfo',UserBasicInformation)