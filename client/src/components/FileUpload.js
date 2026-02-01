import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';
import iconFile from '../assets/icon-file.png';

const FileUpload = ({ onUploadSuccess }) => {
    const url = "https://assessment-5xpn.onrender.com";

    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setMessage('');
            setStatus('');
            setUploadProgress(0);
        }
    };

    const handleTriggerFileSelect = () => {
        document.getElementById('fileInput').click();
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('Please select a file first.');
            setStatus('error');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);
        setUploadProgress(0);

        const totalDuration = Math.floor(Math.random() * (8000 - 5000 + 1) + 5000);
        const intervalTime = 50;
        const steps = totalDuration / intervalTime;
        let currentStep = 0;

        const progressInterval = setInterval(() => {
            currentStep++;
            const simulatedProgress = Math.min(90, Math.round((currentStep / steps) * 90));
            setUploadProgress(simulatedProgress);
        }, intervalTime);

        try {

            await new Promise(resolve => setTimeout(resolve, totalDuration));
            clearInterval(progressInterval);

            const res = await axios.post(`${url}/users/import`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },

                onUploadProgress: (progressEvent) => {

                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    const finalStage = 90 + Math.round(percentCompleted * 0.1);
                    setUploadProgress(finalStage);
                }
            });
            setMessage(`Success! ${res.data.count || ''} records imported.`);
            setStatus('success');
            setFile(null);
            setUploadProgress(100);
            if (onUploadSuccess) onUploadSuccess();
        } catch (error) {
            clearInterval(progressInterval);
            setMessage('Error uploading file: ' + (error.response?.data?.error || error.message));
            setStatus('error');
            setUploadProgress(0);
        } finally {
            clearInterval(progressInterval);
            setLoading(false);
        }
    };

    return (
        <div className="card upload-card-wrapper">

            <div className="compact-upload-container">
                <input
                    id="fileInput"
                    type="file"
                    className="file-input-hidden"
                    accept=".csv"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />

                <div className="icon-display-area">
                    <img
                        src={iconFile}
                        alt="CSV"
                        className="file-icon-large"
                    />
                </div>

                <button
                    className="btn-choose"
                    onClick={handleTriggerFileSelect}
                >
                    Choose CSV File
                </button>

                <p className="no-file-text">
                    {file ? file.name : "No file chosen"}
                </p>

                <div style={{ width: '100%', marginTop: '1rem' }}>
                    <button
                        className="btn-upload-action"
                        onClick={handleUpload}
                        disabled={!file || loading}
                    >
                        {loading ? 'Processing...' : 'Upload CSV'}
                    </button>

                    {loading && (
                        <div className="progress-track">
                            <div
                                className="progress-fill"
                                style={{ width: `${uploadProgress}% ` }}
                            ></div>
                        </div>
                    )}
                </div>
            </div>

            {message && (
                <div className={`status-message ${status} `}>
                    {status === 'success' && <span>✓ </span>}
                    {message}
                </div>
            )}
        </div>
    );
};

export default FileUpload;
