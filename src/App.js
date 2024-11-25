import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ExcelReader from './components/ExcelReader';
import Settings from './components/Settings';
import DataDisplay from './components/DataDisplay';
import './App.css';

function App() {
  const [rawData, setRawData] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState('');
  const [startRow, setStartRow] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copiedValues, setCopiedValues] = useState([]);
  const [shortcut, setShortcut] = useState('alt+q');

  // Veriyi işle
  useEffect(() => {
    if (rawData.length > 0 && selectedColumn && startRow) {
      const filtered = rawData.slice(startRow - 2);
      setProcessedData(filtered);
      setCurrentIndex(0);
      setCopiedValues([]);
    }
  }, [rawData, selectedColumn, startRow]);

  const getCurrentValue = () => {
    if (processedData.length > currentIndex && selectedColumn) {
      return processedData[currentIndex][selectedColumn];
    }
    return '';
  };

  const getNextValue = () => {
    if (processedData.length > currentIndex + 1 && selectedColumn) {
      return processedData[currentIndex + 1][selectedColumn];
    }
    return '';
  };

  const handleCopy = () => {
    const currentValue = getCurrentValue();
    if (currentValue) {
      navigator.clipboard.writeText(currentValue);
      const copyInfo = {
        value: currentValue,
        timestamp: new Date(),
        cellReference: `A${startRow + currentIndex}`
      };
      setCopiedValues(prev => [...prev, copyInfo]);
      setCurrentIndex(currentIndex + 1);
      toast.success('Değer kopyalandı!');
    }
  };

  const handleFileLoad = (data) => {
    setRawData(data);
    setProcessedData([]);
    setCurrentIndex(0);
    setCopiedValues([]);
    setSelectedColumn('');
    setStartRow(null);
  };

  const handleShortcutChange = (newShortcut) => {
    setShortcut(newShortcut);
    localStorage.setItem('copyShortcut', newShortcut);
  };

  // Sayfa yüklendiğinde kaydedilmiş kısayolu yükle
  useEffect(() => {
    const savedShortcut = localStorage.getItem('copyShortcut');
    if (savedShortcut) {
      setShortcut(savedShortcut);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-4">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-xl font-semibold mb-4 text-center text-gray-800">
          Excel Veri İşleyici
        </h1>
        
        <ExcelReader 
          onFileLoad={handleFileLoad}
          onColumnSelect={setSelectedColumn}
          onStartRowSelect={setStartRow}
          selectedColumn={selectedColumn}
          startRow={startRow}
        />
        
        <DataDisplay 
          currentValue={getCurrentValue()}
          nextValue={getNextValue()}
          copiedValues={copiedValues}
          onCopy={handleCopy}
          shortcut={shortcut}
        />

        <Settings 
          shortcut={shortcut}
          onShortcutChange={handleShortcutChange}
        />
      </div>
      
      <ToastContainer 
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;