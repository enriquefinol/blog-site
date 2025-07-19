import express from "express";
import bodyParser from "body-parser";
import fs from 'fs';
import { dirname } from "path";
import { fileURLToPath } from "url";

var postsData ;
var mainPost;

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

function editRecord(req,res,next){
    console.log(req.body)
    var postEdit = postsData.findIndex(post => post.id === req.body.id);

    //create a new record with new data
    const today = new Date();
    const date = today.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
    });
    var newRecord ={
        "id":String(req.body.id),
        "title" : req.body.title,
        "author" : req.body.fName,
        "date" : date,
        "description" : req.body.post,
    }
    postsData.splice(postEdit,1,newRecord);

    //edit the data
    var  jsonData = JSON.stringify(postsData, null, 2);
    fs.writeFile(__dirname + "/public/posts.json",jsonData, (err) => {
        if (err) throw err;
        console.log("The file has been uploaded");
   });
   next();

}

function fillForm(req,res,next){
    
    var selectId = req.params.id;
    var mainPost = postsData.find(post => post.id === selectId);

    const flagEdit = true;
    res.render("blogs.ejs",{postsData,mainPost,okToEdit:flagEdit});
}

function deleteRecord(req,res,next){
    var selectId = req.params.id;
    var postDelete = postsData.findIndex(post => post.id === selectId);
    postsData.splice(postDelete,1);
     //edit the data
    var  jsonData = JSON.stringify(postsData, null, 2);
    fs.writeFile(__dirname + "/public/posts.json",jsonData, (err) => {
         if (err) throw err;
         console.log("The file has been uploaded");
    });
    next();
}

function selectRecord(req,res,next){
    var selectId = req.params.id;
    mainPost = postsData.find(post => post.id === selectId);
    next();
}

function createRecord (req,res,next){
    var author = req.body["fName"];
    var title = req.body["title"];
    var description = req.body["post"];
    var id = postsData.length + 1;
    //get timestamp
    const today = new Date();
    const date = today.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
    });
    var newRecord ={
        "id":String(id),
        "title" : title,
        "author" : author,
        "date" : date,
        "description" : description
    }
    //Write to file
    //append to array
    postsData.push(newRecord);
    console.log(postsData);
    //edit the data
    var  jsonData = JSON.stringify(postsData, null, 2);
    fs.writeFile(__dirname + "/public/posts.json",jsonData, (err) => {
        if (err) throw err;
        console.log("The file has been uploaded");
    });
    next();
}

// Read the JSON file
fs.readFile(__dirname + "/public/posts.json", 'utf8', (err, jsonString) => {
    if (err) throw err; 
    console.log("The file has been processed");
    postsData = JSON.parse(jsonString);   
});


app.get("/", (req, res) => {
    res.render("index.ejs",{postsData});
    });

app.get("/blogs", (req, res) => {
    mainPost = postsData[postsData.length - 1]
    res.render("blogs.ejs",{postsData,mainPost});
    });

app.post("/submit",createRecord, (req, res) => {
    res.render("blogs.ejs",{postsData});
    });

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
    });

//navigate to writepost section
app.get("/post", (req, res) => {
    res.render("post.ejs");
    });


//Select Post
app.get("/selection/:id",selectRecord, (req, res) => {
    res.render("blogs.ejs",{postsData,mainPost});
    });

//delete Post
app.get("/delete/:id",deleteRecord, (req, res) => {
    res.render("blogs.ejs",{postsData});
    });

//fill Form
app.get("/fill/:id",fillForm,(req,res) => {
    
});

//edit record
app.post("/edit",editRecord, (req, res) => {
    res.render("blogs.ejs",{postsData,mainPost});
    });


//Navigate to about us page
app.get("/about", (req, res) => {
    res.render("about.ejs");
    });
app.use(express.static("public"));


