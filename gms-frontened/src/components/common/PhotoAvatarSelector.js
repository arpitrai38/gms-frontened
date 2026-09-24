import React, { useState, useRef } from 'react';
import { PRESET_AVATARS, compressImage } from '../../data/avatars';

export const PhotoAvatarSelector = ({ value, onChange, label = 'Profile Photo' }) => {
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit before processing (e.g. 10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert('Selected file is too large. Please select an image under 10MB.');
      return;
    }

    try {
      setIsCompressing(true);
      const compressedDataUrl = await compressImage(file, 280, 280, 0.85);
      onChange(compressedDataUrl);
      setShowAvatarPicker(false);
    } catch (err) {
      console.error('Error reading image:', err);
      alert('Could not read image. Please try another file.');
    } finally {
      setIsCompressing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSelectPreset = (url) => {
    onChange(url);
    setShowAvatarPicker(false);
  };

  const handleRemove = () => {
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block font-semibold text-slate-700 text-xs">{label}</label>
        {value && (
          <button
            type="button"
            onClick={handleRemove}
            className="text-[11px] text-rose-500 hover:text-rose-600 font-semibold"
          >
            ✕ Remove Photo
          </button>
        )}
      </div>

      <div className="flex items-center space-x-3 p-3 bg-slate-50/80 rounded-2xl border border-slate-200/80">
        {/* Preview Circle */}
        <div className="relative">
          {value ? (
            <img
              src={value}
              alt="Preview"
              className="w-14 h-14 rounded-2xl object-cover border-2 border-cyan-500 shadow-sm"
            />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-white border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
              <span className="text-xl">👤</span>
              <span className="text-[8px] font-bold text-slate-400 mt-0.5">No Photo</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex-1 space-y-1.5">
          <div className="flex flex-wrap gap-2">
            {/* Hidden native file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            <button
              type="button"
              disabled={isCompressing}
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-cyan-50 text-cyan-700 border border-cyan-200 text-xs font-bold shadow-xs transition-all flex items-center space-x-1.5"
            >
              <span>📁</span>
              <span>{isCompressing ? 'Uploading...' : 'Upload Photo'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAvatarPicker((prev) => !prev)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center space-x-1.5 ${
                showAvatarPicker
                  ? 'bg-cyan-500 text-white border-cyan-500'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <span>🎭</span>
              <span>{showAvatarPicker ? 'Hide Avatars' : 'Choose Avatar'}</span>
            </button>
          </div>
          <p className="text-[10px] text-slate-400">
            {value ? 'Photo selected. You can replace or remove it anytime.' : 'Optional: Upload from device or choose an avatar manually.'}
          </p>
        </div>
      </div>

      {/* Expandable Avatar Grid (Only shows when user clicks 'Choose Avatar', never auto-selects) */}
      {showAvatarPicker && (
        <div className="p-3 bg-white rounded-2xl border border-cyan-100 shadow-lg space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
            <span className="text-[11px] font-bold text-slate-600">Select an Avatar of your choice:</span>
            <span className="text-[10px] text-slate-400">(Click to apply)</span>
          </div>

          <div className="grid grid-cols-5 gap-2 pt-1">
            {PRESET_AVATARS.map((av) => (
              <button
                key={av.id}
                type="button"
                onClick={() => handleSelectPreset(av.url)}
                className={`p-1 rounded-xl transition-all flex flex-col items-center hover:scale-105 ${
                  value === av.url
                    ? 'ring-2 ring-cyan-500 bg-cyan-50'
                    : 'hover:bg-slate-50 border border-slate-100'
                }`}
                title={av.label}
              >
                <img src={av.url} alt={av.label} className="w-10 h-10 rounded-lg object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
