import { useState } from 'react';
import { useImportCSV } from '../../hooks/useMembers.js';

export default function CSVImportModal({ isOpen, onClose }) {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const importCSV = useImportCSV();

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setResult(null);
        }
    };

    const handleUpload = () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        importCSV.mutate(formData, {
            onSuccess: (data) => {
                setResult(data);
                setFile(null);
            },
            onError: (err) => {
                console.error(err);
                setResult({ error: err.response?.data?.error || 'Failed to upload CSV' });
            }
        });
    };

    const handleClose = () => {
        setFile(null);
        setResult(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Import Members via CSV</h2>
                    <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>

                <p className="text-sm text-gray-600 mb-6">
                    Upload a CSV file with the following column headers: <br />
                    <code className="bg-gray-100 px-1 rounded text-xs">Name, Email, Cohort, Graduation Year, Tracks, Roles, Companies, Titles, LinkedIn</code>
                </p>

                {!result ? (
                    <div className="space-y-4">
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
                        />
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={handleClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
                                Cancel
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={!file || importCSV.isPending}
                                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                {importCSV.isPending ? 'Uploading...' : 'Upload'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 text-center py-4">
                        {result.error ? (
                            <div className="text-red-600">{result.error}</div>
                        ) : (
                            <div>
                                <div className="text-green-600 font-medium mb-2">Import Successful!</div>
                                <div className="text-sm text-gray-600">
                                    Imported: <strong className="text-gray-900">{result.imported}</strong><br />
                                    Updated: <strong className="text-gray-900">{result.updated}</strong><br />
                                    Skipped: <strong className="text-gray-900">{result.skipped ?? 0}</strong>
                                </div>
                            </div>
                        )}
                        <button
                            onClick={handleClose}
                            className="mt-6 w-full px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                        >
                            Close
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
