const express = require("express");

const app = express();



app.set("view engine", "ejs")

app.get("/", function(req, res){
    res.render("landing");
})

app.get("/campgrounds", function(req, res){
    let campgrounds = [
        { name: 'Salmon Creek', image: "https://pixabay.com/get/e136b80728f31c22d2524518b7444795ea76e5d004b0144495f5c47da6efb3_340.jpg"},
        { name: 'Granite Hill', image: "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg"},
        { name: 'Mountain Goat', image: "https://farm4.staticflickr.com/3751/9580653400_e1509d6696.jpg"}
    ]
    res.render("campgrounds", {campgrounds: campgrounds});
})

app.listen(3000, function(){
    console.log("server has started!")
});


