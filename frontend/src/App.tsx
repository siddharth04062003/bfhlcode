import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select, { MultiValue, ActionMeta } from 'react-select';
import './App.css'; // We'll define custom styles here

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
    const [jsonData, setJsonData] = useState<string>('{"data": ["1", "a", "3", "z", "5", "b"]}');
    const [response, setResponse] = useState<BackendResponse | null>(null);
    const [error, setError] = useState<string>('');
    const [selectedOptions, setSelectedOptions] = useState<OptionType[]>([]);
    const [rollNumber, setRollNumber] = useState<string>('22bcs16300');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<'input' | 'response'>('input');

    const backendEndpoint = import.meta.env.VITE_BACKEND_URL || 'https://bfhlcode.vercel.app/bfhl';

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
        setIsLoading(true);
        setError('');
        
        try {
            JSON.parse(jsonData);
            const parsedJson = JSON.parse(jsonData) as { data: string[] };

            const res = await axios.post<BackendResponse>(backendEndpoint, { data: parsedJson.data });
            setResponse(res.data);
            setActiveTab('response');
        } catch (err: any) {
            setError('Invalid JSON: ' + err.message);
            setResponse(null);
        } finally {
            setIsLoading(false);
        }
    };

    const formatJsonExample = () => {
        setJsonData(JSON.stringify({ data: ["1", "a", "3", "z", "5", "b"] }, null, 2));
    };

    const filteredResponse = () => {
        if (!response) return null;
        
        if (selectedOptions.length === 0) return response;
        
        const selectedValues = selectedOptions.map(option => option.value);
        const filteredData: Partial<BackendResponse> = {
            is_success: response.is_success,
            user_id: response.user_id,
            email: response.email,
            roll_number: response.roll_number
        };

        selectedValues.forEach(key => {
            if (response.hasOwnProperty(key)) {
                (filteredData as any)[key] = response[key as keyof BackendResponse];
            }
        });

        return filteredData;
    };

    return (
        <div className="app-container">
            <div className="card">
                {/* Header */}
                <div className="header">
                    <div className="header-content">
                        <h1 className="app-title">Data Processor</h1>
                        <div className="roll-number">
                            <p>{rollNumber}</p>
                        </div>
                    </div>
                    <p className="app-subtitle">Process and filter array elements by type</p>
                </div>
                
                {/* Tabs */}
                <div className="tabs">
                    <button 
                        onClick={() => setActiveTab('input')}
                        className={`tab ${activeTab === 'input' ? 'active' : ''}`}
                    >
                        Input Data
                    </button>
                    <button 
                        onClick={() => setActiveTab('response')}
                        className={`tab ${activeTab === 'response' ? 'active' : ''}`}
                        disabled={!response}
                    >
                        Results
                    </button>
                </div>
                
                {/* Content */}
                <div className="content-area">
                    {activeTab === 'input' ? (
                        <form onSubmit={handleSubmit} className="input-form">
                            <div className="form-group">
                                <div className="label-row">
                                    <label className="form-label">JSON Input:</label>
                                    <button
                                        type="button"
                                        onClick={formatJsonExample}
                                        className="example-button"
                                    >
                                        Use example
                                    </button>
                                </div>
                                <textarea
                                    value={jsonData}
                                    onChange={handleInputChange}
                                    className="json-textarea"
                                    placeholder='{"data": ["1", "a", "3", "z", "5", "b"]}'
                                />
                                {error && (
                                    <div className="error-message">
                                        <svg className="error-icon" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        <span>{error}</span>
                                    </div>
                                )}
                            </div>
                            <div className="button-container">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="submit-button"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="spinner-track" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : "Process Data"}
                                </button>
                            </div>
                        </form>
                    ) : (
                        response && (
                            <div className="response-container">
                                <div className="filter-section">
                                    <h3 className="section-title">Filter Results</h3>
                                    <Select
                                        isMulti
                                        options={options}
                                        value={selectedOptions}
                                        onChange={handleSelectChange}
                                        placeholder="Select categories to display..."
                                        className="select-filter"
                                        theme={(theme) => ({
                                            ...theme,
                                            colors: {
                                                ...theme.colors,
                                                primary: '#5c6ac4',
                                                primary75: '#7c86e1',
                                                primary50: '#b3b9ff',
                                                primary25: '#e6e8ff',
                                            },
                                        })}
                                    />
                                </div>
                                
                                <div className="result-section">
                                    <div className="result-header">
                                        <h3 className="section-title">Response Data</h3>
                                        <div className="status-indicator">
                                            <span className={`status-dot ${response.is_success ? 'success' : 'error'}`}></span>
                                            Status: {response.is_success ? 'Success' : 'Failed'}
                                        </div>
                                    </div>
                                    
                                    <div className="json-result-container">
                                        <div className="json-meta">
                                            <div className="user-id">User: {response.user_id}</div>
                                            <div className="roll-number-badge">
                                                {response.roll_number || 'No Roll Number'}
                                            </div>
                                        </div>
                                        <div className="json-display">
                                            <pre>{JSON.stringify(filteredResponse(), null, 2)}</pre>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="action-buttons">
                                    <button
                                        onClick={() => setActiveTab('input')}
                                        className="back-button"
                                    >
                                        <svg className="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                        Back to Input
                                    </button>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(JSON.stringify(filteredResponse(), null, 2));
                                        }}
                                        className="copy-button"
                                    >
                                        <svg className="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                        </svg>
                                        Copy JSON
                                    </button>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
            
        </div>
    );
};

export default App;