var mongoose = require("mongoose");

// Create a schema class using mongoose's schema method
var Schema = mongoose.Schema;

// Create the ArticleSchema with our schema class
var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true,
    unique: true
  }
});

// Create the Article model using the headlineSchema
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;