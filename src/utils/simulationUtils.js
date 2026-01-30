export const sampleCustomers = [
  { id: 1, name: "John Mensah", phone: "233244123456", pdf: "invoice_001.pdf", status: "pending" },
  { id: 2, name: "Grace Adu", phone: "233201234567", pdf: "invoice_002.pdf", status: "pending" },
  { id: 3, name: "Kwame Osei", phone: "233551234567", pdf: "invoice_003.pdf", status: "pending" },
  { id: 4, name: "Ama Asante", phone: "233209876543", pdf: "invoice_004.pdf", status: "pending" },
  { id: 5, name: "Kofi Boateng", phone: "233245678901", pdf: "invoice_005.pdf", status: "pending" }
];

export const csvHeaders = "customer name,customer number,pdf filename\n";

export const generateSampleCSV = () => {
  const rows = sampleCustomers.map(c => `${c.name},${c.phone},${c.pdf}`).join("\n");
  return csvHeaders + rows;
};

export const parseCSV = (text) => {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const required = ['customer name', 'customer number', 'pdf filename'];

  if (!required.every(r => headers.includes(r))) {
    throw new Error(`Missing required columns: ${required.join(', ')}`);
  }

  // Create a mapping of required columns to their indices
  const headerMap = {};
  required.forEach(req => {
    headerMap[req] = headers.indexOf(req);
  });

  return lines.slice(1).map((line, index) => {
    // Handle CSV parsing more robustly (ignoring empty lines resulting from split if filter didn't catch them all)
    if (!line.trim()) return null;

    const values = line.split(',');
    // Basic validation: ensure we have enough values for our required columns
    // Note: values.length can be greater than headers.length if there are extra commas, 
    // but we primarily care about the mapped indices.

    const customer = {
      name: values[headerMap['customer name']]?.trim(),
      phone: values[headerMap['customer number']]?.trim(),
      pdf: values[headerMap['pdf filename']]?.trim(),
      // Retain compatibility fields if needed, or leave them undefined
      invoice: values[headerMap['pdf filename']]?.trim().replace('.pdf', '') || `INV-${index + 1}`,
      amount: '0.00' // Default amount since it's removed from input
    };

    if (!customer.name || !customer.phone) return null;

    return {
      ...customer,
      id: Date.now() + index,
      status: 'pending'
    };
  }).filter(c => c !== null);
};

export const simulateMessage = async (customer) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Simulate 95% success rate
  const success = Math.random() < 0.95;
  const timestamp = new Date().toLocaleString();
  const message = `Hi ${customer.name}, your invoice (${customer.pdf}) is ready. Thank you for your business!`;

  return {
    success,
    timestamp,
    message
  };
};
