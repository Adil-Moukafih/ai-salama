'use client';

import { useState } from 'react';

interface AddCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddCameraModal({ isOpen, onClose }: AddCameraModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    type: 'ip',
    description: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here we would normally handle the form submission
    // For prototype, just close the modal
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg p-6 w-full max-w-md border border-app">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-app-primary">Add New Camera</h2>
          <button 
            onClick={onClose}
            className="text-app-secondary hover:text-app-primary"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-app-secondary mb-1">Camera Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-hover text-app-primary rounded border border-app focus:outline-none focus:border-[rgb(var(--color-primary))]"
              placeholder="Enter camera name"
            />
          </div>

          <div>
            <label className="block text-sm text-app-secondary mb-1">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 bg-hover text-app-primary rounded border border-app focus:outline-none focus:border-[rgb(var(--color-primary))]"
              placeholder="Enter camera location"
            />
          </div>

          <div>
            <label className="block text-sm text-app-secondary mb-1">Camera Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 bg-hover text-app-primary rounded border border-app focus:outline-none focus:border-[rgb(var(--color-primary))]"
            >
              <option value="ip">IP Camera</option>
              <option value="ptz">PTZ Camera</option>
              <option value="dome">Dome Camera</option>
              <option value="bullet">Bullet Camera</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-app-secondary mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-hover text-app-primary rounded border border-app focus:outline-none focus:border-[rgb(var(--color-primary))] resize-none"
              rows={3}
              placeholder="Enter camera description"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-hover text-app-secondary rounded hover:bg-opacity-90 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[rgb(var(--color-primary))] text-white rounded hover:bg-opacity-90 transition-colors"
            >
              Add Camera
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
