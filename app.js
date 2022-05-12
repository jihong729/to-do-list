const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

// Will change the connection url so that it will connect to MongoDB Atlas
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

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);


const defaultItems = [item1, item2, item3];


app.get("/", function(req, res) {

  Item.find({}, function(err, foundItems){

    // If there are no items in the items collection, add three default items
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err){
        if (err){
          console.log(err);
        } else {
          console.log("Successfully saved default items to DB.");
        }
        res.redirect("/");
      });
    } else {
      res.render("list", {  listTitle: "Today",  newListItems: foundItems
      });
    }
  });
});

// Creating Dynamic Custom List Pages using Express Route Parameters
app.get("/:customListName", function(req, res){
  // Capitalize the Custom List's First Letter
  const customListName = _.capitalize(req.params.customListName);

// check if there already is a list created
  List.findOne({name: customListName}, function(err, foundList){
    if (!err){
      if(!foundList){
        //Create a new list
          const list = new List({
          name: customListName,
          items: defaultItems
          });

          list.save();
          res.redirect("/" + customListName);
      } else {
      //Show an existing list
      res.render("list", {  listTitle: customListName,  newListItems: foundList.items
    });
    }
  }
  });

});

app.get("/about", function(req, res) {
  res.render("about");
});

app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId, function(err){
      if (err) {
        console.log(err);
      } else {
        console.log("Successfully removed checked item.");
        res.redirect("/");
      }
    });
  } else {
    // Delete Items from the Custom ToDo Lists
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
      if (!err) {
        res.redirect("/" + listName);
      }
    });
  }

});

app.post("/", function(req, res) {

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

// Adding New Items to the Custom ToDoLists
  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({name: listName}, function(err, foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }

});


app.listen(3000, function(req, res) {
  console.log("Server started on port 3000");
});
