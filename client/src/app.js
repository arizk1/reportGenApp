import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function App() {
    const [csvFiles, setCsvFiles] = useState({});
    const [error, setError] = useState(false);
    const [message, setMessage] = useState();
    const [views, setViews] = useState(1);

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
                console.log("response", data);
                setViews(views + 1);

                if (data.error) {
                    setError(true);
                    setMessage(data.message);
                }
            })
            .catch((err) => {
                console.log("error on POST /upload-csvs", err);
            });
    };

    return (
        <div>
            <h1>Report Generator App</h1>
            {error && <h3>{message}</h3>}

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
                    <Link to="/report1">Report 1</Link>
                    <Link to="/report2">Report 2</Link>
                    <Link to="/report3">Report 3</Link>
                </>
            )}
        </div>
    );
}
