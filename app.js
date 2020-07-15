const express = require("express");
const app = express();
const mongoose = require("mongoose");
const _ = require("lodash");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));


app.set('view engine', 'ejs'); //this should be used while using EJS templates

app.use(express.static("public")); //to render static files from the public folder ,like CSS stylesheet and images

mongoose.connect("mongodb+srv://Admin-Manaswini:Manu7706@cluster0-oeggl.mongodb.net/todolistDB",  { useNewUrlParser: true , useUnifiedTopology: true});

const itemsSchema = new mongoose.Schema({
  name: String
});


const listSchema = new mongoose.Schema({
  name:String,
  items:[itemsSchema]
});

const List = mongoose.model("List", listSchema);

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name:'Welcome to your to do list '
});

const item2 = new Item({
  name:"Hit the + button to add an item"
});

const item3 = new Item({
  name:"<-- Hit this to delete an item"
})

const defaultItems = [item1, item2, item3];

app.get("/", function(req, res){
  Item.find({}, function(err, foundItems){
    if(foundItems.length === 0 ){

      Item.insertMany(defaultItems, function(err){

          console.log("Successfully added new items");
        }
      );
            res.redirect("/");
    }

    else{
        res.render("list", {listTitle: "Today", nextListItems: foundItems});
    }


  });
})

app.post("/", function(req, res){
  const itemName = req.body.enteredItem;
  const listName = req.body.list

  const item = new Item({
    name:itemName
  });

  if(listName==="Today"){
    item.save();
    res.redirect("/");
  }
  else{
    List.findOne({name: listName}, function(err, foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    })
  }


})

app.post("/delete", function(req, res){
const checkedItemId = req.body.checkbox;
const listName =  req.body.listName;

if(listName==="Today"){
  Item.findByIdAndRemove(checkedItemId, function(err){
    if(err){console.log(err);}
    else{
      console.log("Successfully deleted checked item");
    }
    res.redirect("/");
  })
}

else{
  List.findOneAndUpdate(
    {name:listName},
    {$pull : {items  :{_id : checkedItemId}}},
    function(err, foundList ){
      if(!err){
        res.redirect("/" + listName);
      }
    }
  )
}


})

app.get("/:customListName", function(req, res){
  const customListName = _.capitalize(req.params.customListName);
  List.findOne({name:customListName}, function(err, foundList){
    if(!err){
      if(!foundList){
        //create a new list
        const list = new List({
          name:customListName,
          items:defaultItems
        });
        list.save();
        res.redirect("/" + customListName);
      }else{
        //Show the existing list
        res.render("list", {listTitle:foundList.name, nextListItems:foundList.items});
      }
    }
  })

});


app.get("/about", function(req, res){
  res.render("about");
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function(){
  console.log("Server has started successfully");
})
