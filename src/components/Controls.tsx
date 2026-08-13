import React, { useState } from 'react';
import { Wind, Sun, Sparkles, Heart, SlidersHorizontal, ChevronUp, ChevronDown, X } from 'lucide-react';

interface ControlsProps {
  windSpeed: number;
  setWindSpeed: (speed: number) => void;
  ambientMode: 'day' | 'sunset' | 'night';
  setAmbientMode: (mode: 'day' | 'sunset' | 'night') => void;
  showParticles: boolean;
  setShowParticles: (val: boolean | ((prev: boolean) => boolean)) => void;
  onOpenDedicatoria: () => void;
  onTriggerConfetti: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  windSpeed,
  setWindSpeed,
  ambientMode,
  setAmbientMode,
  showParticles,
  setShowParticles,
  onOpenDedicatoria,
  onTriggerConfetti,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <>
      {/* --- DESKTOP VIEWPORT CONTROLS (SM+ SCREENS) --- */}
      <div className="hidden sm:flex fixed top-4 right-4 sm:top-6 sm:right-6 z-40 flex-col gap-2 items-end">
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className="flex items-center gap-1-5 px-3 py-1-5 rounded-full bg-white-40 backdrop-blur-md border border-white-50 shadow-md text-xs font-semibold text-slate-800 hover:bg-white-90 transition-all cursor-pointer"
          title="Ajustes del Buquet"
        >
          <SlidersHorizontal className="w-3-5 h-3-5 text-sky-500" />
          <span>{isExpanded ? 'Ocultar' : 'Ajustes'}</span>
          {isExpanded ? <ChevronUp className="w-3-5 h-3-5" /> : <ChevronDown className="w-3-5 h-3-5" />}
        </button>

