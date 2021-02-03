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
var cors = require("cors");

//*##################################
//*######    MIDDLEWARES     #######
//*#################################

app.use(compression());
app.use(cors());
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
        callback(null, Date.now() + "-" + file.originalname);
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

app.use(express.static("public"));

//##################################
//########### ROUTES ##############
//#################################

app.post("/upload-csvs", uploader.single("file"), (req, res) => {
    const { filename } = req.file;
    const filebath = `${__dirname}/uploads/${filename}`;
    if (req.file) {
        if (req.file.mimetype !== "text/csv") {
            res.json({ message: "Only .csv files accepted!", error: true });
        }
        res.json({ success: true });
        fs.readFile(filebath, "utf8", function (error, data) {
            data = d3.csvParse(data);
            if (data.columns.includes("listing_id")) {
                console.log("contacts table");
            } else if (data.columns.includes("seller_type")) {
                console.log("listings table");
            } else {
                res.json({
                    message: "This is not the correct file",
                    error: true,
                });
            }
        });
    } else {
        res.json({ error: true });
    }
});

//##################################
//####           /*           ######
//#################################

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
