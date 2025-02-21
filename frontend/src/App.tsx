import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select, { MultiValue, ActionMeta } from 'react-select';
import './App.css';

interface OptionType {
    value: string;
    label: string;
}

interface BackendResponse {
    is_success: boolean;
    user_id: string;
    email: string;
    roll_number?: string;
    numbers: string[];
    alphabets: string[];
    highest_alphabet: string[];
}

const App = () => {
    const [jsonData, setJsonData] = useState<string>('');
    const [response, setResponse] = useState<BackendResponse | null>(null);
    const [error, setError] = useState<string>('');
    const [selectedOptions, setSelectedOptions] = useState<OptionType[]>([]);
    const [rollNumber, setRollNumber] = useState<string>('22bcs16300');

    const backendEndpoint =  'https://bfhlcode.vercel.app/bfhl';

    useEffect(() => {
        document.title = rollNumber;
    }, [rollNumber]);

    const options: OptionType[] = [
        { value: 'alphabets', label: 'Alphabets' },
        { value: 'numbers', label: 'Numbers' },
        { value: 'highest_alphabet', label: 'Highest Alphabet' },
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setJsonData(e.target.value);
    };

    const handleSelectChange = (newValue: MultiValue<OptionType>, actionMeta: ActionMeta<OptionType>) => {
        setSelectedOptions(newValue as OptionType[]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            JSON.parse(jsonData);
            const parsedJson = JSON.parse(jsonData) as { data: string[] };

            const res = await axios.post<BackendResponse>(backendEndpoint, { data: parsedJson.data });
            setResponse(res.data);
            setError('');
        } catch (err: any) {
            setError('Invalid JSON: ' + err.message);
            setResponse(null);
        }
    };

    const filteredResponse = () => {
        if (!response) return null;
        const selectedValues = selectedOptions.map(option => option.value);
        const filteredData: Partial<BackendResponse> = {};

        selectedValues.forEach(key => {
            if (response.hasOwnProperty(key)) {
                (filteredData as any)[key] = response[key as keyof BackendResponse];
            }
        });

        return filteredData;
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">{rollNumber}</h1>
                
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <label className="text-gray-700 font-semibold">
                        JSON Input:
                        <textarea
                            value={jsonData}
                            onChange={handleInputChange}
                            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm"
                            rows={4}
                        />
                    </label>
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 shadow-md"
                    >
                        Submit
                    </button>
                </form>

                {error && <p className="text-red-500 mt-4 font-semibold">{error}</p>}

                {response && (
                    <div className="mt-6">
                        <Select
                            isMulti
                            options={options}
                            onChange={handleSelectChange}
                            className="basic-multi-select text-black"
                            classNamePrefix="select"
                        />
                        <h2 className="text-2xl font-bold mt-4 text-gray-800">Filtered Response:</h2>
                        <div className="bg-gray-900 text-green-300 font-mono text-sm p-4 rounded-lg mt-2 overflow-auto">
                            <pre>{JSON.stringify(filteredResponse(), null, 2)}</pre>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
