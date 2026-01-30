import React from 'react';
import { Zap } from 'lucide-react';
import logo from '../assets/logo.png';

const Header = () => {
    return (
        <header className="bg-white shadow-sm border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="bg-white p-1 rounded-lg">
                            <img src={logo} alt="Logo" className="h-20 w-auto" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 leading-tight">
                                WhatsApp Bulk Sender
                            </h1>
                            <p className="text-sm text-gray-500">Processing Automation Tool</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                            <Zap size={12} className="mr-1" />
                            Test Mode
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
