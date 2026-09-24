import React, { useState } from 'react';
import { membersAPI } from '../../services/api';
import { PhotoAvatarSelector } from '../common/PhotoAvatarSelector';

export const MemberDetailsModal = ({ member, onClose, onRenewClick, onMemberUpdated }) => {
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [newPic, setNewPic] = useState(member?.profilePic || '');
  const [savingPhoto, setSavingPhoto] = useState(false);

  if (!member) return null;

  const handleSavePhoto = async () => {
    try {
      setSavingPhoto(true);
      const res = await membersAPI.update(member._id, { profilePic: newPic });
      setSavingPhoto(false);
      if (res.success && res.data) {
        member.profilePic = newPic;
        if (onMemberUpdated) onMemberUpdated(res.data);
        setIsEditingPhoto(false);
      }
    } catch (e) {
      setSavingPhoto(false);
    }
  };

  const initials = member.name
    ? member.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'M';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl text-slate-800">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="text-base font-black text-slate-900">Member Details</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 flex items-center space-x-4">
          {member.profilePic ? (
            <img
              src={member.profilePic}
              alt={member.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-400 shadow-md"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-teal-500 flex items-center justify-center text-white font-black text-xl shadow-md border-2 border-cyan-200">
              {initials}
            </div>
          )}

          <div className="flex-1">
            <h4 className="text-xl font-black text-slate-900">{member.name}</h4>
            <p className="text-xs text-cyan-600 font-semibold">{member.membershipPlan}</p>
            <div className="flex items-center space-x-2 mt-1">
              <span
                className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  member.status === 'Active'
                    ? 'bg-teal-50 text-teal-700 border border-teal-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {member.status}
              </span>
              <button
                type="button"
                onClick={() => {
                  setNewPic(member.profilePic || '');
                  setIsEditingPhoto((prev) => !prev);
                }}
                className="text-[11px] text-cyan-600 hover:text-cyan-700 font-bold underline"
              >
                {isEditingPhoto ? 'Cancel' : 'Change Photo'}
              </button>
            </div>
          </div>
        </div>

        {/* Change Photo Accordion */}
        {isEditingPhoto && (
          <div className="mt-4 p-4 rounded-2xl bg-cyan-50/50 border border-cyan-100 space-y-3">
            <PhotoAvatarSelector
              label="Select New Photo for Member"
              value={newPic}
              onChange={(p) => setNewPic(p)}
            />
            <button
              type="button"
              disabled={savingPhoto}
              onClick={handleSavePhoto}
              className="w-full py-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-xl font-bold text-xs shadow-sm shadow-cyan-500/20"
            >
              {savingPhoto ? 'Saving Photo...' : 'Save New Photo'}
            </button>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
          <div className="flex justify-between">
            <span className="text-slate-500">Mobile Number:</span>
            <span className="font-semibold text-slate-900">{member.mobileNo}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Gender:</span>
            <span>{member.gender || 'Not Specified'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Address:</span>
            <span className="text-right">{member.address || '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Joining Date:</span>
            <span>{member.joiningDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Next Billing / Expiry Date:</span>
            <span className="font-bold text-cyan-700">{member.nextBillDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Total Fee Paid:</span>
            <span className="font-black text-slate-900">₹{member.amountPaid}</span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex space-x-3">
          {onRenewClick && (
            <button
              onClick={() => {
                onClose();
                onRenewClick(member);
              }}
              className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white shadow-md shadow-cyan-500/20 transition-all text-center"
            >
              🔄 Renew Membership
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all text-center"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
