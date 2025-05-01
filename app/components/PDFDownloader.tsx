'use client';
import React from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Patient {
  id?: number;
  name: string;
  age: string;
  village: string;
}

interface PDFDownloaderProps {
  entries: Patient[];
}

const PDFDownloader: React.FC<PDFDownloaderProps> = ({ entries }) => {
  const downloadPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Name', 'Age', 'Village']],
      body: entries.map(entry => [entry.name, entry.age, entry.village]),
    });
    doc.save('Itakarlapalli_Data.pdf');
  };

  return (
    <button
      onClick={downloadPDF}
      style={{
        marginLeft: '1rem',
        padding: '8px 16px',
        background: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
      }}
    >
      Download PDF
    </button>
  );
};

export default PDFDownloader;
