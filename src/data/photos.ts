import { supabase } from '../lib/supabase';

export interface PhotoItem {
  id: string;
  url: string;
  rotation?: number;
}

const rotations = [-2.5, 2.0, -1.8, 2.2, -2.0, 1.6, -1.5, 2.5, -1.2, 1.8];

// URLs base de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ksudmkaybgiqwxymwvgv.supabase.co';
const supabaseStorageBase = `${supabaseUrl}/storage/v1/object/public/fotitos`;

// Lista de fotos conocidas subidas a Supabase
export const KNOWN_SUPABASE_PHOTOS: string[] = [
  'WhatsApp Image 2026-08-14 at 21.06.04 (1).jpeg',
  'WhatsApp Image 2026-08-14 at 21.06.04 (2).jpeg',
  'WhatsApp Image 2026-08-14 at 21.06.04 (3).jpeg',
  'WhatsApp Image 2026-08-14 at 21.06.04 (4).jpeg',
  'WhatsApp Image 2026-08-14 at 21.06.04 (5).jpeg',
  'WhatsApp Image 2026-08-14 at 21.06.04 (6).jpeg',
  'WhatsApp Image 2026-08-14 at 21.06.04 (7).jpeg',
  'WhatsApp Image 2026-08-14 at 21.06.04 (8).jpeg',
  'WhatsApp Image 2026-08-15 at 01.45.30 (1).jpeg',
  'WhatsApp Image 2026-08-15 at 01.45.30 (2).jpeg',
  'WhatsApp Image 2026-08-15 at 01.45.30.jpeg',
  'WhatsApp Image 2026-08-15 at 01.45.31 (1).jpeg',
  'WhatsApp Image 2026-08-15 at 01.45.31 (2).jpeg',
  'WhatsApp Image 2026-08-15 at 01.45.31 (3).jpeg',
  'WhatsApp Image 2026-08-15 at 01.45.31.jpeg',
  'WhatsApp Image 2026-08-15 at 01.45.32.jpeg',
];

// Generar lista de respaldo directa desde Supabase CDN
export const FALLBACK_PHOTOS: PhotoItem[] = KNOWN_SUPABASE_PHOTOS.map((filename, index) => ({
  id: `supabase-photo-${index + 1}`,
  url: `${supabaseStorageBase}/${encodeURIComponent(filename)}`,
  rotation: rotations[index % rotations.length],
}));

export const INITIAL_PHOTOS: PhotoItem[] = FALLBACK_PHOTOS;

/**
 * Consulta dinámicamente las fotos almacenadas en el bucket 'fotitos' de Supabase Storage.
 * Si el listado dinámico está restringido por RLS en Supabase, utiliza automáticamente
 * las fotos de Supabase Storage conocidas.
 */
export async function fetchPhotosFromSupabase(bucketName = 'fotitos'): Promise<PhotoItem[]> {
  const client = supabase;
  if (!client) {
    return INITIAL_PHOTOS;
  }

  try {
    const { data, error } = await client.storage.from(bucketName).list('', {
      limit: 100,
      sortBy: { column: 'name', order: 'asc' },
    });

    if (error) {
      console.warn(`[Supabase Storage] Error al listar bucket '${bucketName}':`, error.message);
      return INITIAL_PHOTOS;
    }

    // Filtrar archivos válidos
    const imageFiles = (data || []).filter(
      (file) =>
        file.name &&
        !file.name.startsWith('.') &&
        file.name !== '.emptyFolderPlaceholder'
    );

    // Si Supabase devolvió archivos dinámicos, los usamos
    if (imageFiles.length > 0) {
      return imageFiles.map((file, index) => {
        const { data: urlData } = client.storage.from(bucketName).getPublicUrl(file.name);
        return {
          id: file.id || `supabase-photo-${index + 1}`,
          url: urlData.publicUrl,
          rotation: rotations[index % rotations.length],
        };
      });
    }

    // Si data vino vacío (común cuando RLS en Supabase bloquea listado anónimo),
    // devolvemos las fotos que ya existen en Supabase CDN
    return INITIAL_PHOTOS;
  } catch (err) {
    console.error('[Supabase Storage] Error inesperado:', err);
    return INITIAL_PHOTOS;
  }
}
