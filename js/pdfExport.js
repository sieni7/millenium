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
        doc.setFillColor(23, 94, 48); // --secondary (#175E30)
        doc.rect(0, 0, 210, 40, 'F');
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(24);
        doc.setTextColor(255, 255, 255);
        doc.text(config.company.name.toUpperCase(), 14, 25);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(230, 230, 230);
        doc.text('PORTFOLIO DES PROJETS IMMOBILIERS', 14, 33);

        doc.setTextColor(100);
        doc.setFontSize(9);
        doc.text(`Généré le : ${new Date().toLocaleDateString('fr-FR')}`, 14, 48);

        // Product Table (Real Estate Focus)
        const head = [['Projet', 'Description', 'Zone', 'Standing', 'Type']];
        const data = config.products.map(p => [
            p.name,
            p.description || '-',
            p.zone,
            p.standing,
            p.type
        ]);

        doc.autoTable({
            startY: 55,
            head: head,
            body: data,
            theme: 'striped',
            headStyles: { 
                fillColor: [23, 94, 48], 
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
                0: { fontStyle: 'bold', textColor: [240, 90, 34] }, // #F05A22 (Primary)
                1: { cellWidth: 50 }
            }
        });

        // Footer
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`${config.company.address} | ${config.contact.phone}`, 14, finalY);

        doc.save(`MILLENIUM_PATRIMOINE_Portfolio_${new Date().toISOString().split('T')[0]}.pdf`);
    }
};

export default PDFExport;
