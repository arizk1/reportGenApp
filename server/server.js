//*##################################
//*###### SETTINGS & MODULES #######
//*#################################
const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const d3 = require("d3");
const _ = require("lodash");


const compression = require("compression");
const db = require("./db");

const multer = require("multer");


//*##################################
//*######    MIDDLEWARES     #######
//*#################################

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));
app.use(
    express.json({
        extended: false,
    })
);
app.use(express.urlencoded({ extended: false }));

const diskStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.resolve(__dirname + "/uploads"));
    },
    filename: function (req, file, callback) {
    callback(null, path.extname(file.originalname));
            // .catch((err) => callback(err));
    },
});

const uploader = multer({
    storage: diskStorage,
});

app.use(express.static("public"));

//##################################
//########### ROUTES ##############
//#################################



//##################################
//####           /*           ######
//#################################

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});

