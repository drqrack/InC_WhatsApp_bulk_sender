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
            
        required_columns = ['customer name', 'customer number', 'pdf filename']
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
            customer_name = row['customer name']
            phone = row['customer number']
            pdf_filename = row['pdf filename']
            
            print(f"[{index + 1}/{total_customers}] Processing {customer_name} ({phone})...", end='', flush=True)
            
            # Verify PDF file existence
            attachment = "None"
            
            # Simple check for file existence
            if os.path.exists(pdf_filename):
                print(f" 📎 Found {pdf_filename}...", end='', flush=True)
                attachment = pdf_filename
                time.sleep(1) # Simulate upload time
            else:
                 print(" ❌ PDF not found locally (simulating logic based on CSV)...", end='', flush=True)
                 # In this updated flow, we assume the CSV provides the correct filename.
                 # If we are strictly checking file existence, we should fail.
                 # However, to be helpful, let's warn but proceed or fail based on strictness.
                 # Given the previous context was strict:
                 # But let's check if the user wants strictly strict or if they just want to simulate.
                 # If the file isn't found, we can try to assume it's valid if just simulating, 
                 # but the script is for actual local running, so file existence matters.
                 
                 # Let's try to match slightly looser if needed, or strictly use the provided name.
                 # If the provided name is not found, we mark as missing.
                 pass

            if not os.path.exists(pdf_filename):
                print(" ❌ Failed (File not found)")
                failed_count += 1
                results.append({
                    'name': customer_name,
                    'phone': phone,
                    'pdf': pdf_filename,
                    'status': 'FAILED',
                    'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                    'message': f"Failed: File {pdf_filename} not found"
                })
                continue

            attachment = pdf_filename

            # Simulate processing time
            time.sleep(2)
            
            # Simulate success/failure (95% success rate)
            success = random.random() < 0.95
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            
            if success:
                status = "SUCCESS"
                print(" ✅ Sent")
                success_count += 1
                message = f"Hi {customer_name}, your invoice ({pdf_filename}) is ready. Thank you for your business!"
            else:
                status = "FAILED"
                print(" ❌ Failed")
                failed_count += 1
                message = "Failed to send message"
            
            results.append({
                'name': customer_name,
                'phone': phone,
                'pdf': pdf_filename,
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
            'customer name': ['John Mensah', 'Grace Adu', 'Kwame Osei', 'Ama Asante', 'Kofi Boateng'],
            'customer number': ['233244123456', '233201234567', '233551234567', '233209876543', '233245678901'],
            'pdf filename': ['invoice_001.pdf', 'invoice_002.pdf', 'invoice_003.pdf', 'invoice_004.pdf', 'invoice_005.pdf']
        }
        pd.DataFrame(data).to_excel('customers.xlsx', index=False)
        print("📝 Created sample 'customers.xlsx' file")

if __name__ == "__main__":
    print("WhatsApp Bulk Sender Python Simulator")
    create_sample_data()
    simulate_whatsapp_sender('customers.xlsx')
    input("\nPress Enter to exit...")
`;
