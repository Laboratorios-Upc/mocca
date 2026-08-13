import React from 'react';
import { X, Sparkles, Palette, Zap } from 'lucide-react';
import type { FlowerInfo } from './Buquet';

interface FlowerCustomizerModalProps {
  flower: FlowerInfo | null;
  isOpen: boolean;
  onClose: () => void;
  currentColor: string;
  onColorChange: (flowerId: string, color: string) => void;
  onBloom: (flowerId: string) => void;
  onAddSparkles: () => void;
}

// Available color palettes per flower type
const COLOR_OPTIONS_MAP: Record<string, { label: string; value: string; colorHex: string }[]> = {
  Lirio: [
    { label: 'Rosado', value: 'pink', colorHex: '#FF69B4' },
    { label: 'Naranja', value: 'orange', colorHex: '#FF7F50' },
    { label: 'Blanco', value: 'white', colorHex: '#F5F5EC' },
    { label: 'Carmín', value: 'crimson', colorHex: '#E63946' },
  ],
  Hortensia: [
    { label: 'Azul', value: 'blue', colorHex: '#4A90E2' },
    { label: 'Morado', value: 'purple', colorHex: '#9F7AEA' },
    { label: 'Rosa', value: 'pink', colorHex: '#F687B3' },
    { label: 'Cian', value: 'cyan', colorHex: '#38B2AC' },
  ],
  Alcatraz: [
    { label: 'Blanco', value: 'white', colorHex: '#FFFFFF' },
    { label: 'Marfil', value: 'ivory', colorHex: '#FFFFF0' },
    { label: 'Rosado', value: 'blush', colorHex: '#FFF5F5' },
    { label: 'Dorado', value: 'golden', colorHex: '#FDD835' },
    { label: 'Carmesí', value: 'crimson', colorHex: '#C2185B' },
  ],
};

export const FlowerCustomizerModal: React.FC<FlowerCustomizerModalProps> = ({
  flower,
  isOpen,
  onClose,
  currentColor,
  onColorChange,
  onBloom,
  onAddSparkles,
}) => {
  if (!isOpen || !flower) return null;

  const colorOptions = COLOR_OPTIONS_MAP[flower.type] || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black-40 backdrop-blur-md animate-fade-in">
      <div className="bg-white-90 border border-white-60 shadow-2xl rounded-3xl max-w-sm w-full p-5 text-slate-800 relative overflow-hidden flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200-40 pb-3">
          <div className="flex items-center gap-2-5">
            <div className="w-9 h-9 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-600 shadow-sm">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <span className="text-10 font-bold uppercase tracking-wider text-pink-600">
                Personalizar Flor
              </span>
              <h3 className="text-lg font-bold font-serif leading-tight">{flower.name}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1-5 text-slate-400 hover:text-slate-700 rounded-full bg-slate-100-50 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Color Picker */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1-5">
            <Palette className="w-3-5 h-3-5 text-sky-500" /> Color de Pétalos:
          </label>
          <div className="grid grid-cols-4 gap-2">
            {colorOptions.map((opt) => {
              const isSelected = currentColor === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => onColorChange(flower.id, opt.value)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-sky-50 border-sky-400 ring-2 ring-sky-300 shadow-sm scale-105'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span
                    className="w-6 h-6 rounded-full border border-slate-300 shadow-inner"
                    style={{ backgroundColor: opt.colorHex }}
                  />
                  <span className="text-10 font-medium text-slate-700">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Bloom & Sparkles Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-200-40">
          <button
            onClick={() => {
              onBloom(flower.id);
            }}
            className="flex-1 flex items-center justify-center gap-1-5 py-2 px-3 rounded-2xl bg-gradient-pink-sky text-white font-semibold text-xs shadow-md hover:opacity-95 transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-current" /> ¡Hacer Florecer!
          </button>

          <button
            onClick={onAddSparkles}
            className="flex items-center justify-center gap-1-5 py-2 px-3 rounded-2xl bg-amber-500 text-white font-semibold text-xs shadow-md hover:bg-amber-600 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" /> Destello
          </button>
        </div>
      </div>
    </div>
  );
};
