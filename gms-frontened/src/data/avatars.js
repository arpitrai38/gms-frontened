// Curated Fitness Avatars for Gym Owners, Trainers & Members
export const PRESET_AVATARS = [
  { id: 'm1', label: 'Athlete Male 1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { id: 'm2', label: 'Fitness Male 2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { id: 'm3', label: 'Bodybuilder Male', url: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&auto=format&fit=crop&q=80' },
  { id: 'm4', label: 'Trainer Male', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
  { id: 'f1', label: 'Fitness Female 1', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' },
  { id: 'f2', label: 'Athlete Female 2', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
  { id: 'f3', label: 'CrossFit Female', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
  { id: 'f4', label: 'Coach Female', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
  { id: 'g1', label: 'Power Gym Icon', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=gympower&backgroundColor=06b6d4' },
  { id: 'g2', label: 'Fitness Beast', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=ironpulse&backgroundColor=14b8a6' }
];

// Helper to resize and compress uploaded images via Canvas to keep base64 tiny (<40KB)
export const compressImage = (file, maxWidth = 300, maxHeight = 300, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve('');
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};
