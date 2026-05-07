import mongoose from 'mongoose';

const {Schema} = mongoose;

const resultSchema = new Schema({
    userId: {
        required: true,
        type:String
    },
    projectId:{
        required: true,
        type:String
    },
    result: { type: String, required: true },
   })


export default mongoose.model("WeddingResult", resultSchema)