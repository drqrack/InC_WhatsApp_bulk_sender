export const sampleCustomers = [
  { id: 1, name: "John Mensah", phone: "233244123456", amount: "500.00", invoice: "INV-001", status: "pending" },
  { id: 2, name: "Grace Adu", phone: "233201234567", amount: "750.00", invoice: "INV-002", status: "pending" },
  { id: 3, name: "Kwame Osei", phone: "233551234567", amount: "1200.00", invoice: "INV-003", status: "pending" },
  { id: 4, name: "Ama Asante", phone: "233209876543", amount: "1500.00", invoice: "INV-004", status: "pending" },
  { id: 5, name: "Kofi Boateng", phone: "233245678901", amount: "890.00", invoice: "INV-005", status: "pending" }
];

export const csvHeaders = "name,phone,amount,invoice\n";

export const generateSampleCSV = () => {
  const rows = sampleCustomers.map(c => `${c.name},${c.phone},${c.amount},${c.invoice}`).join("\n");
  return csvHeaders + rows;
};

export const parseCSV = (text) => {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const required = ['name', 'phone', 'amount', 'invoice'];
  
  if (!required.every(r => headers.includes(r))) {
    throw new Error(`Missing required columns: ${required.join(', ')}`);
  }

  return lines.slice(1).map((line, index) => {
    const values = line.split(',');
    if (values.length !== headers.length) return null;
    
    const customer = {};
    headers.forEach((header, i) => {
      customer[header] = values[i].trim();
    });
    
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
  const message = `Hi ${customer.name}, your invoice #${customer.invoice} for GH₵ ${customer.amount} is ready. Thank you for your business!`;
  
  return {
    success,
    timestamp,
    message
  };
};
