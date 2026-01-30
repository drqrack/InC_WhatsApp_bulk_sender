import React from 'react';
import { CheckCircle, XCircle, Clock, Loader2, User, File } from 'lucide-react';

const CustomerTable = ({ customers, currentId }) => {
    if (!customers.length) return null;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h3 className="font-semibold text-gray-800 flex items-center">
                    <User className="w-4 h-4 mr-2 text-gray-500" />
                    Customer List ({customers.length})
                </h3>
                <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Simulation View</span>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attachment</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {customers.map((customer) => {
                            const isProcessing = currentId === customer.id;

                            let StatusIcon = Clock;
                            let statusColor = "text-gray-300";
                            let rowClass = "hover:bg-gray-50 transition-colors";

                            if (customer.status.type === 'success') {
                                StatusIcon = CheckCircle;
                                statusColor = "text-green-500";
                                rowClass = "bg-green-50/30";
                            } else if (customer.status.type === 'error') {
                                StatusIcon = XCircle;
                                statusColor = "text-red-500";
                                rowClass = "bg-red-50/30";
                            } else if (isProcessing) {
                                StatusIcon = Loader2;
                                statusColor = "text-blue-500 animate-spin";
                                rowClass = "bg-blue-50 border-l-4 border-blue-500";
                            }

                            return (
                                <tr key={customer.id} className={rowClass}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <StatusIcon className={`w-5 h-5 ${statusColor}`} />
                                            {customer.status.text && !isProcessing && (
                                                <span className={`ml-2 text-xs font-medium ${customer.status.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                                                    {customer.status.text}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {customer.attachment ? (
                                            <div className="flex items-center text-red-600" title={customer.attachment}>
                                                <File className="w-5 h-5" />
                                                <span className="ml-2 text-xs text-gray-500 truncate max-w-[100px]">{customer.attachment}</span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-300 text-xs">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500 font-mono">{customer.phone}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            {customer.invoice}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CustomerTable;
