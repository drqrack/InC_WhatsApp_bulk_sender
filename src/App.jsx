import React, { useState } from 'react';
import Header from './components/Header';
import ActionArea from './components/ActionArea';
import CustomerTable from './components/CustomerTable';
import Summary from './components/Summary';
import { sampleCustomers, parseCSV, simulateMessage } from './utils/simulationUtils';

function App() {
  const [customers, setCustomers] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [stats, setStats] = useState({ total: 0, success: 0, failed: 0 });
  const [isFinished, setIsFinished] = useState(false);

  // Load sample data
  const handleLoadSample = () => {
    const formattedMeta = sampleCustomers.map(c => ({
      ...c,
      attachment: c.pdf,
      status: { type: 'pending', text: 'Waiting' }
    }));
    setCustomers(formattedMeta);
    setStats({ total: formattedMeta.length, success: 0, failed: 0 });
    setIsFinished(false);
  };

  // Upload CSV
  const handleUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const parsed = parseCSV(text);
        const formatted = parsed.map(c => ({
          ...c,
          attachment: null,
          status: { type: 'pending', text: 'Waiting' }
        }));
        setCustomers(formatted);
        setStats({ total: formatted.length, success: 0, failed: 0 });
        setIsFinished(false);
      } catch (err) {
        alert('Error parsing CSV: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  // Handle PDF Upload
  const handlePdfUpload = (files) => {
    if (!customers.length) return;

    const fileList = Array.from(files);
    let matchedCount = 0;

    const updatedCustomers = customers.map(customer => {
      // Find a matching PDF file where filename matches the expected pdf filename from CSV
      // We start by checking exact match or case-insensitive match on the pdf field
      const intendedPdfName = customer.pdf || '';

      const matchedFile = fileList.find(file =>
        file.name.toLowerCase() === intendedPdfName.toLowerCase()
      );

      if (matchedFile) matchedCount++;

      return {
        ...customer,
        // Only update attachment if we found a match, otherwise keep existing (or null)
        attachment: matchedFile ? matchedFile.name : customer.attachment
      };
    });

    setCustomers(updatedCustomers);
    alert(`Matched ${matchedCount} PDFs to ${customers.length} customers.`);
  };

  // Run Simulation
  const startSimulation = async () => {
    setIsSimulating(true);
    setIsFinished(false);

    // Reset statuses if re-running
    const resetCustomers = customers.map(c => ({
      ...c,
      status: { type: 'pending', text: 'Waiting' },
      result: null
    }));
    setCustomers(resetCustomers);
    setStats({ total: resetCustomers.length, success: 0, failed: 0 });

    let currentStats = { total: resetCustomers.length, success: 0, failed: 0 };

    for (let i = 0; i < resetCustomers.length; i++) {
      const customer = resetCustomers[i];
      setCurrentId(customer.id);

      // Update status to processing
      setCustomers(prev => prev.map(c =>
        c.id === customer.id
          ? { ...c, status: { type: 'processing', text: 'Preparing...' } }
          : c
      ));

      // Check for Missing Attachment - Strict Validation
      if (!customer.attachment) {
        // Brief 500ms delay to show processing state before failure
        await new Promise(r => setTimeout(r, 500));

        currentStats.failed++;
        setStats({ ...currentStats });

        setCustomers(prev => prev.map(c =>
          c.id === customer.id
            ? {
              ...c,
              status: { type: 'error', text: 'Missing PDF' },
              result: { success: false, timestamp: new Date().toLocaleString(), message: 'Failed: Missing PDF Attachment' }
            }
            : c
        ));
        continue; // Skip the rest of the simulation for this customer
      }

      // Simulate Attachment Upload
      if (customer.attachment) {
        await new Promise(r => setTimeout(r, 1000));
        setCustomers(prev => prev.map(c =>
          c.id === customer.id
            ? { ...c, status: { type: 'processing', text: 'Uploading PDF...' } }
            : c
        ));
      }

      // Simulate delay and send
      const result = await simulateMessage(customer);

      // Update stats
      if (result.success) currentStats.success++;
      else currentStats.failed++;
      setStats({ ...currentStats });

      // Update customer status
      setCustomers(prev => prev.map(c =>
        c.id === customer.id
          ? {
            ...c,
            status: {
              type: result.success ? 'success' : 'error',
              text: result.success ? 'Sent' : 'Failed'
            },
            result // Store full result for download
          }
          : c
      ));
    }

    setCurrentId(null);
    setIsSimulating(false);
    setIsFinished(true);
  };

  const resetAll = () => {
    setCustomers([]);
    setStats({ total: 0, success: 0, failed: 0 });
    setIsFinished(false);
    setCurrentId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Simulation Dashboard</h2>
          <p className="text-gray-600">
            Upload your customer list or use sample data to test the WhatsApp sending capability.
            This simulation runs in your browser.
          </p>
        </div>

        <ActionArea
          onLoadSample={handleLoadSample}
          onUpload={handleUpload}
          onPdfUpload={handlePdfUpload}
          onStart={startSimulation}
          onReset={resetAll}
          isSimulating={isSimulating}
          hasData={customers.length > 0}
          isFinished={isFinished}
        />

        {customers.length > 0 && (
          <>
            <CustomerTable
              customers={customers}
              currentId={currentId}
            />

            {isFinished && (
              <Summary stats={stats} customers={customers} />
            )}
          </>
        )}
      </main>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-8 border-t border-gray-200">
        <div className="text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} WhatsApp Bulk Sender Simulator. Designed for testing and verification.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
