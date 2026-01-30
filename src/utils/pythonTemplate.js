export const pythonScriptTemplate = `
import pandas as pd
import time
import random
from datetime import datetime
import os

def simulate_whatsapp_sender(input_file='customers.xlsx'):
    print("🚀 Starting WhatsApp Bulk Sender Simulation...")
    print(f"📂 Reading data from {input_file}...")
    
    try:
        # Load data
        if input_file.endswith('.csv'):
            df = pd.read_csv(input_file)
        else:
            df = pd.read_excel(input_file)
            
        required_columns = ['name', 'phone', 'amount', 'invoice']
        if not all(col in df.columns for col in required_columns):
            print(f"❌ Error: Input file must contain columns: {', '.join(required_columns)}")
            return

        results = []
        total_customers = len(df)
        print(f"👥 Found {total_customers} customers. Starting simulation...")
        print("-" * 50)

        success_count = 0
        failed_count = 0

        for index, row in df.iterrows():
            customer_name = row['name']
            phone = row['phone']
            invoice = row['invoice']
            amount = row['amount']
            
            print(f"[{index + 1}/{total_customers}] Processing {customer_name} ({phone})...", end='', flush=True)
            
            # Find matching invoice PDF
            attachment = "None"
            pdf_file = f"{invoice}.pdf"
            
            # Simple check for file existence
            if os.path.exists(pdf_file):
                print(f" 📎 Found {pdf_file}...", end='', flush=True)
                attachment = pdf_file
                time.sleep(1) # Simulate upload time
            else:
                 # Try matching part of filename
                for file in os.listdir('.'):
                    if file.endswith('.pdf') and invoice.lower() in file.lower():
                        print(f" 📎 Found {file}...", end='', flush=True)
                        attachment = file
                        time.sleep(1)
                        break

            # Check if attachment was found
            if attachment == "None":
                print(" ❌ Failed (Missing PDF)")
                failed_count += 1
                results.append({
                    'name': customer_name,
                    'phone': phone,
                    'invoice': invoice,
                    'amount': amount,
                    'attachment': None,
                    'status': 'FAILED',
                    'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                    'message': "Failed: Missing PDF Attachment"
                })
                continue # Skip this customer

            # Simulate processing time
            time.sleep(2)
            
            # Simulate success/failure (95% success rate)
            success = random.random() < 0.95
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            
            if success:
                status = "SUCCESS"
                print(" ✅ Sent")
                success_count += 1
                message = f"Hi {customer_name}, your invoice #{invoice} for GH₵ {amount} is ready. Thank you for your business!"
            else:
                status = "FAILED"
                print(" ❌ Failed")
                failed_count += 1
                message = "Failed to send message"
            
            results.append({
                'name': customer_name,
                'phone': phone,
                'invoice': invoice,
                'amount': amount,
                'attachment': attachment,
                'status': status,
                'timestamp': timestamp,
                'message': message
            })

        # Generate report
        print("-" * 50)
        print("📊 Simulation Completed!")
        print(f"✅ Successful: {success_count}")
        print(f"❌ Failed: {failed_count}")
        
        # Save results
        output_file = f"whatsapp_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
        pd.DataFrame(results).to_excel(output_file, index=False)
        print(f"💾 Results saved to: {output_file}")
        
    except FileNotFoundError:
        print(f"❌ Error: File {input_file} not found.")
    except Exception as e:
        print(f"❌ An error occurred: {str(e)}")

# Create sample data if file doesn't exist
def create_sample_data():
    if not os.path.exists('customers.xlsx') and not os.path.exists('customers.csv'):
        data = {
            'name': ['John Mensah', 'Grace Adu', 'Kwame Osei', 'Ama Asante', 'Kofi Boateng'],
            'phone': ['233244123456', '233201234567', '233551234567', '233209876543', '233245678901'],
            'amount': [500.00, 750.00, 1200.00, 1500.00, 890.00],
            'invoice': ['INV-001', 'INV-002', 'INV-003', 'INV-004', 'INV-005']
        }
        pd.DataFrame(data).to_excel('customers.xlsx', index=False)
        print("📝 Created sample 'customers.xlsx' file")

if __name__ == "__main__":
    print("WhatsApp Bulk Sender Python Simulator")
    create_sample_data()
    simulate_whatsapp_sender('customers.xlsx')
    input("\nPress Enter to exit...")
`;
