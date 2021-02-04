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
let listingData = {};
let contactsData = {};
app.post("/upload-csvs", uploader.single("file"), (req, res) => {
    const { filename } = req.file;
    const filebath = `${__dirname}/uploads/${filename}`;
    if (req.file) {
        if (req.file.mimetype !== "text/csv") {
            res.json({ message: "Only .csv files accepted!", error: true });
        }

        fs.readFile(filebath, "utf8", function (error, data) {
            data = d3.csvParse(data);

            if (data.columns.includes("seller_type")) {
                listingData.listings = data;

                // Get the AVG of the seller types!
                function avg(type) {
                    const typeData = data.filter((d) => {
                        return d.seller_type == type;
                    });
                    const avg = d3.mean(typeData, (d) => {
                        return d.price;
                    });
                    return avg;
                }
                // Get the AVG of the distribution of the makes
                function distribution() {
                    let counts = {};
                    for (let i = 0; i < data.length; i++) {
                        counts[data[i].make] = 1 + (counts[data[i].make] || 0);
                    }
                    for (let key in counts) {
                        counts[key] = counts[key] * (100 / data.length);
                    }
                    return counts;
                }
                res.json({
                    average: [
                        {
                            private: avg("private"),
                            dealer: avg("dealer"),
                            other: avg("other"),
                        },
                    ],
                    percentage: distribution(),
                });
            } else if (data.columns.includes("listing_id")) {
                contactsData.contacts = data;

                let numberOfcontacts = {};
                for (let i = 0; i < data.length; i++) {
                    numberOfcontacts[data[i].listing_id] =
                        1 + (numberOfcontacts[data[i].listing_id] || 0);
                }
                const sortable = [];
                for (let key in numberOfcontacts) {
                    sortable.push([key, numberOfcontacts[key]]);
                }
                const mostContactedObj = sortable
                    .sort((a, b) => b[1] - a[1])
                    .slice(1, (30 * sortable.length) / 100)
                    .map((i) => {
                        return {
                            id: i[0],
                        };
                    });

                mostContactedObj.forEach((contact) => {
                    let result = listingData.listings.filter((listing) => {
                        return listing.id === contact.id;
                    });
                    contact.price = result[0].price;
                });

                const avg = d3.mean(mostContactedObj, (d) => {
                    return d.price;
                });

                // res.json({ avg: avg });
                //######################

                // change time format
                // 4- REPORTS PER MONTH!
                // change time format
                const formatMonth = d3.timeFormat("%m/%Y");
                const contacts = data.map((d) => {
                    return {
                        id: d.listing_id,
                        contact_date: formatMonth(d.contact_date),
                    };
                });
                //sort dates per month
                const sortedContacts = contacts.sort((a, b) => {
                    return (
                        a.contact_date.substring(0, 2) -
                        b.contact_date.substring(0, 2)
                    );
                });
                //group listing Ids per month suing loadash
                var contactsByDate = _.groupBy(sortedContacts, "contact_date");

                const dates = [
                    "01/2020",
                    "02/2020",
                    "03/2020",
                    "04/2020",
                    "05/2020",
                    "06/2020",
                ];
                const reports = {};
                function getReportFor(month) {
                    const singelreport = contactsByDate[month];
                    let counts = {};
                    for (let i = 0; i < singelreport.length; i++) {
                        counts[singelreport[i].id] =
                            1 + (counts[singelreport[i].id] || 0);
                    }

                    const sortable = [];
                    for (let key in counts) {
                        sortable.push([key, counts[key]]);
                    }
                    const mostContactedObj = sortable
                        .sort((a, b) => b[1] - a[1])
                        .slice(1, 6)
                        .map((i) => {
                            return {
                                id: i[0],
                                count: i[1],
                            };
                        });
                    mostContactedObj.forEach((contact) => {
                        let result = listingData.listings.filter((listing) => {
                            return listing.id === contact.id;
                        });
                        contact.price = result[0].price;
                        contact.make = result[0].make;
                        contact.mileage = result[0].mileage;
                        contact.price = result[0].seller_type;
                    });

                    reports[month] = mostContactedObj;
                }
                for (let i = 0; i < dates.length; i++) {
                    getReportFor(dates[i]);
                }
                console.log(reports);
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

// data.forEach( function (row) {
//     const { listing_id, contact_date } = row;
//      db
//         .insertContacts(listing_id, contact_date)
//         .then(() => {
//             res.json({ success: true });
//         })
//         .catch((err) => {
//             console.log(
//                 "error in inserting data to contacts",
//                 err
//             );
//             res.json({
//                 error: true,
//                 message:
//                     "Unexpected problem! Please upload the listing file first",
//             });
//         });
// })

// data.forEach(function (row) {
//     const { id, make, price, mileage, seller_type } = row;
//     db.insertListing(id, make, price, mileage, seller_type)
//         .then(() => {
//             res.json({ success: true });
//         })
//         .catch((err) => {
//             console.log("error in inserting data to contacts", err);
//             res.json({
//                 error: true,
//                 message: "Unexpected problem!",
//             });
//         });
// });
