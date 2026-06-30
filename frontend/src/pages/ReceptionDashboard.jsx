import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import api from '../api/axios';
import { QrCode, CheckCircle, XCircle } from 'lucide-react';

const ReceptionDashboard = () => {
  const [scanResult, setScanResult] = useState(null);
  const [scanError, setScanError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    let scanner = null;
    
    if (isScanning) {
      scanner = new Html5QrcodeScanner('reader', {
        qrbox: {
          width: 250,
          height: 250,
        },
        fps: 5,
      });

      scanner.render(onScanSuccess, onScanFailure);
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(error => {
          console.error("Failed to clear html5QrcodeScanner. ", error);
        });
      }
    };
  }, [isScanning]);

  const onScanSuccess = async (decodedText) => {
    setIsScanning(false);
    setLoading(true);
    setScanError(null);
    setScanResult(null);
    
    try {
      const response = await api.post('/attendance/scan', { qrData: decodedText });
      if (response.data.success) {
        setScanResult(response.data.message);
      }
    } catch (err) {
      setScanError(err.response?.data?.message || 'Failed to scan QR code');
    } finally {
      setLoading(false);
    }
  };

  const onScanFailure = (error) => {
    // Usually ignoring regular scan failures since it scans continuously
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white uppercase tracking-tight">Reception Panel</h1>
        <p className="text-xs text-zinc-500 mt-1">Scan member QR codes for automated check-in.</p>
      </div>

      <div className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-8 flex flex-col items-center">
        {!isScanning ? (
          <div className="text-center space-y-4">
            <div className="bg-zinc-950 p-6 rounded-full border border-zinc-800 inline-block">
              <QrCode className="w-16 h-16 text-emerald-500" />
            </div>
            <h2 className="text-xl font-bold text-zinc-100">Ready to Scan</h2>
            <p className="text-zinc-500 text-sm">Ask the member to open their KenzoFitness app and present the QR code.</p>
            <button
              onClick={() => setIsScanning(true)}
              className="mt-4 px-6 py-3 bg-emerald-500 text-emerald-950 font-black uppercase tracking-wider rounded-xl hover:bg-emerald-600 transition-colors"
            >
              Start Scanner
            </button>
          </div>
        ) : (
          <div className="w-full max-w-md mx-auto">
            <div id="reader" className="rounded-xl overflow-hidden border-2 border-emerald-500/50"></div>
            <button
              onClick={() => setIsScanning(false)}
              className="mt-6 w-full px-4 py-3 bg-zinc-800 text-zinc-300 font-bold rounded-xl hover:bg-zinc-700 transition-colors"
            >
              Cancel Scan
            </button>
          </div>
        )}

        {loading && (
          <div className="mt-8 flex flex-col items-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-800 border-t-emerald-500"></div>
            <p className="mt-4 text-zinc-400 font-semibold">Verifying booking...</p>
          </div>
        )}

        {scanResult && !loading && (
          <div className="mt-8 bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-xl flex items-center space-x-4 max-w-md w-full">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
            <div>
              <h3 className="font-bold text-emerald-400 text-lg">Success</h3>
              <p className="text-emerald-500/80 text-sm">{scanResult}</p>
            </div>
          </div>
        )}

        {scanError && !loading && (
          <div className="mt-8 bg-red-500/10 border border-red-500/20 p-6 rounded-xl flex items-center space-x-4 max-w-md w-full">
            <XCircle className="w-8 h-8 text-red-400" />
            <div>
              <h3 className="font-bold text-red-400 text-lg">Scan Failed</h3>
              <p className="text-red-500/80 text-sm">{scanError}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceptionDashboard;
