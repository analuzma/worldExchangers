const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
  first_name: {
    type: String,
    max: 30
  },
    username: {
      type: String,
      unique: true,
      trim: true,
      required: true,
      lowercase: true
    },
    email: {
      type: String,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
      unique: true,
      trim: true,
      required: [true, 'Email is required']
    },
    password: {
      type: String,
      required: true
    },
    profile_pic: {
      type: String,
      default:"/images/profile_pic_ipfh2f.png"
    },
    _home_country:  {type: Schema.Types.ObjectId,
      ref: "Country"},
    _host_country: {type: Schema.Types.ObjectId,
      ref: "Country"},
    role: {
      type: String,
      enum: ["ADMIN", "ORG", "USER"],
      default: "USER"
    },
    followers: [{type: Schema.Types.ObjectId,
      ref: "User"}]
    ,
    following: [{type: Schema.Types.ObjectId,
      ref: "User"}],
    _organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      default: null
    },
    step2: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const User = model("User", userSchema);

module.exports = User;
