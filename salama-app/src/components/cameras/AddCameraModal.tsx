'use client';

import React, { useState } from 'react';
import { createCamera } from '@/lib/api';

interface AddCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCameraAdded?: () => void;
}

export default function AddCameraModal({ 
  isOpen, 
  onClose, 
  onCameraAdded 
}: AddCameraModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    rtspUrl: '',
    systemPrompt: '', // New field for Camera System Prompt
    resolution: '1080p',
    frameRate: '30',
    detectionZones: {
      platformEdge: false,
      trackArea: false,
      waitingArea: false
    },
    alertSensitivity: 'medium',
    alertRecipients: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const cameraData = {
        name: formData.name,
        location: formData.location,
        rtsp_url: formData.rtspUrl,
        system_prompt: formData.systemPrompt, // Include system prompt in camera data
      };

      await createCamera(cameraData);
      
      if (onCameraAdded) {
        onCameraAdded();
      }
      
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add camera');
      console.error('Camera creation error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      ...(typeof value === 'boolean' 
        ? { detectionZones: { ...prev.detectionZones, [field]: value } }
        : { [field]: value })
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gray-900 bg-opacity-90 rounded-xl border border-gray-700 shadow-2xl p-6 w-full max-w-2xl mx-4 backdrop-blur-lg">
      <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white">Add New Camera</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-300"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {error && (
          <div className="bg-red-600 text-white p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Camera Name</label>
                <input 
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                  placeholder="Platform A Camera"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                <input 
                  type="text"
                  value={formData.location}
                  onChange={(e) => updateFormData('location', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                  placeholder="Platform A"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">RTSP Stream URL</label>
              <input 
                type="url"
                value={formData.rtspUrl}
                onChange={(e) => updateFormData('rtspUrl', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                placeholder="rtsp://camera-ip:554/stream1"
                required
              />
            </div>
          </div>


          {/* Camera System Prompt Section */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-300">Camera System Prompt</h4>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                AI Instruction Prompt
              </label>
              <textarea 
                value={formData.systemPrompt}
                onChange={(e) => updateFormData('systemPrompt', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                placeholder="Provide instructions for the AI on how to handle detections (e.g., 'If a person is detected after hours, send an alert to security.')"
                rows={4}
              />
            </div>
          </div>

          {/* Alert Settings */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-300">Alert Settings</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Alert Sensitivity</label>
                <select 
                  value={formData.alertSensitivity}
                  onChange={(e) => updateFormData('alertSensitivity', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Alert Recipients</label>
                <input 
                  type="email"
                  value={formData.alertRecipients}
                  onChange={(e) => updateFormData('alertRecipients', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                  placeholder="email@example.com"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Camera'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
