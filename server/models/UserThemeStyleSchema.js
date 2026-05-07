import mongoose from "mongoose";

import { Schema } from "mongoose";

const ThemeStyleSchema = new Schema({
      userId: {
    required: true,
    type:String
  },
  projectId:{
  required: true,
    type:String
  },
  weddingTheme: { type: String, required: true },
  culturalRequirements: { type: String },
  specialRituals: { type: String },
});

export default mongoose.model("UserThemeStyle", ThemeStyleSchema);

