export interface PhotoItem {
  id: string;
  url: string;
  rotation?: number;
}

// Auto-detect any photos placed in public/assets/photos dynamically with Vite glob
const autoDetectedModules = import.meta.glob(
  '/public/assets/photos/*.{jpg,jpeg,png,webp,gif,svg,JPG,JPEG,PNG,WEBP,GIF}',
  { eager: true, query: '?url', import: 'default' }
);

const rotations = [-2.5, 2.0, -1.8, 2.2, -2.0, 1.6, -1.5, 2.5, -1.2, 1.8];

const detectedPhotos: PhotoItem[] = Object.keys(autoDetectedModules).map((filePath, index) => {
  // Convert /public/assets/photos/... to /assets/photos/... for browser serving
  const webUrl = filePath.replace(/^\/public/, '');
  return {
    id: `photo-${index + 1}`,
    url: webUrl,
    rotation: rotations[index % rotations.length],
  };
});

// Fallback list in case glob is empty
export const FALLBACK_PHOTOS: PhotoItem[] = [
  { id: 'photo-1', url: '/assets/photos/WhatsApp Image 2026-08-14 at 21.06.04.jpeg', rotation: -2.5 },
  { id: 'photo-2', url: '/assets/photos/WhatsApp Image 2026-08-14 at 21.06.04 (1).jpeg', rotation: 2.0 },
  { id: 'photo-3', url: '/assets/photos/WhatsApp Image 2026-08-14 at 21.06.04 (2).jpeg', rotation: -1.8 },
  { id: 'photo-4', url: '/assets/photos/WhatsApp Image 2026-08-14 at 21.06.04 (3).jpeg', rotation: 2.2 },
  { id: 'photo-5', url: '/assets/photos/WhatsApp Image 2026-08-14 at 21.06.04 (4).jpeg', rotation: -2.0 },
  { id: 'photo-6', url: '/assets/photos/WhatsApp Image 2026-08-14 at 21.06.04 (5).jpeg', rotation: 1.6 },
  { id: 'photo-7', url: '/assets/photos/WhatsApp Image 2026-08-14 at 21.06.04 (6).jpeg', rotation: -1.5 },
  { id: 'photo-8', url: '/assets/photos/WhatsApp Image 2026-08-14 at 21.06.04 (7).jpeg', rotation: 2.5 },
];

export const INITIAL_PHOTOS: PhotoItem[] =
  detectedPhotos.length > 0 ? detectedPhotos : FALLBACK_PHOTOS;
