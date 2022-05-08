const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemsSchema = {
  name: String
};
// creating a Model for the documents
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to your todoList!"
});

const item2 = new Item({
  name: "Hit the + button to add a new item."
});

const item3 = new Item({
  name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

Item.insertMany(defaultItems, function(err){
  if (err){
    console.log(err);
  } else {
    console.log("Successfully saved default items to DB.");
  }
});

app.get("/", function(req, res) {

  res.render("list", {
    listTitle: "Today",
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
