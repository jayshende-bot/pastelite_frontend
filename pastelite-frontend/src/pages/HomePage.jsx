import React, { useState } from 'react';
import { createPaste } from '../api/axios';

const HomePage = () => {
  const [content, setContent] = useState('');
  const [ttlSeconds, setTtlSeconds] = useState('');
  const [maxViews, setMaxViews] = useState('');

  const [error, setError] = useState('');
  const [clientError, setClientError] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  const [copySuccessMessage, setCopySuccessMessage] = useState('');

  const handleReset = () => {
    setContent('');
    setTtlSeconds('');
    setMaxViews('');
    setError('');
    setClientError('');
    setResult(null);
    setIsOffline(false);
    setCopySuccessMessage('');
  };

  const handleCopyToClipboard = async () => {
    if (!result?.url) return;
    try {
      await navigator.clipboard.writeText(result.url);
      setCopySuccessMessage('URL copied to clipboard!');
    } catch (err) {
      console.error('Could not copy text: ', err);
      setCopySuccessMessage('Error: Could not copy URL to clipboard.');
    }
  };

  const validate = () => {
    if (!content.trim()) {
      return 'Content cannot be empty.';
    }
    if (ttlSeconds && (!Number.isInteger(Number(ttlSeconds)) || Number(ttlSeconds) < 1)) {
      return 'Time-to-live must be an integer of 1 or greater.';
    }
    if (maxViews && (!Number.isInteger(Number(maxViews)) || Number(maxViews) < 1)) {
      return 'Max views must be an integer of 1 or greater.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setClientError(validationError);
      return;
    }

    setLoading(true);
    setError('');
    setClientError('');
    setResult(null);
    setIsOffline(false);
    setCopySuccessMessage('');

    const pasteData = { content };
    if (ttlSeconds) {
      pasteData.ttl_seconds = Number(ttlSeconds);
    }
    if (maxViews) {
      pasteData.max_views = Number(maxViews);
    }

    try {
      const data = await createPaste(pasteData);
      setResult(data);
      try {
        // Automatically copy to clipboard
        await navigator.clipboard.writeText(data.url);
        setCopySuccessMessage('Success! The shareable URL has been copied to your clipboard.');
      } catch (copyError) {
        console.error('Failed to auto-copy URL, but here it is:', data.url);
        setCopySuccessMessage('Success! Paste created. You can copy the URL manually below.');
      }
    } catch (err) {
      // This block is structured to safely handle all categories of Axios errors.
      if (err.response) {
        // Case 1: The server responded with a status code outside the 2xx range (e.g., 400, 500).
        const message = err.response.data?.message || `Server error: ${err.response.status}`;
        setError(message);
        console.error('Server Error:', err.response.status, message, err.response);
      } else if (err.request) {
        // Case 2: The request was made, but no response was received.
        // This is the key state for detecting when the backend is down or unreachable (e.g., net::ERR_CONNECTION_REFUSED).
        const message = 'Connection Error: Could not connect to the server. Please ensure the backend is running and accessible.';
        setError(message);
        setIsOffline(true);
        console.error('Network Error:', message, err);
      } else {
        // Case 3: A different error occurred during the request setup, or the promise
        // was rejected with a non-error or falsy value.
        const message = err?.message || 'An unexpected error occurred.';
        setError(message);
        console.error('Unexpected Error:', message, err);
      }
    } finally {
      setLoading(false);
    }
  };

  // A small sub-component to centralize and simplify error message rendering.
  const ErrorDisplay = () => {
    if (isOffline) {
      return (
        <div className="p-4 my-2 text-sm text-yellow-200 bg-yellow-900 bg-opacity-70 rounded-lg border border-yellow-700" role="alert">
          <p className="font-bold">Backend Unreachable</p>
          <p>Could not connect to the server. Please ensure your backend is running on the correct port (5000) and is accessible.</p>
        </div>
      );
    }
    if (clientError) {
      return <p className="text-sm text-yellow-400">{clientError}</p>;
    }
    // Display server errors or other unexpected errors.
    if (error) {
      return <p className="text-sm text-red-400">{error}</p>;
    }
    return null;
  };


  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="w-full max-w-2xl p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-blue-400">Create a New Paste</h1>

        {result ? (
          <div className="p-4 bg-gray-700 rounded-md text-center">
            <h2 className="text-xl font-semibold text-green-400">Paste Created!</h2>
            {copySuccessMessage && <p className="mt-2 text-green-400">{copySuccessMessage}</p>}
            <p className="mt-2">Share this URL:</p>
            <div className="flex items-center justify-center mt-2 space-x-2">
              <input
                type="text"
                value={result.url}
                readOnly
                className="w-full px-3 py-2 text-gray-200 bg-gray-900 border border-gray-600 rounded-md focus:outline-none"
              />
              <button
                onClick={handleCopyToClipboard}
                className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Copy
              </button>
            </div>
            <button
              onClick={handleReset}
              className="mt-4 px-4 py-2 font-semibold text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none"
            >
              Create Another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-400 mb-2">
                Paste Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-64 px-3 py-2 text-gray-200 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="ttl_seconds" className="block text-sm font-medium text-gray-400 mb-2">
                  Time-to-Live (in seconds, optional)
                </label>
                <input
                  id="ttl_seconds"
                  type="number"
                  value={ttlSeconds}
                  onChange={(e) => setTtlSeconds(e.target.value)}
                  min="1"
                  step="1"
                  className="w-full px-3 py-2 text-gray-200 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 3600 for 1 hour"
                />
              </div>
              <div>
                <label htmlFor="max_views" className="block text-sm font-medium text-gray-400 mb-2">
                  Max Views (optional)
                </label>
                <input
                  id="max_views"
                  type="number"
                  value={maxViews}
                  onChange={(e) => setMaxViews(e.target.value)}
                  min="1"
                  step="1"
                  className="w-full px-3 py-2 text-gray-200 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 5"
                />
              </div>
            </div>

            <ErrorDisplay />

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Paste...' : 'Create Paste'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default HomePage;
