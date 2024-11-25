import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';

function ExcelReader({ onFileLoad, onColumnSelect, onStartRowSelect, selectedColumn, startRow }) {
  const [columns, setColumns] = useState([]);
  const [isOpen, setIsOpen] = useState(true);
  const [fileName, setFileName] = useState('');
  const [totalRows, setTotalRows] = useState(0);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const workbook = XLSX.read(event.target.result, { type: 'binary' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(firstSheet);
        
        if (data.length > 0) {
          setColumns(Object.keys(data[0]));
          setTotalRows(data.length + 1);
          setFileName(file.name);
          onFileLoad(data);
          toast.success('Dosya başarıyla yüklendi!');
        }
      } catch (error) {
        toast.error('Dosya okuma hatası!');
        console.error('Excel dosyası okuma hatası:', error);
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleColumnSelect = (e) => {
    onColumnSelect(e.target.value);
  };

  const handleStartRowSelect = (e) => {
    const row = parseInt(e.target.value, 10);
    onStartRowSelect(row);
  };

  useEffect(() => {
    if (selectedColumn && startRow) {
      setIsOpen(false);
    }
  }, [selectedColumn, startRow]);

  return (
    <div className="mb-6">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg shadow-md flex justify-between items-center"
      >
        <span className="text-indigo-700 font-medium">
          {fileName ? (
            <div className="flex items-center gap-2">
              <span>Dosya: {fileName}</span>
              {selectedColumn && startRow && (
                <span className="text-sm text-green-600">
                  ({selectedColumn} sütunu, {startRow}. satırdan başlayarak)
                </span>
              )}
            </div>
          ) : (
            'Excel Dosyası Seçin'
          )}
        </span>
        <span className="text-indigo-700">{isOpen ? '▼' : '▲'}</span>
      </button>

      {isOpen && (
        <div className="mt-2 p-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg shadow-md">
          <div className="mb-4">
            <label className="block text-indigo-700 font-medium mb-2">Excel Dosyası Seçin</label>
            <input 
              type="file" 
              accept=".xlsx" 
              onChange={handleFileUpload}
              className="w-full p-2 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
            />
          </div>

          {columns.length > 0 && (
            <>
              <div className="mt-4">
                <label className="block text-indigo-700 font-medium mb-2">Sütun Seçin</label>
                <select
                  value={selectedColumn || ''}
                  onChange={handleColumnSelect}
                  className="w-full p-2 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <option value="">Sütun Seçiniz</option>
                  {columns.map((column, index) => (
                    <option key={index} value={column}>{column}</option>
                  ))}
                </select>
              </div>

              <div className="mt-4">
                <label className="block text-indigo-700 font-medium mb-2">Başlangıç Satırı Seçin</label>
                <select
                  value={startRow || ''}
                  onChange={handleStartRowSelect}
                  className="w-full p-2 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <option value="">Satır Seçiniz</option>
                  {[...Array(totalRows)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>Satır {i + 1}</option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default ExcelReader;