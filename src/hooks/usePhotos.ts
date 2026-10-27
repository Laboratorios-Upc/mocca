import { useEffect, useState } from 'react';
import { fetchPhotosFromSupabase, type PhotoItem } from '../data/photos';

/**
 * Una sola petición compartida para toda la app: si el contador de la barra y
 * el carrusel piden las fotos a la vez, ambos esperan la misma promesa en
 * lugar de salir a Supabase por separado.
 */
let photosPromise: Promise<PhotoItem[]> | null = null;

function cargarFotos(): Promise<PhotoItem[]> {
  if (!photosPromise) {
    photosPromise = fetchPhotosFromSupabase().catch((err) => {
      // Si falla, dejamos que el próximo intento vuelva a pedirlas.
      photosPromise = null;
      throw err;
    });
  }
  return photosPromise;
}

export type PhotosStatus = 'loading' | 'ready' | 'error';

export interface PhotosState {
  photos: PhotoItem[];
  status: PhotosStatus;
}

/**
 * Las fotos reales del bucket de Supabase.
 *
 * Arranca vacío a propósito: antes la barra mostraba el largo de la lista de
 * respaldo hardcodeada, así que anunciaba un número que no era el verdadero.
 * Mejor no decir nada hasta saberlo.
 */
export function usePhotos(): PhotosState {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [status, setStatus] = useState<PhotosStatus>('loading');

  useEffect(() => {
    let isMounted = true;

    cargarFotos()
      .then((lista) => {
        if (!isMounted) return;
        setPhotos(lista);
        setStatus('ready');
      })
      .catch(() => {
        if (!isMounted) return;
        setStatus('error');
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { photos, status };
}
