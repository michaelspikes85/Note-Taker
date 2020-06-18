// Dependencies
//=========================================
var express = require("express");
var path = require("path");
var fs = require("fs");

// Express
// ========================================
var app = express();
var PORT = process.env.port || 3000;


app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(path.join(__dirname, "Develop/public")));

let noteEntry = [];
let noteCounter = 0;

app.get("/api/notes", function(req, res)    {
    try{
        noteEntry = fs.readFileSync("./Develop/db/db.json", "utf8")

    }

    catch (err) {
        console.log(err);
    }

    res.json(noteEntry);

});

app.post("/api/notes", function(req, res)   {
    try{
        noteEntry = fs.readFileSync("./Develop/db/db.json", "utf8");
        noteEntry = JSON.parse(noteEntry);
        req.body.id = noteCounter;
        noteCounter++;

        noteEntry.push(req.body);
        noteEntry = JSON.stringify(noteEntry);

        fs.writeFileSync("./Develop/db/db.json", noteEntry, "utf8", function(err)   {
            if (err) throw err;
        });

        res.json(JSON.parse(noteEntry));
    }

    catch (err) {
        throw err;
        console.error(err);
    }
});

app.delete("/api/notes/:id", function(req, res) {
    try{
        noteEntry = fs.readFileSync("./Develop/db/db.json", "utf8");
        noteEntry = JSON.parse(noteEntry);
        noteEntry = noteEntry.filter(function(note) {
            return note.id != req.params.id;
        });

        noteEntry = JSON.stringify(noteEntry);
        fs.writeFileSync("./Develop/db/db.json", noteEntry, "utf8");
        res.send(JSON.parse(noteEntry));

    }

    catch (err) {
        throw err;
        console.log(err);
    }


});

app.get("/notes", function(req, res)    {
    res.sendFile(path.join(__dirname, "./Develop/public/notes.html"))

});

app.get("/*", function(req, res)    {
    res.sendFile(path.join(__dirname, "./Develop/public.index.html"));
});

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});