const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    _author: { type: Schema.Types.ObjectId, ref: "User" },
    comment: String,
     date: {
       type: Date,
       default: Date.now
     },
     copy: { type: String, max: 300}
  },
  {
    timestamps: true
  }
);

//nota como commen requiere el id del user, entonces jalas con ref el user.

const Post = model("Post", postSchema);

module.exports = Post;