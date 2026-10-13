import React from 'react';
import { InventoryItem } from '../types/inventory';
import { 
  Boxes, 
  Cpu, 
  Activity, 
  Bone, 
  Sparkles, 
  AlertTriangle, 
  Package
} from 'lucide-react';
import { getStockHealth } from '../utils/inventoryUtils';

interface InventoryStatsProps {
  items: InventoryItem[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  soloSets: boolean;
  onToggleSoloSets: () => void;
  onFilterCritical: () => void;
}

export const InventoryStats: React.FC<InventoryStatsProps> = ({
  items,
  selectedCategory,
  onSelectCategory,
  soloSets,
  onToggleSoloSets,
  onFilterCritical
}) => {
  // Sets breakdown
  const setsItems = items.filter(i => i.esSet);
  const totalSetsCount = setsItems.length;
  const totalPiecesInSets = setsItems.reduce((acc, i) => {
    const piecesCount = i.piezas ? i.piezas.reduce((pAcc, p) => pAcc + (p.cantidad || 1), 0) : (i.totalPiezas || 0);
    return acc + piecesCount;
  }, 0);

  // Categories
  const totalEquipos = items.filter(i => i.primaryCategory === 'equipos_medicos').length;
  const totalArtroscopia = items.filter(i => i.instrumentalCategory === 'artroscopia').length;
  const totalArtHombro = items.filter(i => i.instrumentalCategory === 'artroscopia' && i.artroscopiaSubcategory === 'hombro').length;
  const totalArtRodilla = items.filter(i => i.instrumentalCategory === 'artroscopia' && i.artroscopiaSubcategory === 'rodilla').length;
  const totalOsteosintesis = items.filter(i => i.instrumentalCategory === 'osteosintesis').length;
  const totalReemplazo = items.filter(i => i.instrumentalCategory === 'reemplazo_articular').length;
  const totalCadera = items.filter(i => i.reemplazoSubcategory === 'cadera').length;
  const totalRodilla = items.filter(i => i.reemplazoSubcategory === 'rodilla').length;

  const criticalCount = items.filter(i => getStockHealth(i) === 'critico').length;
  const inConsignmentCount = items.filter(i => i.estado === 'en_consignacion').length;
  const totalUnidades = items.reduce((acc, i) => acc + i.stockActual, 0);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      
      {/* 1. Sets Quirúrgicos (PRIMARY FOCUS) */}
      <div 
        onClick={onToggleSoloSets}
        className={`bg-white rounded-xl p-3.5 border transition-all cursor-pointer shadow-xs hover:border-teal-500 ${
          soloSets 
            ? 'ring-2 ring-teal-500 border-teal-500 bg-teal-50/30' 
            : 'border-slate-200 hover:bg-slate-50/50'
        }`}
      >
        <div className="flex items-center justify-between text-teal-700 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Sets Quirúrgicos</span>
          <div className="w-6 h-6 rounded-md bg-teal-100 flex items-center justify-center text-teal-700">
            <Package className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="text-2xl font-black text-slate-900 font-mono tabular-nums">{totalSetsCount}</span>
          <span className="text-[11px] text-slate-500 font-medium">cajas</span>
        </div>
        <div className="text-[11px] text-teal-700 font-semibold mt-0.5 truncate">
          {totalPiecesInSets} piezas desglosadas
        </div>
      </div>

      {/* 2. Artroscopia */}
      <div 
        onClick={() => onSelectCategory('artroscopia')}
        className={`bg-white rounded-xl p-3.5 border transition-all cursor-pointer shadow-xs hover:border-teal-500 ${
          selectedCategory === 'artroscopia' || selectedCategory === 'art_hombro' || selectedCategory === 'art_rodilla'
            ? 'ring-2 ring-teal-500 border-teal-500 bg-teal-50/30' 
            : 'border-slate-200 hover:bg-slate-50/50'
        }`}
      >
        <div className="flex items-center justify-between text-teal-700 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Artroscopia</span>
          <div className="w-6 h-6 rounded-md bg-teal-100 flex items-center justify-center text-teal-700">
            <Activity className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="text-2xl font-black text-slate-900 font-mono tabular-nums">{totalArtroscopia}</span>
          <span className="text-[11px] text-slate-500 font-medium">referencias</span>
        </div>
        <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
          Hombro: {totalArtHombro} · Rodilla: {totalArtRodilla}
        </div>
      </div>

      {/* 3. Osteosíntesis */}
      <div 
        onClick={() => onSelectCategory('osteosintesis')}
        className={`bg-white rounded-xl p-3.5 border transition-all cursor-pointer shadow-xs hover:border-amber-500 ${
          selectedCategory === 'osteosintesis' 
            ? 'ring-2 ring-amber-500 border-amber-500 bg-amber-50/30' 
            : 'border-slate-200 hover:bg-slate-50/50'
        }`}
      >
        <div className="flex items-center justify-between text-amber-700 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Osteosíntesis</span>
          <div className="w-6 h-6 rounded-md bg-amber-100 flex items-center justify-center text-amber-700">
            <Bone className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="text-2xl font-black text-slate-900 font-mono tabular-nums">{totalOsteosintesis}</span>
          <span className="text-[11px] text-slate-500 font-medium">ítems</span>
        </div>
        <div className="text-[11px] text-amber-800 font-medium mt-0.5 truncate">
          Placas LCP y clavos
        </div>
      </div>

      {/* 4. Reemplazo Articular */}
      <div 
        onClick={() => onSelectCategory('reemplazo_articular')}
        className={`bg-white rounded-xl p-3.5 border transition-all cursor-pointer shadow-xs hover:border-emerald-500 ${
          selectedCategory === 'reemplazo_articular' || selectedCategory === 'cadera' || selectedCategory === 'rodilla'
            ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/30' 
            : 'border-slate-200 hover:bg-slate-50/50'
        }`}
      >
        <div className="flex items-center justify-between text-emerald-700 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Reemplazo Art.</span>
          <div className="w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center text-emerald-700">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="text-2xl font-black text-slate-900 font-mono tabular-nums">{totalReemplazo}</span>
          <span className="text-[11px] text-slate-500 font-medium">ítems</span>
        </div>
        <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
          Cadera: {totalCadera} · Rodilla: {totalRodilla}
        </div>
      </div>

      {/* 5. Equipos Médicos */}
      <div 
        onClick={() => onSelectCategory('equipos_medicos')}
        className={`bg-white rounded-xl p-3.5 border transition-all cursor-pointer shadow-xs hover:border-indigo-500 ${
          selectedCategory === 'equipos_medicos' 
            ? 'ring-2 ring-indigo-500 border-indigo-500 bg-indigo-50/30' 
            : 'border-slate-200 hover:bg-slate-50/50'
        }`}
      >
        <div className="flex items-center justify-between text-indigo-700 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Equipos</span>
          <div className="w-6 h-6 rounded-md bg-indigo-100 flex items-center justify-center text-indigo-700">
            <Cpu className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="text-2xl font-black text-slate-900 font-mono tabular-nums">{totalEquipos}</span>
          <span className="text-[11px] text-slate-500 font-medium">equipos</span>
        </div>
        <div className="text-[11px] text-slate-500 mt-0.5 font-medium truncate">
          Torres, shaver, arcos
        </div>
      </div>

      {/* 6. Total & Alertas de Stock */}
      <div 
        onClick={onFilterCritical}
        className="bg-white rounded-xl p-3.5 border border-slate-200 hover:border-rose-400 transition-all cursor-pointer shadow-xs"
      >
        <div className="flex items-center justify-between text-rose-700 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Control Stock</span>
          <div className="w-6 h-6 rounded-md bg-rose-100 flex items-center justify-center text-rose-700">
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="text-2xl font-black text-rose-600 font-mono tabular-nums">{criticalCount}</span>
          <span className="text-[11px] text-rose-500 font-medium">en alerta</span>
        </div>
        <div className="text-[11px] text-slate-500 mt-0.5 font-medium truncate">
          {items.length} refs ({totalUnidades} uds)
        </div>
      </div>

    </div>
  );
};
