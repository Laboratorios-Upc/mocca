import React, { useState } from 'react';
import { X, Heart, Sparkles, Send } from 'lucide-react';

interface DedicatoriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  onSaveMessage: (newMessage: string) => void;
}

const PRESET_MESSAGES = [
  'Un detalle especial con todo mi cariño 🌸✨',
  'Que tengas un día tan hermoso como estas flores 💕',
  'Flores que nunca se marchitan para ti 💖',
  'Con un abrazo enorme y todo mi amor 🌷',
];

export const DedicatoriaModal: React.FC<DedicatoriaModalProps> = ({
  isOpen,
  onClose,
  message,
  onSaveMessage,
}) => {
  const [customText, setCustomText] = useState<string>(message);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveMessage(customText);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black-40 backdrop-blur-md animate-fade-in">
      <div className="bg-white-90 border border-white-60 shadow-2xl rounded-3xl max-w-sm w-full p-5 text-slate-800 relative overflow-hidden flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200-40 pb-3">
          <div className="flex items-center gap-2-5">
            <div className="w-9 h-9 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-500 shadow-sm">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="text-10 font-bold uppercase tracking-wider text-rose-500">
                Tarjeta de Regalo
              </span>
              <h3 className="text-lg font-bold font-serif leading-tight">Dedicatoria Especial</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1-5 text-slate-400 hover:text-slate-700 rounded-full bg-slate-100-50 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Note Content Area */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1-5">
            <Sparkles className="w-3-5 h-3-5 text-amber-500" /> Tu Mensaje Personal:
          </label>
          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Escribe un mensaje para acompañar este buquet..."
            rows={3}
            className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none font-serif italic"
          />
        </div>

        {/* Quick Presets */}
        <div className="flex flex-col gap-1-5">
          <span className="text-10 font-bold text-slate-500 uppercase tracking-wider">
            Sugerencias Rápidas:
          </span>
          <div className="flex flex-col gap-1.5">
            {PRESET_MESSAGES.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => setCustomText(preset)}
                className="text-left text-xs p-2 rounded-xl bg-white border border-slate-200 hover:border-pink-300 hover:bg-pink-50-60 transition-all text-slate-700 font-serif italic cursor-pointer"
              >
                "{preset}"
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleSave}
          className="w-full mt-1 flex items-center justify-center gap-2 py-2-5 px-4 rounded-2xl bg-gradient-pink-sky text-white font-semibold text-xs shadow-md hover:opacity-95 transition-all cursor-pointer"
        >
          <Send className="w-4 h-4" /> Guardar Dedicatoria
        </button>
      </div>
    </div>
  );
};
