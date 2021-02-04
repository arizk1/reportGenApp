import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function App() {
    const [csvFiles, setCsvFiles] = useState({});
    const [error, setError] = useState(false);
    const [message, setMessage] = useState();
    const [views, setViews] = useState(1);
    const [savedData, setSavedData] = useState({});

    const handleFileChange = (e) => {
        setCsvFiles({
            ...csvFiles,
            [e.target.name]: e.target.files[0],
        });
    };

    const handleUpload = () => {
        var formData = new FormData();
        formData.append("file", csvFiles.contacts || csvFiles.listings);
        // console.log(formData);

        axios
            .post("/upload-csvs", formData)
            .then(({ data }) => {
                if (!data.error) {
                    setSavedData({ ...savedData, ...data });

                    setViews(views + 1);
                } else {
                    setError(true);
                    setMessage(data.message);
                }
            })
            .catch((err) => {
                console.log("error on POST /upload-csvs", err);
            });
    };

    const next = () => {
        setViews(views + 1);
        console.log(savedData);
    };

    const back = () => {
        setViews(views - 1);
    };

    const backToFirst = () => {
        setViews(3);
    };
    const newReport = () => {
        location.replace("/");
    };

    return (
        <div>
            <h1>Report Generator App</h1>
            {error && <h3>{message} error</h3>}

            {views == 1 && (
                <>
                    <label>select the listings file </label>
                    <input
                        name="listings"
                        type="file"
                        accept=".csv"
                        onChange={(e) => handleFileChange(e)}
                        id="listings"
                        className="inputfile"
                    />
                    <button onClick={(e) => handleUpload(e)}>Upload</button>
                </>
            )}
            {views == 2 && (
                <>
                    <label>select the contacts file </label>
                    <input
                        name="contacts"
                        type="file"
                        accept=".csv"
                        onChange={(e) => handleFileChange(e)}
                        id="contacts"
                        className="inputfile"
                    />
                    <button onClick={(e) => handleUpload(e)}>Upload</button>
                </>
            )}

            {views == 3 && (
                <>
                    <h1>Average Listing Selling Price per Seller Type</h1>

                    <table className="avg-seller">
                        <tr>
                            <th>Seller Type</th>
                            <th>Average in Euro</th>
                        </tr>
                        {savedData.average.map((item, idx) => (
                            <tr key={idx}>
                                <td>{item.type}</td>
                                <td>€ {item.avg}</td>
                            </tr>
                        ))}
                    </table>
                    <button onClick={(e) => next(e)}>Next Report</button>
                </>
            )}

            {views == 4 && (
                <>
                    <h1>Percentual Distribution of available cars by Make</h1>

                    <table className="avg-seller">
                        <tr>
                            <th>Make</th>
                            <th>Distribution</th>
                        </tr>
                        {savedData.percentage.map((item, idx) => (
                            <tr key={idx}>
                                <td>{item.make}</td>
                                <td>{item.avg}%</td>
                            </tr>
                        ))}
                    </table>

                    <button onClick={(e) => next(e)}>Next Report</button>
                    <button onClick={(e) => back(e)}>Back</button>
                </>
            )}
            {views == 5 && (
                <>
                    <h1>Average price of the 30% most contacted listings</h1>

                    <table className="avg-seller">
                        <tr>
                            <th>Average price</th>
                        </tr>
                        <tr>
                            <td>€ {savedData.highTAverage}</td>
                        </tr>
                    </table>

                    <button onClick={(e) => next(e)}>Next Report</button>
                    <button onClick={(e) => back(e)}>Back</button>
                </>
            )}
            {views == 6 && (
                <>
                    <h1>Percentual Distribution of available cars by Make</h1>
                    <h3>Month 01/2020</h3>
                    <table className="avg-seller">
                        <tr>
                            <th>Ranking</th>
                            <th>Listing Id</th>
                            <th>Make</th>
                            <th>Selling Price</th>
                            <th>Mileage</th>
                            <th>Total Amount of contacts</th>
                        </tr>
                        {savedData.monthlyReports["01/2020"].map(
                            (item, idx) => (
                                <tr key={idx + 1}>
                                    <td>{idx}</td>
                                    <td>{item.id}</td>
                                    <td>{item.make}</td>
                                    <td>{item.price}</td>
                                    <td>{item.Mileage}</td>
                                    <td>{item.count}</td>
                                </tr>
                            )
                        )}
                    </table>
                    <h3>Month 02/2020</h3>
                    <table className="avg-seller">
                        <tr>
                            <th>Ranking</th>
                            <th>Listing Id</th>
                            <th>Make</th>
                            <th>Selling Price</th>
                            <th>Mileage</th>
                            <th>Total Amount of contacts</th>
                        </tr>
                        {savedData.monthlyReports["02/2020"].map(
                            (item, idx) => (
                                <tr key={idx + 1}>
                                    <td>{idx}</td>
                                    <td>{item.id}</td>
                                    <td>{item.make}</td>
                                    <td>{item.price}</td>
                                    <td>{item.Mileage}</td>
                                    <td>{item.count}</td>
                                </tr>
                            )
                        )}
                    </table>
                    <h3>Months 03/2020</h3>
                    <table className="avg-seller">
                        <tr>
                            <th>Ranking</th>
                            <th>Listing Id</th>
                            <th>Make</th>
                            <th>Selling Price</th>
                            <th>Mileage</th>
                            <th>Total Amount of contacts</th>
                        </tr>
                        {savedData.monthlyReports["03/2020"].map(
                            (item, idx) => (
                                <tr key={idx + 1}>
                                    <td>{idx}</td>
                                    <td>{item.id}</td>
                                    <td>{item.make}</td>
                                    <td>{item.price}</td>
                                    <td>{item.Mileage}</td>
                                    <td>{item.count}</td>
                                </tr>
                            )
                        )}
                    </table>
                    <h3>Month 04/2020</h3>
                    <table className="avg-seller">
                        <tr>
                            <th>Ranking</th>
                            <th>Listing Id</th>
                            <th>Make</th>
                            <th>Selling Price</th>
                            <th>Mileage</th>
                            <th>Total Amount of contacts</th>
                        </tr>
                        {savedData.monthlyReports["04/2020"].map(
                            (item, idx) => (
                                <tr key={idx + 1}>
                                    <td>{idx}</td>
                                    <td>{item.id}</td>
                                    <td>{item.make}</td>
                                    <td>{item.price}</td>
                                    <td>{item.Mileage}</td>
                                    <td>{item.count}</td>
                                </tr>
                            )
                        )}
                    </table>
                    <h3>Month 05/2020</h3>
                    <table className="avg-seller">
                        <tr>
                            <th>Ranking</th>
                            <th>Listing Id</th>
                            <th>Make</th>
                            <th>Selling Price</th>
                            <th>Mileage</th>
                            <th>Total Amount of contacts</th>
                        </tr>
                        {savedData.monthlyReports["05/2020"].map(
                            (item, idx) => (
                                <tr key={idx + 1}>
                                    <td>{idx}</td>
                                    <td>{item.id}</td>
                                    <td>{item.make}</td>
                                    <td>{item.price}</td>
                                    <td>{item.Mileage}</td>
                                    <td>{item.count}</td>
                                </tr>
                            )
                        )}
                    </table>
                    <h3>Month 06/2020</h3>
                    <table className="avg-seller">
                        <tr>
                            <th>Ranking</th>
                            <th>Listing Id</th>
                            <th>Make</th>
                            <th>Selling Price</th>
                            <th>Mileage</th>
                            <th>Total Amount of contacts</th>
                        </tr>
                        {savedData.monthlyReports["06/2020"].map(
                            (item, idx) => (
                                <tr key={idx + 1}>
                                    <td>{idx}</td>
                                    <td>{item.id}</td>
                                    <td>{item.make}</td>
                                    <td>{item.price}</td>
                                    <td>{item.Mileage}</td>
                                    <td>{item.count}</td>
                                </tr>
                            )
                        )}
                    </table>
                    <button onClick={(e) => newReport(e)}>New Report</button>
                    <button onClick={(e) => back(e)}>Back</button>
                    <button onClick={(e) => backToFirst(e)}>
                        Back to first report
                    </button>
                </>
            )}
        </div>
    );
}

//  <table className="avg-seller">
//      <tr>
//          <th>Seller Type</th>
//          <th>Average in Euro</th>
//      </tr>
//      {savedData.average.map((item, idx) => (
//          <div key={idx}>
//              <tr>
//                  <td>Private</td>
//                  <td>€ {item.private}</td>
//              </tr>
//          </div>
//      ))}
//  </table>;
