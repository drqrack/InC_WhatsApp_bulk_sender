from reportlab.pdfgen import canvas
import os

def create_dummy_pdf(filename, text):
    c = canvas.Canvas(filename)
    c.drawString(100, 750, text)
    c.save()
    print(f"Created {filename}")

def generate_pdfs():
    if not os.path.exists('sample_pdfs'):
        os.makedirs('sample_pdfs')
        
    customers = [
        ("INV-001", "John Mensah"),
        ("INV-002", "Grace Adu"),
        ("INV-003", "Kwame Osei"),
        ("INV-004", "Ama Asante"),
        ("INV-005", "Kofi Boateng")
    ]
    
    print("Generating sample PDFs for testing...")
    for invoice, name in customers:
        filename = f"sample_pdfs/{invoice}.pdf"
        create_dummy_pdf(filename, f"Invoice: {invoice}\nCustomer: {name}\nAmount: 500.00")

    print("\n✅ Done! Now go to the Web App:")
    print("1. Click 'Load Sample Data'")
    print("2. Click 'Upload PDFs'")
    print("3. Navigate to the 'sample_pdfs' folder and select ALL files.")

if __name__ == "__main__":
    try:
        import reportlab
        generate_pdfs()
    except ImportError:
        print("ReportLab is not installed. Installing...")
        os.system("pip install reportlab")
        generate_pdfs()
