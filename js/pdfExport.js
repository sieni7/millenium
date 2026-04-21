// PDF Generation for Admin
const PDFExport = {
    init: () => {
        // Load jsPDF and AutoTable dynamically
        const script1 = document.createElement('script');
        script1.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script1.onload = () => {
            const script2 = document.createElement('script');
            script2.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js';
            script2.onload = () => {
                const btn = document.getElementById('export-pdf-btn');
                if (btn) {
                    btn.disabled = false;
                    btn.textContent = 'Exporter le catalogue (PDF)';
                    btn.addEventListener('click', () => {
                        this.generate(window.currentConfig);
                    });
                }
            };
            document.body.appendChild(script2);
        };
        document.body.appendChild(script1);
    },

    generate: (config) => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Header
        // Header with premium styling
        doc.setFillColor(30, 127, 110); // --primary
        doc.rect(0, 0, 210, 40, 'F');
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(24);
        doc.setTextColor(255, 255, 255);
        doc.text(config.company.name.toUpperCase(), 14, 25);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(200, 200, 200);
        doc.text('CATALOGUE OFFICIEL DES PRODUITS', 14, 33);

        doc.setTextColor(100);
        doc.setFontSize(9);
        doc.text(`Généré le : ${new Date().toLocaleDateString('fr-FR')}`, 14, 48);

        // Product Table
        const head = [['Produit', 'Indication', 'Laboratoire', 'Principe Actif', 'Format']];
        const data = config.products.map(p => [
            p.name,
            p.indication || '-',
            p.laboratory,
            p.active_ingredient,
            p.presentation
        ]);

        doc.autoTable({
            startY: 55,
            head: head,
            body: data,
            theme: 'striped',
            headStyles: { 
                fillColor: [30, 127, 110], 
                textColor: 255,
                fontSize: 10,
                fontStyle: 'bold',
                halign: 'center'
            },
            styles: { 
                fontSize: 9,
                cellPadding: 5
            },
            columnStyles: { 
                0: { fontStyle: 'bold', textColor: [30, 127, 110] },
                1: { cellWidth: 50 }
            }
        });

        // Footer
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`${config.company.address} | ${config.contact.phone}`, 14, finalY);

        doc.save(`KIRAM_PHARMA_Catalogue_${new Date().toISOString().split('T')[0]}.pdf`);
    }
};

export default PDFExport;
