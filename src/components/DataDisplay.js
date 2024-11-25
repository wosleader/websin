import React, { useState } from 'react';
import useHotkeys from '@reecelucas/react-use-hotkeys';

function DataDisplay({ currentValue, nextValue, copiedValues, onCopy, shortcut }) {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useHotkeys(shortcut, (e) => {
    e.preventDefault();
    onCopy();
  });

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const lastValue = copiedValues[copiedValues.length - 1];
  const olderValues = copiedValues.slice(0, -1).reverse();

  return (
    <div className="my-2">
      <div className="current-value p-4 border rounded-lg bg-white shadow-sm">
        <div className="grid grid-cols-3 gap-4">
          {/* Mevcut Değer */}
          <div className="col-span-2">
            <h2 className="text-sm font-medium text-gray-700 mb-1">Mevcut Değer:</h2>
            <p className="text-lg p-2 bg-gray-50 rounded border border-gray-200">
              {currentValue || 'Henüz değer seçilmedi'}
            </p>
          </div>

          {/* Sıradaki Değer */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">Sıradaki:</h3>
            <p className="text-lg p-2 bg-gray-50 rounded border border-gray-200">
              {nextValue || '-'}
            </p>
          </div>
        </div>

        <button 
          onClick={onCopy}
          className="mt-3 w-full bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors duration-200 text-sm font-medium"
        >
          Kopyala ({shortcut})
        </button>
      </div>

      {copiedValues.length > 0 && (
        <div className="mt-3 bg-white border rounded-lg shadow-sm">
          <button 
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            className="w-full px-4 py-2 flex justify-between items-center text-gray-700 font-medium text-sm border-b"
          >
            <span>Kopyalanan Değerler</span>
            <span className="text-gray-500">{isHistoryOpen ? '▼' : '▲'}</span>
          </button>

          <div className="p-2">
            {/* Son kopyalanan değer */}
            {lastValue && (
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200 text-sm">
                <span className="flex-1 font-medium text-gray-700">{lastValue.value}</span>
                <div className="text-xs text-gray-500">
                  <div>{lastValue.cellReference}</div>
                  <div>{formatDate(lastValue.timestamp)}</div>
                </div>
                <span className="text-green-600">✓</span>
              </div>
            )}

            {/* Eski değerler */}
            {isHistoryOpen && olderValues.length > 0 && (
              <div className="mt-2 space-y-1">
                {olderValues.map((item, index) => (
                  <div key={`old-${index}`} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded text-sm">
                    <span className="flex-1 text-gray-600">{item.value}</span>
                    <div className="text-xs text-gray-400">
                      <div>{item.cellReference}</div>
                      <div>{formatDate(item.timestamp)}</div>
                    </div>
                    <span className="text-green-500">✓</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default DataDisplay;