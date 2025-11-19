import mongoose from "mongoose";

const donorSchema = mongoose.Schema(
    {
        fName :  {type: String, required: true },
        password : {type: String, required: true },
        phoneNum : {type: Number, required: true },
        //dob : {type: Date, required: true },
        age: { type: Number, required: true },
        gender : {type: String, required: true },
        bloodType : {type: String, required: true },
        role : {type: String, required: true },
        email : {type: String, required: true },
        address : {type: String, required: true },

        //lat: { type: Number },
        //lng: { type: Number }  // lat and lng for address using real time location
    },

    //maybe time stamp here later Check POSTITAPP
      { timestamps: true }

)
const donorModel = mongoose.model("donor",donorSchema,"donorCol");
                                //modelname    schema    collection
export default donorSchema
