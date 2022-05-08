const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();

const items = ["장보기", "요리하기", "먹기"];
const workItems = [];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/", function(req, res) {

  // must put () after date to activate(use) the function
  const day = date.getDate();

  res.render("list", {
    listTitle: day,
    newListItems: items
  });

});

app.get("/work", function(req, res) {
  res.render("list", {
    listTitle: "Work List",
    newListItems: workItems
  });
});

app.get("/about", function(req, res) {
  res.render("about");
});

app.post("/", function(req, res) {

  const item = req.body.newItem;
  console.log(req.body);
  // the req.body.list is referring to the button name in the list.ejs form
  // this if statement checks to see if the list of the new item came from the work list or not
  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});


app.listen(3000, function(req, res) {
  console.log("Server started on port 3000");
});
