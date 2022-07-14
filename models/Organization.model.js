const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const organizationSchema = new Schema(
  {
    org_name: {
      type: String,
      unique: true,
      required: [true, 'Organization name is required'],
      max: 50
  },
    org_logo: {
      type: String,
      default:"/images/we_logo_round_mxkchc.png"
    },
    _org_country:  {
      type: Schema.Types.ObjectId,
        ref: "Country"},
    slogan: {
      type: String,
      max: 60,
    },
    description: {
      type: String,
      max: 300
    },
    websiteURL: {
      type: String,
    },
    _org_owner: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    _students: [{
      type: Schema.Types.ObjectId,
      ref: "User"
    }]
  },
    { timestamps: true }
  );

// organizationSchema.path('websiteURL').validate((val) => {
//   urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
//   return urlRegex.test(val);
// }, 'Invalid URL.');

const   Organization = model("Organization", organizationSchema);

module.exports = Organization;