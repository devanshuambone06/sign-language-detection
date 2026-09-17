import api from './api';

export const exportToPDF = async (data) => {
  try {
    const response = await api.post('/api/export/pdf', data, {
      responseType: 'blob',
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `sign-language-history-${Date.now()}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return { success: true };
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    if (error.response?.status === 404 || error.code === 'ERR_NETWORK') {
      throw new Error('Export service is currently unavailable.');
    }
    throw error;
  }
};

export const exportToDOCX = async (data) => {
  try {
    const response = await api.post('/api/export/docx', data, {
      responseType: 'blob',
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `sign-language-history-${Date.now()}.docx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return { success: true };
  } catch (error) {
    console.error('Error exporting to DOCX:', error);
    if (error.response?.status === 404 || error.code === 'ERR_NETWORK') {
      throw new Error('Export service is currently unavailable.');
    }
    throw error;
  }
};

export const exportToCSV = async (data) => {
  try {
    const response = await api.post('/api/export/csv', data, {
      responseType: 'blob',
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `sign-language-history-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return { success: true };
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    if (error.response?.status === 404 || error.code === 'ERR_NETWORK') {
      throw new Error('Export service is currently unavailable.');
    }
    throw error;
  }
};
