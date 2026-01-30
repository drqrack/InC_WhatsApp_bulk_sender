import React from 'react';
import { CheckCircle, XCircle, Download, FileText, Code } from 'lucide-react'; // Fixed: removed FileType which might not exist in older lucide v versions used, switched to FileText
import { pythonScriptTemplate } from '../utils/pythonTemplate';

const Summary = ({ stats, customers }) => {
    if (stats.total === 0) return null;

    const downloadResults = () => {
        const headers = ['name,phone,invoice,status,timestamp,message\n'];
        const rows = customers.map(c => {
            const statusStr = c.status.type === 'success' ? 'SUCCESS' : c.status.type === 'error' ? 'FAILED' : 'PENDING';
            const msg = c.result?.message || '';
            const cleanMessage = msg.replace(/"/g, '""'); // Escape quotes
            return `${c.name},${c.phone},${c.invoice},${statusStr},${c.result?.timestamp || ''},"${cleanMessage}"`;
        });

        const csvContent = headers.concat(rows).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `simulation_results_${new Date().getTime()}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const downloadPython = () => {
        const blob = new Blob([pythonScriptTemplate], { type: 'text/x-python' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'whatsapp_bulk_sender.py';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
            {/* Stats Card */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-gray-50 to-white">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Simulation Results</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-green-600">Success</span>
                                <CheckCircle className="w-5 h-5 text-green-500" />
                            </div>
                            <p className="text-3xl font-bold text-green-700">{stats.success}</p>
                        </div>
                        <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-red-600">Failed</span>
                                <XCircle className="w-5 h-5 text-red-500" />
                            </div>
                            <p className="text-3xl font-bold text-red-700">{stats.failed}</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-blue-600">Total</span>
                                <FileText className="w-5 h-5 text-blue-500" />
                            </div>
                            <p className="text-3xl font-bold text-blue-700">{stats.total}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Downloads Card */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg text-white p-6 flex flex-col justify-between">
                <div>
                    <h3 className="text-xl font-bold mb-2">Ready to Deploy?</h3>
                    <p className="text-indigo-100 text-sm mb-6">Download your results or get the python script to run this locally.</p>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={downloadResults}
                        className="w-full flex items-center justify-center space-x-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/20 p-3 rounded-lg transition-all active:scale-95"
                    >
                        <Download className="w-4 h-4" />
                        <span>Download Results CSV</span>
                    </button>
                    <button
                        onClick={downloadPython}
                        className="w-full flex items-center justify-center space-x-2 bg-white text-indigo-600 hover:bg-gray-50 p-3 rounded-lg font-semibold shadow-sm transition-all active:scale-95"
                    >
                        <Code className="w-4 h-4" />
                        <span>Get Python Script</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Summary;
