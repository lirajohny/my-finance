import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import dayjs from 'dayjs';

// Exportar elemento como PDF
export const exportToPDF = async (element: HTMLElement, fileName: string = 'relatorio') => {
  try {
    const canvas = await html2canvas(element, {
      scale: 2, // Melhor qualidade
      useCORS: true,
      logging: false
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    
    // Adiciona data no rodapé
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Gerado em ${dayjs().format('DD/MM/YYYY HH:mm')}`, 10, 290);
    
    pdf.save(`${fileName}.pdf`);
    
    return true;
  } catch (error) {
    console.error('Erro ao exportar para PDF:', error);
    throw error;
  }
};

// Exportar dados para CSV
export const exportToCSV = (data: any[], fileName: string = 'dados') => {
  try {
    if (!data || !data.length) {
      throw new Error('Nenhum dado para exportar');
    }
    
    // Obtém os cabeçalhos do primeiro objeto
    const headers = Object.keys(data[0]);
    
    // Converte os dados para formato CSV
    const csvRows = [];
    
    // Adiciona os cabeçalhos
    csvRows.push(headers.join(','));
    
    // Adiciona os dados
    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header];
        // Trata valores nulos e vazios
        if (value === null || value === undefined) return '';
        
        // Converte datas para string formatada
        if (value instanceof Date) {
          return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
        }
        
        // Converte objetos para JSON
        if (typeof value === 'object') {
          return JSON.stringify(value);
        }
        
        // Escapa strings com vírgulas
        const valueStr = String(value);
        return valueStr.includes(',') ? `"${valueStr}"` : valueStr;
      });
      
      csvRows.push(values.join(','));
    }
    
    // Cria o blob CSV
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    
    // Cria o link de download
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('Erro ao exportar para CSV:', error);
    throw error;
  }
};
