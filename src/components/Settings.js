import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

function Settings({ shortcut, onShortcutChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [newShortcut, setNewShortcut] = useState(shortcut);
  const [isRecording, setIsRecording] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (shortcut === 'ctrl+p') {
      onShortcutChange('alt+q');
    }
  }, []);

  const handleKeyDown = (e) => {
    e.preventDefault();
    
    if (isRecording) {
      const modifiers = [];
      if (e.ctrlKey) modifiers.push('ctrl');
      if (e.altKey) modifiers.push('alt');
      if (e.shiftKey) modifiers.push('shift');

      if (e.key === 'Control' || e.key === 'Alt' || e.key === 'Shift') {
        return;
      }

      const key = e.key.toLowerCase();
      const newCombo = [...modifiers, key].join('+');
      
      setNewShortcut(newCombo);
      setIsRecording(false);
      toast.info(`Yeni kısayol: ${newCombo}`);
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    toast.info('Kısayol tuşlarını giriniz...');
  };

  const handleSave = () => {
    onShortcutChange(newShortcut);
    setIsOpen(false);
    toast.success('Kısayol tuşu güncellendi!');
  };

  return (
    <div className="settings mt-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
      >
        Ayarlar
      </button>

      {isOpen && (
        <div className="settings-panel p-6 border rounded-lg mt-2 bg-white shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-indigo-700">Kısayol Tuşu Ayarla</h3>
          
          <div className="flex items-center gap-2">
            <input 
              ref={inputRef}
              type="text"
              value={isRecording ? 'Tuş kombinasyonunu girin...' : newShortcut}
              onKeyDown={handleKeyDown}
              onClick={startRecording}
              readOnly
              className="border p-2 rounded-lg mr-2 bg-gray-50 focus:ring-2 focus:ring-purple-300 focus:outline-none w-64"
              placeholder="Kısayol tuşunu girmek için tıklayın"
            />
            <button 
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
            >
              Kaydet
            </button>
          </div>
          
          <p className="mt-2 text-sm text-gray-600">
            {isRecording ? 'Kısayol tuşlarını giriniz...' : 'Kısayol tuşunu değiştirmek için tıklayın'}
          </p>
        </div>
      )}
    </div>
  );
}

export default Settings;