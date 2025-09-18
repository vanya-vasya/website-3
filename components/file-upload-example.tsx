/**
 * Correct FormData File Upload Example
 * Demonstrates proper FormData handling without manual Content-Type headers
 */
'use client';

import React, { useState } from 'react';

interface FileUploadExampleProps {
  toolId?: string;
  onResponse?: (data: any) => void;
}

export default function FileUploadExample({ toolId = 'master-chef', onResponse }: FileUploadExampleProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      alert('Please select a file');
      return;
    }

    setIsLoading(true);

    try {
      // Create FormData - CRITICAL: Do NOT set Content-Type header!
      const formData = new FormData();
      
      // Append file with field name "file" (matches N8N binaryPropertyName)
      formData.append('file', selectedFile);
      
      // Append metadata as JSON blob to stay in multipart format
      const metadata = { 
        toolId, 
        message: message || 'Analyze this file' 
      };
      formData.append('meta', new Blob([JSON.stringify(metadata)], { 
        type: 'application/json' 
      }), 'meta.json');

      console.log('Sending FormData:', { 
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        metadata 
      });

      // Fetch WITHOUT setting Content-Type header - browser handles boundary
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData, // Browser automatically sets multipart/form-data with boundary
        // DO NOT ADD: headers: { 'Content-Type': 'multipart/form-data' }
      });

      console.log('Response status:', response.status);

      // Handle response - use .text() first, then parse if not empty
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      // Parse JSON only if response is not empty
      const data = responseText ? JSON.parse(responseText) : null;
      
      if (response.ok) {
        console.log('Success:', data);
        onResponse?.(data);
      } else {
        console.error('Error response:', data);
        throw new Error(data?.error || `HTTP ${response.status}`);
      }

    } catch (error: any) {
      console.error('Upload failed:', error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">File Upload Example</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Message Input */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Message (optional)
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message or question about the file..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>

        {/* File Input */}
        <div>
          <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
            Choose File
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            accept="image/*,.pdf,.doc,.docx,.txt"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {selectedFile && (
            <p className="mt-2 text-sm text-gray-600">
              Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !selectedFile}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          {isLoading ? 'Uploading...' : 'Upload & Analyze'}
        </button>
      </form>

      {/* Tips */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <h3 className="text-sm font-medium text-yellow-800 mb-2">Important Tips:</h3>
        <ul className="text-xs text-yellow-700 space-y-1">
          <li>• Do NOT set Content-Type header when using FormData</li>
          <li>• Browser automatically adds multipart boundary</li>
          <li>• Use field name "file" for N8N compatibility</li>
          <li>• Handle empty responses with .text() before .json()</li>
          <li>• Safari requires proper FormData handling</li>
        </ul>
      </div>
    </div>
  );
}

// Alternative hook-based approach
export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (file: File, metadata: any = {}) => {
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('meta', new Blob([JSON.stringify(metadata)], { 
        type: 'application/json' 
      }), 'meta.json');

      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
        // No Content-Type header!
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : null;

      if (!response.ok) {
        throw new Error(data?.error || `HTTP ${response.status}`);
      }

      return data;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFile, isUploading };
}
