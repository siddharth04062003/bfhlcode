import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
    const [jsonData, setJsonData] = useState("");
    const [response, setResponse] = useState(null);
    const [error, setError] = useState("");
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [rollNumber] = useState("22bcs16300");

    const backendEndpoint = import.meta.env.VITE_BACKEND_URL || "https://bfhlcode.vercel.app/bfhl";

    useEffect(() => {
        document.title = rollNumber;
    }, [rollNumber]);

    const options = [
        { value: "alphabets", label: "Alphabets" },
        { value: "numbers", label: "Numbers" },
        { value: "highest_alphabet", label: "Highest Alphabet" },
    ];

    const handleInputChange = (e) => {
        setJsonData(e.target.value);
    };

    const handleSelectChange = (newValue) => {
        setSelectedOptions(newValue);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            JSON.parse(jsonData);
            const parsedJson = JSON.parse(jsonData);
            const res = await axios.post(backendEndpoint, { data: parsedJson.data });

            // Ensure required fields are always included
            setResponse({
                is_success: true,
                user_id: "Siddharth Gautam",
                email: "22bcs16300@cuchd.in",
                roll_number: "22bcs16300",
                ...res.data
            });

            setError("");
        } catch (err) {
            setError("Invalid JSON: " + err.message);
            setResponse(null);
        }
    };

    const filteredResponse = () => {
        if (!response) return null;
        const selectedValues = selectedOptions.map((option) => option.value);
        const filteredData = {
            is_success: true,
            user_id: "Siddharth Gautam",
            email: "22bcs16300@cuchd.in",
            roll_number: "22bcs16300",
        };

        selectedValues.forEach((key) => {
            if (response.hasOwnProperty(key)) {
                filteredData[key] = response[key];
            }
        });

        return filteredData;
    };

    return (
        <div className="container min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="card shadow-lg p-4 w-50">
                <h2 className="text-center text-primary">{rollNumber}</h2>
                <div className="mb-3">
                    <h5><strong>User ID:</strong> Siddharth Gautam</h5>
                    <h5><strong>Email:</strong> 22bcs16300@cuchd.in</h5>
                </div>
                <form onSubmit={handleSubmit} className="mt-3">
                    <div className="mb-3">
                        <label className="form-label">JSON Input:</label>
                        <textarea
                            value={jsonData}
                            onChange={handleInputChange}
                            className="form-control"
                            rows={3}
                            placeholder='{"data": ["A", "B", "1", "2"]}'
                        ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Submit</button>
                </form>
                {error && <div className="alert alert-danger mt-3">{error}</div>}
                {response && (
                    <div className="mt-3">
                        <Select isMulti options={options} onChange={handleSelectChange} className="mb-3" />
                        <h4 className="text-dark">Filtered Response:</h4>
                        <pre className="bg-dark text-white p-3 rounded">{JSON.stringify(filteredResponse(), null, 2)}</pre>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
