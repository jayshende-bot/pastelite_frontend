import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPaste } from '../api/axios';
import NotFoundPage from './NotFoundPage';

const PasteViewPage = () => {
  const { id } = useParams();
  const [paste, setPaste] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaste = async () => {
      try {
        setLoading(true);
        const data = await getPaste(id);
        setPaste(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPaste();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-xl">Loading paste...</div>
      </div>
    );
  }

  if (error || !paste) {
    // Specifically render the NotFoundPage component for 404 errors
    if (error?.response?.status === 404) {
      return <NotFoundPage />;
    }
    // For other errors, you might want a different display
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-800">
        <h1 className="text-4xl font-bold text-red-500">Error</h1>
        <p className="mt-4 text-lg">Could not retrieve the paste.</p>
        <p className="text-md">{error?.response?.data?.message || error?.message || 'An unexpected error occurred.'}</p>
      </div>
    );
  }

  const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleString();
  };


  return (
    <div className="bg-gray-900 min-h-screen py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-700">
            <h1 className="text-2xl font-bold text-blue-400">Paste Content</h1>
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 text-sm text-gray-400">
              {paste.remaining_views !== null && (
                <p>
                  <strong>Remaining Views:</strong> {paste.remaining_views}
                </p>
              )}
              {paste.expires_at && (
                <p>
                  <strong>Expires At:</strong> {formatDateTime(paste.expires_at)}
                </p>
              )}
            </div>
          </div>
          <div className="p-4 sm:p-6">
            <pre className="text-gray-200 whitespace-pre-wrap break-words bg-gray-900 p-4 rounded-md">
              <code>{paste.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasteViewPage;
