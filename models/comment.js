var mongoose = require("mongoose");

// Create a schema class using mongoose's schema method
var Schema = mongoose.Schema;

// Create the CommentSchema with our schema class
var CommentSchema = new Schema({
  articleId: {
    type: Schema.Types.ObjectId, ref: 'Article'
  },
  body: {
    type: String,
    required: true,
  },
});

// Create the Comment model using the CommentSchema
var Comment = mongoose.model("Comment", CommentSchema);

// Export the Comment model
module.exports = Comment;