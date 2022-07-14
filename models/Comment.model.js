const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const commentSchema = new Schema(
  {
  author_name: {
    type: String,
    required: true
  },
    title: String,
    content:String,    
    _organization_name: String,
    _country_of_origin: String,
// { timestamps: true }
    }
);

const Comment = model("Comment", commentSchema);

module.exports = Comment;