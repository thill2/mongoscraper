var request = require("request");
var express = require("express");
var handlebars = require("express-handlebars")
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var articleController = require("./controller/articleController")
var commentController = require("./controller/commentController")
var cheerio = require ("cheerio");

// Initialize Express
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

// Connect Handlebars
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Static public folder
app.use(express.static("public"));

// Configure app with article controller
articleController(app)
// Configure app with comment controller
commentController(app)

app.get("/", (req, res) => {
  res.render("index")
})

app.get("/saved", (req, res) => {
  res.render("saved")
});

// Connect Mongo DB
const url = process.env.MONGODB_URI || "mongodb://localhost/mongoosescraper";
mongoose.connect(url);
var db = mongoose.connection

// show db errors 
db.on("error", (err) => {
  console.log("DB Error: ", err);
});

db.on("open", () => {
  console.log("DB Connection successful");
});

var articleModel = require("./models/article");


// Routes
app.get("/scrape", (req, res) => {
  console.log("scrapping NYT");
  // Grab HTML from NYT's website
  request("http://www.nytimes.com", function(error, response, html) {

    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    var $ = cheerio.load(html);

    // An empty array to save the data that we'll scrape
    var results = [];
    
    // Selecting elements from html page
    $(".theme-summary").each(function(i, element) {
      var url = $(element).find(".story-heading").find("a").attr("href") || $(element).find(".story-link").find("a").attr("href");
      var summary = $(element).find(".summary").text().trim() || 'No summary available!';
      var title = $(element).find(".story-heading").text().trim();

      //filtering out articles that have their links displayed differntly, which also filters out most articles without summaries, due to NYT page layout
      if(url!=undefined){
        // Save these results in an object that we'll push into the results array we defined earlier
        results.push({
          title: title,
          summary: summary,
          url: url
        });
      }
    });
    // console.log(results);
    articleModel.find({}, (err, docs) => {
      if (err) {
        return res.status(200).json({ articles: docs })
      }
      var uniqueResults = []
      for (i = 0; i < results.length; i++) {
        var unique = true
        for(j = 0; j < docs.length; j++) {
          if (docs[j].url === results[i].url) {
            unique = false
            break
          }
        }
        if (unique) {
          uniqueResults.push(results[i])
        }
      }
      return res.status(200).json({ articles: uniqueResults })
    })
  });
});

var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
  console.log("App running on port " + PORT);
});