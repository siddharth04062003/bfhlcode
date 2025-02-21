import React, { useState, useEffect } from "react";
import axios from "axios";
import Select, { MultiValue } from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";

interface ResponseData {
    is_success: boolean;
    user_id: string;
    email: string;
    roll_number: string;
    numbers?: string[];
    alphabets?: string[];
    highest_alphabet?: string[];
}

interface SelectOption {
    value: string;
    label: string;
}

const App: React.FC = () => {
    const [jsonData, setJsonData] = useState<string>("");
    const [response, setResponse] = useState<ResponseData | null>(null);
    const [error, setError] = useState<string>("");
    const [selectedOptions, setSelectedOptions] = useState<SelectOption[]>([]);
    const [rollNumber] = useState<string>("22bcs16300");

    const backendEndpoint: string = import.meta.env.VITE_BACKEND_URL || "https://bfhlcode.vercel.app/bfhl";

    useEffect(() => {
        document.title = rollNumber;
    }, [rollNumber]);

    const options: SelectOption[] = [
        { value: "alphabets", label: "Alphabets" },
        { value: "numbers", label: "Numbers" },
        { value: "highest_alphabet", label: "Highest Alphabet" },
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setJsonData(e.target.value);
    };

    const handleSelectChange = (newValue: MultiValue<SelectOption>) => {
        setSelectedOptions(newValue as SelectOption[]);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const parsedJson = JSON.parse(jsonData);
            if (!parsedJson.data || !Array.isArray(parsedJson.data)) {
                throw new Error("Invalid JSON format. Expected { data: [...] }");
            }

            const res = await axios.post<ResponseData>(backendEndpoint, { data: parsedJson.data });

            setResponse({
                ...res.data,
                user_id: "Siddharth Gautam",
                email: "22bcs16300@cuchd.in",
                roll_number: "22bcs16300"
            });

            setError("");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError("Invalid JSON: " + err.message);
            } else {
                setError("An unknown error occurred.");
            }
            setResponse(null);
        }
    };

    const filteredResponse = (): Partial<ResponseData> | null => {
        if (!response) return null;

        const selectedValues = selectedOptions.map((option) => option.value);
        const filteredData: Partial<ResponseData> = {
            user_id: "Siddharth Gautam",
            email: "22bcs16300@cuchd.in",
            roll_number: "22bcs16300",
        };

        selectedValues.forEach((key) => {
            if (response && key in response) {
                filteredData[key as keyof ResponseData] = response[key as keyof ResponseData];
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
                        <Select
                            isMulti
                            options={options}
                            onChange={handleSelectChange}
                            className="mb-3"
                        />
                        <h4 className="text-dark">Filtered Response:</h4>
                        <pre className="bg-dark text-white p-3 rounded">{JSON.stringify(filteredResponse(), null, 2)}</pre>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;