const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

let campgrounds = [
    { name: 'Salmon Creek', image: "https://pixabay.com/get/e136b80728f31c22d2524518b7444795ea76e5d004b0144495f5c47da6efb3_340.jpg" },
    { name: 'Granite Hill', image: "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg" },
    { name: 'Mountain Goat', image: "https://farm4.staticflickr.com/3751/9580653400_e1509d6696.jpg" }
]

mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs")

//SCHEMA SETUP

let campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

let Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//     {
//         name: 'Salmon Hill',
//         image: "https://farm4.staticflickr.com/3751/9580653400_e1509d6696.jpg"
//     }, function(error, campground){
//         if (error){
//             console.log(err);
//         } else{
//             console.log('new');
//             console.log(campground);
//         }
//     }
// )




app.get("/", function(req, res){
    res.render("landing");
})

app.get("/campgrounds", function(req, res){
    
    //get all campgrounds from DB
    Campground.find({}, function(error, allCampgrounds){
        if (error){
            console.log(error)
        } else {
            res.render("campgrounds", {campgrounds: allCampgrounds})
        }
    });
})

//get data form and add to campgrounds array
//redirect back to campgrounds page

app.post("/campgrounds", function(req, res){

    let name = req.body.name;
    let image = req.body.image;
    let newCampground = {name: name, image: image};
    //create new campground and save to database
    res.redirect("/campgrounds");

})

app.get("/campgrounds/new", function(req, res){
    res.render("new.ejs");
})

app.listen(3000, function(){
    console.log("server has started!")
});


