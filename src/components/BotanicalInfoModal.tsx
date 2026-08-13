import React from 'react';
import { X, Flower2, CheckCircle2, Sparkles } from 'lucide-react';
import type { FlowerInfo } from './Buquet';

interface BotanicalInfoModalProps {
  flower: FlowerInfo | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BotanicalInfoModal: React.FC<BotanicalInfoModalProps> = ({
  flower,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black-40 backdrop-blur-md animate-fade-in">
      <div className="bg-white-90 border border-white-60 shadow-2xl rounded-3xl max-w-md w-full p-6 text-slate-800 relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full bg-slate-100-50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {flower ? (
          <div className="flex flex-col gap-4">
            {/* Flower Badge Header */}
            <div className="flex items-center gap-3">
              <div className="p-3 bg-pink-100 text-pink-600 rounded-2xl">
                <Flower2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-pink-600">
                  {flower.type} Botánico
                </span>
                <h3 className="text-xl font-bold font-serif">{flower.name}</h3>
                <p className="text-xs italic text-slate-500">
                  {flower.scientificName}
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed text-slate-600 bg-slate-50 p-3-5 rounded-2xl border border-slate-100">
              {flower.description}
            </p>

            {/* Botanical Precision Checklist */}
            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1-5">
                <Sparkles className="w-3-5 h-3-5 text-amber-500" /> Anatomía Fiel:
              </h4>
              <ul className="flex flex-col gap-1-5">
                {flower.details.map((detail, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-xs text-slate-600"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0-5" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-sky-100 text-sky-600 rounded-2xl">
                <Flower2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-serif">Guía Botánica del Buquet</h3>
                <p className="text-xs text-slate-500">
                  Estructura Fiel &amp; Composición
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 text-xs text-slate-600">
              <div className="p-3 bg-pink-50-60 rounded-2xl border border-pink-100">
                <strong className="text-pink-700 font-semibold block mb-1">
                  1. Lirios (Lilium):
                </strong>
                6 tépalos con puntas curvadas hacia atrás, 6 estambres con anteras polinizadas, pistilo central y hojas angostas de venación paralela.
              </div>

              <div className="p-3 bg-blue-50-60 rounded-2xl border border-blue-100">
                <strong className="text-blue-700 font-semibold block mb-1">
                  2. Hortensias (Hydrangea):
                </strong>
                Racimo abovedado formado por decenas de florecillas diminutas de 4 pétalos con textura de papel y variaciones de tono por pH.
              </div>

              <div className="p-3 bg-amber-50-60 rounded-2xl border border-amber-100">
                <strong className="text-amber-700 font-semibold block mb-1">
                  3. Alcatraces (Zantedeschia):
                </strong>
                Espata única suavemente curvada hacia afuera en marfil/blanco que envuelve un espádice central amarillo en forma de vara.
              </div>

              <div className="p-3 bg-purple-50-60 rounded-2xl border border-purple-100">
                <strong className="text-purple-700 font-semibold block mb-1">
                  4. Envoltura Tornasol &amp; Listón Celeste:
                </strong>
                Papel celofán/crepé con gradiente animado en constante movimiento de luz y listón celeste en onda senoidal continua.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
