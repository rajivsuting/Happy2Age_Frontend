import React, { useState, useEffect } from "react";
import storageManager from "../utils/storage";
import authService from "../services/authService";

const StorageDebug = () => {
  const [storageStatus, setStorageStatus] = useState(null);
  const [authStatus, setAuthStatus] = useState(null);

  const refreshStatus = () => {
    setStorageStatus(storageManager.getStorageStatus());
    setAuthStatus(authService.getStorageStatus());
  };

  useEffect(() => {
    refreshStatus();
    // Refresh status every 5 seconds
    const interval = setInterval(refreshStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const clearStorage = () => {
    storageManager.clearAuth();
    refreshStatus();
  };

  if (!storageStatus) return <div>Loading storage status...</div>;

  return (
    <div className="p-4 bg-gray-100 rounded-lg m-4">
      <h3 className="text-lg font-semibold mb-4">Storage Debug Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Storage Availability */}
        <div className="bg-white p-4 rounded border">
          <h4 className="font-medium mb-2">Storage Availability</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>localStorage:</span>
              <span
                className={
                  storageStatus.localStorage ? "text-green-600" : "text-red-600"
                }
              >
                {storageStatus.localStorage
                  ? "✅ Available"
                  : "❌ Not Available"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>sessionStorage:</span>
              <span
                className={
                  storageStatus.sessionStorage
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {storageStatus.sessionStorage
                  ? "✅ Available"
                  : "❌ Not Available"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Cookies:</span>
              <span
                className={
                  storageStatus.cookies ? "text-green-600" : "text-red-600"
                }
              >
                {storageStatus.cookies ? "✅ Available" : "❌ Not Available"}
              </span>
            </div>
          </div>
        </div>

        {/* Authentication Status */}
        <div className="bg-white p-4 rounded border">
          <h4 className="font-medium mb-2">Authentication Status</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Authenticated:</span>
              <span
                className={
                  storageStatus.hasAuth ? "text-green-600" : "text-red-600"
                }
              >
                {storageStatus.hasAuth ? "✅ Yes" : "❌ No"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>User:</span>
              <span className="text-gray-600">
                {storageStatus.user
                  ? storageStatus.user.name || storageStatus.user.email
                  : "None"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tokens:</span>
              <span className="text-gray-600">
                {storageStatus.tokens ? "✅ Present" : "❌ Missing"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={refreshStatus}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh Status
        </button>
        <button
          onClick={clearStorage}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Clear Storage
        </button>
      </div>

      {/* Raw Data */}
      <details className="mt-4">
        <summary className="cursor-pointer font-medium">
          Raw Storage Data
        </summary>
        <pre className="mt-2 p-4 bg-gray-800 text-green-400 rounded text-sm overflow-auto">
          {JSON.stringify(storageStatus, null, 2)}
        </pre>
      </details>
    </div>
  );
};

export default StorageDebug;