        {isExpanded && (
          <div className="bg-white-40 backdrop-blur-md border border-white-50 shadow-xl rounded-2xl p-4 flex flex-col gap-4 text-slate-800 min-w-260 transition-all animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200-40 pb-2">
              <span className="font-medium text-xs tracking-wider uppercase text-emerald-800 flex items-center gap-1-5">
                <Sparkles className="w-3-5 h-3-5 text-amber-500 animate-pulse" /> Personalización
              </span>
              <button
                onClick={onOpenDedicatoria}
                className="p-1.5 rounded-xl bg-pink-100 text-pink-600 hover:bg-pink-200 transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
                title="Carta o Dedicatoria"
              >
                <Heart className="w-3-5 h-3-5 fill-current" /> Dedicatoria
              </button>
            </div>

            {/* Wind Speed Control */}
            <div className="flex flex-col gap-1-5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1-5">
                  <Wind className="w-3-5 h-3-5 text-sky-500" /> Brisa ({windSpeed === 0 ? 'Calma' : windSpeed < 1 ? 'Suave' : windSpeed < 1.8 ? 'Fresca' : 'Intensa'})
                </span>
                <span className="text-10 font-mono opacity-75">{windSpeed.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0"
                max="2.2"
                step="0.1"
                value={windSpeed}
                onChange={(e) => setWindSpeed(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Ambient Lighting Mode */}
            <div className="flex flex-col gap-1-5">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1-5">
                <Sun className="w-3-5 h-3-5 text-amber-500" /> Iluminación
              </span>
              <div className="grid grid-cols-3 gap-1-5 p-1 bg-slate-100-50 rounded-xl border border-slate-200-30">
                <button
                  onClick={() => setAmbientMode('day')}
                  className={`py-1 px-2 text-xs rounded-lg font-medium transition-all ${
                    ambientMode === 'day'
                      ? 'bg-white-90 text-sky-600 shadow-sm'
                      : 'text-slate-600'
                  }`}
                >
                  Día
                </button>
                <button
                  onClick={() => setAmbientMode('sunset')}
                  className={`py-1 px-2 text-xs rounded-lg font-medium transition-all ${
                    ambientMode === 'sunset'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'text-slate-600'
                  }`}
                >
                  Ocaso
                </button>
                <button
                  onClick={() => setAmbientMode('night')}
                  className={`py-1 px-2 text-xs rounded-lg font-medium transition-all ${
                    ambientMode === 'night'
                      ? 'bg-indigo-900 text-white shadow-sm'
                      : 'text-slate-600'
                  }`}
                >
                  Noche
                </button>
              </div>
            </div>

            {/* Action Toggles */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-200-40">
              <button
                onClick={() => setShowParticles((prev) => !prev)}
                className={`flex items-center gap-1-5 px-3 py-1-5 rounded-xl text-xs font-medium transition-all ${
                  showParticles
                    ? 'bg-emerald-500-20 text-emerald-800 border border-emerald-500-30'
                    : 'bg-slate-200-40 text-slate-600'
                }`}
              >
                <Sparkles className="w-3-5 h-3-5" /> Polen
              </button>

              <button
                onClick={onTriggerConfetti}
                className="flex items-center gap-1-5 px-3 py-1-5 rounded-xl text-xs font-medium bg-gradient-pink-sky text-white shadow-md hover:opacity-95 transition-all cursor-pointer"
              >
                Lluvia Pétalos
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- MOBILE FLOATING ACTION BAR & DRAWER (< SM SCREENS) --- */}
      <div className="sm:hidden fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-xs flex items-center justify-between gap-1 p-1-5 rounded-full bg-white-40 backdrop-blur-lg border border-white-60 shadow-xl text-slate-800">
        <button
          onClick={onTriggerConfetti}
          className="flex-1 flex items-center justify-center gap-1 py-2 px-2.5 rounded-full bg-gradient-pink-sky text-white text-xs font-semibold shadow-sm active:scale-95 transition-all cursor-pointer"
        >
          <Sparkles className="w-3-5 h-3-5" /> Pétalos
        </button>

        <button
          onClick={onOpenDedicatoria}
          className="flex-1 flex items-center justify-center gap-1 py-2 px-2.5 rounded-full bg-rose-500 text-white text-xs font-semibold shadow-sm active:scale-95 transition-all cursor-pointer"
        >
          <Heart className="w-3-5 h-3-5 fill-current" /> Carta
        </button>

        <button
          onClick={() => setIsExpanded(true)}
          className="p-2 rounded-full bg-white-80 text-slate-700 shadow-sm active:scale-95 transition-all cursor-pointer"
          title="Ajustes"
        >
          <SlidersHorizontal className="w-4 h-4 text-sky-600" />
        </button>
      </div>

      {/* Mobile Slide-up Bottom Drawer */}
      {isExpanded && (
        <div className="sm:hidden fixed inset-0 z-50 bg-black-40 backdrop-blur-sm flex items-end animate-fade-in">
          <div className="w-full bg-white-90 border-t border-white-60 shadow-2xl rounded-t-3xl p-5 flex flex-col gap-4 text-slate-800 animate-slide-up">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="font-bold text-sm text-slate-800 flex items-center gap-1-5">
                <SlidersHorizontal className="w-4 h-4 text-sky-500" /> Ajustes del Buquet
              </span>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-full bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Wind Control */}
            <div className="flex flex-col gap-1-5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1-5">
                  <Wind className="w-4 h-4 text-sky-500" /> Fuerza de Brisa
                </span>
                <span className="text-xs font-mono">{windSpeed.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0"
                max="2.2"
                step="0.1"
                value={windSpeed}
                onChange={(e) => setWindSpeed(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Lighting Mode */}
            <div className="flex flex-col gap-1-5">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1-5">
                <Sun className="w-4 h-4 text-amber-500" /> Iluminación del Ambiente
              </span>
              <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-2xl">
                <button
                  onClick={() => setAmbientMode('day')}
                  className={`py-2 text-xs rounded-xl font-semibold transition-all ${
                    ambientMode === 'day' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  Día ☀️
                </button>
                <button
                  onClick={() => setAmbientMode('sunset')}
                  className={`py-2 text-xs rounded-xl font-semibold transition-all ${
                    ambientMode === 'sunset' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600'
                  }`}
                >
                  Ocaso 🌅
                </button>
                <button
                  onClick={() => setAmbientMode('night')}
                  className={`py-2 text-xs rounded-xl font-semibold transition-all ${
                    ambientMode === 'night' ? 'bg-indigo-900 text-white shadow-sm' : 'text-slate-600'
                  }`}
                >
                  Noche 🌙
                </button>
              </div>
            </div>

            {/* Pollen Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1-5">
                <Sparkles className="w-4 h-4 text-amber-500" /> Partículas de Polen
              </span>
              <button
                onClick={() => setShowParticles((prev) => !prev)}
                className={`px-4 py-1-5 rounded-full text-xs font-semibold transition-all ${
                  showParticles
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {showParticles ? 'Activado' : 'Desactivado'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
