import React, { useRef } from 'react';
import { Upload, FileDown, Database, Play, RotateCcw, File } from 'lucide-react';
import { generateSampleCSV } from '../utils/simulationUtils';

const ActionArea = ({
    onLoadSample,
    onUpload,
    onPdfUpload,
    onStart,
    onReset,
    isSimulating,
    hasData,
    isFinished
}) => {
    const fileInputRef = useRef(null);
    const pdfInputRef = useRef(null);

    const handlePdfChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            onPdfUpload(e.target.files);
        }
    };

    const handleDownloadTemplate = () => {
        const csvContent = generateSampleCSV();
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'whatsapp_template.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            onUpload(file);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Template Button */}
                <button
                    onClick={handleDownloadTemplate}
                    className="flex items-center justify-center space-x-2 p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all group"
                >
                    <FileDown className="text-gray-400 group-hover:text-blue-500" />
                    <span className="font-medium text-gray-600 group-hover:text-blue-700">Download Template</span>
                </button>

                {/* Load Sample Data */}
                <button
                    onClick={onLoadSample}
                    disabled={hasData || isSimulating}
                    className={`flex items-center justify-center space-x-2 p-4 rounded-lg bg-gray-50 border border-gray-200 transition-all
            ${hasData ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 hover:border-gray-300'}`}
                >
                    <Database className="text-gray-500" />
                    <span className="font-medium text-gray-700">Load Sample Data</span>
                </button>

                {/* Upload CSV */}
                <div className="relative">
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept=".csv"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={hasData || isSimulating}
                        className={`w-full h-full flex items-center justify-center space-x-2 p-4 rounded-lg bg-blue-50 border border-blue-100 transition-all
              ${hasData ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-100 hover:border-blue-200'}`}
                    >
                        <Upload className="text-blue-600" />
                        <span className="font-medium text-blue-800">Upload CSV</span>
                    </button>
                </div>

                {/* Upload PDFs */}
                {hasData && !isFinished && !isSimulating && (
                    <div className="relative">
                        <input
                            type="file"
                            ref={pdfInputRef}
                            accept="application/pdf"
                            multiple
                            onChange={handlePdfChange}
                            className="hidden"
                        />
                        <button
                            onClick={() => pdfInputRef.current?.click()}
                            className="w-full h-full flex items-center justify-center space-x-2 p-4 rounded-lg bg-red-50 border border-red-100 hover:bg-red-100 hover:border-red-200 transition-all"
                        >
                            <File className="text-red-500" />
                            <span className="font-medium text-red-700">Upload PDFs</span>
                        </button>
                    </div>
                )}

                {/* Start/Reset Action */}
                {hasData && !isFinished && (
                    <button
                        onClick={onStart}
                        disabled={isSimulating}
                        className={`flex items-center justify-center space-x-2 p-4 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-200 hover:shadow-green-300 transition-all
              ${isSimulating ? 'opacity-75 cursor-wait' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
                    >
                        <Play className={isSimulating ? 'animate-pulse' : ''} />
                        <span className="font-bold text-lg">{isSimulating ? 'Processing...' : 'Start Simulation'}</span>
                    </button>
                )}

                {/* Reset Button (only when finished or has data but wants to clear) */}
                {(hasData && !isSimulating && (isFinished || !isFinished)) && isFinished && (
                    <button
                        onClick={onReset}
                        className="flex items-center justify-center space-x-2 p-4 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-all shadow-lg shadow-gray-200"
                    >
                        <RotateCcw />
                        <span className="font-bold text-lg">Start New Batch</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default ActionArea;
