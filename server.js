var express = require("express");

var app = express();

var count = 0;

app.get("/", (req, res)=>{
    res.send("Hello, here is your Unity WebGl game");
});

app.get("/user/:id", (req, res)=>{
    var dummyData = {
        "userid": req.params["id"],
        "username": "quill18",
        "wins": 18,
        "losses": 1000,
        "someArray": [
            {name: "foo", value: 2.5},
            {name: "bar", value: 7.1},
            {name: "baz", value: 3.9}
        ]
    };
    res.json(dummyData);
});

app.listen( 8080, () => {
    console.log("Server has started!");
});