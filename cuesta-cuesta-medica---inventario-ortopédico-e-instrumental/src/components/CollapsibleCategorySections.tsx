import React, { useState } from 'react';
import { InventoryItem } from '../types/inventory';
import { 
  ChevronDown, 
  ChevronRight, 
  Cpu, 
  Activity, 
  Bone, 
  Sparkles, 
  AlertTriangle, 
  ArrowUpDown, 
  Eye, 
  Edit3, 
  Trash2, 
  Plus,
  Package,
  CheckCircle2,
  ListOrdered
} from 'lucide-react';
import { getStockHealth, getStockHealthBadge, getStatusBadge } from '../utils/inventoryUtils';

interface CollapsibleCategorySectionsProps {
  items: InventoryItem[];
  onViewItem: (item: InventoryItem) => void;
  onViewPieces: (item: InventoryItem) => void;
  onEditItem: (item: InventoryItem) => void;
  onMovementItem: (item: InventoryItem) => void;
  onDeleteItem: (id: string) => void;
  onAddItemToCategory: (
    primary: 'equipos_medicos' | 'instrumental', 
    instrumentalCat?: 'artroscopia' | 'osteosintesis' | 'reemplazo_articular', 
    reemplazoSub?: 'cadera' | 'rodilla',
    artroscopiaSub?: 'hombro' | 'rodilla' | 'otros',
    isSet?: boolean
  ) => void;
  openSections: Record<string, boolean>;
  onToggleSection: (sectionKey: string) => void;
}

export const CollapsibleCategorySections: React.FC<CollapsibleCategorySectionsProps> = ({
  items,
  onViewItem,
  onViewPieces,
  onEditItem,
  onMovementItem,
  onDeleteItem,
  onAddItemToCategory,
  openSections,
  onToggleSection
}) => {
  // Sub-accordions for Artroscopia: Hombro, Rodilla, Otros
  const [openArtHombro, setOpenArtHombro] = useState(true);
  const [openArtRodilla, setOpenArtRodilla] = useState(true);
  const [openArtOtros, setOpenArtOtros] = useState(true);

  // Sub-accordions for Reemplazo Articular: Cadera, Rodilla
  const [openHip, setOpenHip] = useState(true);
  const [openKnee, setOpenKnee] = useState(true);

  // Filter items by category
  const equiposItems = items.filter(i => i.primaryCategory === 'equipos_medicos');
  
  // Artroscopia items by subcategory
  const artHombroItems = items.filter(i => i.instrumentalCategory === 'artroscopia' && i.artroscopiaSubcategory === 'hombro');
  const artRodillaItems = items.filter(i => i.instrumentalCategory === 'artroscopia' && i.artroscopiaSubcategory === 'rodilla');
  const artOtrosItems = items.filter(i => i.instrumentalCategory === 'artroscopia' && (i.artroscopiaSubcategory === 'otros' || !i.artroscopiaSubcategory));
  const totalArtroscopiaCount = artHombroItems.length + artRodillaItems.length + artOtrosItems.length;

  // Osteosíntesis items
  const osteosintesisItems = items.filter(i => i.instrumentalCategory === 'osteosintesis');

  // Reemplazo Articular items by subcategory
  const caderaItems = items.filter(i => i.instrumentalCategory === 'reemplazo_articular' && i.reemplazoSubcategory === 'cadera');
  const rodillaItems = items.filter(i => i.instrumentalCategory === 'reemplazo_articular' && i.reemplazoSubcategory === 'rodilla');
  const reemplazoGeneralItems = items.filter(i => i.instrumentalCategory === 'reemplazo_articular' && !i.reemplazoSubcategory);

  // Helper for rendering an item row
  const renderItemRow = (item: InventoryItem) => {
    const health = getStockHealth(item);
    const healthBadge = getStockHealthBadge(health);
    const statusBadge = getStatusBadge(item.estado);
    const piecesCount = item.piezas?.length || item.totalPiezas || 0;

    return (
      <div 
        key={item.id}
        className={`p-3.5 hover:bg-slate-50/80 transition-colors border-b border-slate-100 last:border-b-0 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs ${
          item.esSet ? 'bg-teal-50/20' : ''
        }`}
      >
        {/* Left: Code, Name, Subtype & Traceability */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px] border border-slate-200">
              {item.sku}
            </span>
            
            {item.esSet ? (
              <span className="inline-flex items-center space-x-1 text-[11px] bg-teal-100 text-teal-900 px-2 py-0.5 rounded font-bold border border-teal-300">
                <Package className="w-3 h-3 text-teal-700" />
                <span>Set Quirúrgico ({piecesCount} piezas)</span>
              </span>
            ) : item.subtipo ? (
              <span className="text-[11px] text-slate-500 font-medium">
                {item.subtipo}
              </span>
            ) : null}

            <span className="text-slate-400 font-mono text-[11px]">
              Lote: <strong className="text-slate-700 font-mono">{item.lote}</strong>
            </span>

            {item.fabricante && (
              <span className="text-slate-500 text-[11px]">
                · {item.fabricante}
              </span>
            )}
          </div>

          <h4 
            className="font-bold text-slate-900 text-sm hover:text-teal-700 transition-colors cursor-pointer" 
            onClick={() => onViewItem(item)}
          >
            {item.nombre}
          </h4>

          <p className="text-slate-500 text-xs line-clamp-1 mt-0.5">
            {item.descripcion}
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-1 text-[11px] text-slate-500">
            <span>📍 {item.ubicacion}</span>
            {item.material && <span>· Mat: <strong className="text-slate-600">{item.material}</strong></span>}
            {item.reservaCliente?.cliente && (
              <span className="text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded font-semibold border border-blue-200">
                Reservado: {item.reservaCliente.cliente}
              </span>
            )}
            {item.precioVenta ? (
              <span className="text-slate-700 font-semibold font-mono tabular-nums">
                Precio: ${item.precioVenta.toLocaleString()} USD
              </span>
            ) : null}
          </div>
        </div>

        {/* Center: Stock Health & State */}
        <div className="flex items-center space-x-3 shrink-0">
          {/* If it's a set, show direct button to inspect pieces */}
          {item.esSet && (
            <button
              type="button"
              onClick={() => onViewPieces(item)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-300 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer whitespace-nowrap"
              title="Ver desglose completo de piezas y checklist de conteo quirúrgico"
            >
              <ListOrdered className="w-3.5 h-3.5 text-teal-700" />
              <span>Ver Piezas ({piecesCount})</span>
            </button>
          )}

          {/* Stock numbers & health bar */}
          <div className="text-right">
            <div className="flex items-center justify-end space-x-1 font-mono tabular-nums">
              <span className="text-base font-black text-slate-900">{item.stockActual}</span>
              <span className="text-[11px] text-slate-400">/ mín {item.stockMinimo} {item.unidadMedida}</span>
            </div>
            <div className="flex items-center justify-end mt-0.5">
              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border ${healthBadge.bg}`}>
                {healthBadge.label}
              </span>
            </div>
          </div>

          {/* Operational Status */}
          <div className="w-28 text-center">
            <span className={`inline-block w-full py-0.5 px-1.5 rounded text-[10px] font-bold border ${statusBadge.bg}`}>
              {statusBadge.label}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-1 border-l border-slate-200 pl-2">
            <button
              type="button"
              onClick={() => onMovementItem(item)}
              className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
              title="Registrar Movimiento de Almacén"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onViewItem(item)}
              className="p-1.5 text-slate-500 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
              title="Ver Ficha Técnica"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onEditItem(item)}
              className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
              title="Editar Ítem o Piezas"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDeleteItem(item.id)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Eliminar de inventario"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">

      {/* ======================================================== */}
      {/* 1. SECCIÓN DESPLEGABLE: EQUIPOS MÉDICOS */}
      {/* ======================================================== */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden transition-all">
        <div 
          onClick={() => onToggleSection('equipos_medicos')}
          className="px-5 py-3.5 bg-slate-50 hover:bg-indigo-50/30 cursor-pointer flex items-center justify-between border-b border-slate-200 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-slate-900">Equipos Médicos</h3>
                <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  {equiposItems.length} equipos
                </span>
                {equiposItems.some(i => getStockHealth(i) === 'critico') && (
                  <span className="text-[10px] text-rose-700 font-bold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                    Stock Crítico
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Torres de artroscopia 4K, motores quirúrgicos, consolas de shaver y fluoroscopios.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAddItemToCategory('equipos_medicos', undefined, undefined, undefined, false);
              }}
              className="flex items-center space-x-1 px-2.5 py-1 bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Añadir Equipo</span>
            </button>
            <div className="text-slate-400 p-1">
              {openSections['equipos_medicos'] ? (
                <ChevronDown className="w-4 h-4 text-indigo-700" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </div>
          </div>
        </div>

        {openSections['equipos_medicos'] && (
          <div className="divide-y divide-slate-100">
            {equiposItems.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No hay equipos médicos que coincidan con los filtros seleccionados.
              </div>
            ) : (
              equiposItems.map(renderItemRow)
            )}
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 2. SECCIÓN DESPLEGABLE: INSTRUMENTAL - ARTROSCOPIA (HOMBRO, RODILLA, OTROS) */}
      {/* ======================================================== */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden transition-all">
        <div 
          onClick={() => onToggleSection('artroscopia')}
          className="px-5 py-3.5 bg-slate-50 hover:bg-teal-50/30 cursor-pointer flex items-center justify-between border-b border-slate-200 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-slate-900">Instrumental: Artroscopia</h3>
                <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {totalArtroscopiaCount} referencias
                </span>
                <span className="text-[11px] text-teal-800">
                  Hombro: {artHombroItems.length} · Rodilla: {artRodillaItems.length}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Sets de artroscopia con desglose de instrumental (ej. Set de Hombro con 23 piezas), arpones, cánulas y reconstrucción LCA.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAddItemToCategory('instrumental', 'artroscopia', undefined, 'hombro', true);
              }}
              className="flex items-center space-x-1 px-2.5 py-1 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Nuevo Set / Ítem</span>
            </button>
            <div className="text-slate-400 p-1">
              {openSections['artroscopia'] ? (
                <ChevronDown className="w-4 h-4 text-teal-700" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </div>
          </div>
        </div>

        {openSections['artroscopia'] && (
          <div className="p-3.5 space-y-3.5 bg-slate-50/40">

            {/* Subcategoría: Hombro */}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xs">
              <div 
                onClick={() => setOpenArtHombro(!openArtHombro)}
                className="px-4 py-2.5 bg-teal-50/60 hover:bg-teal-100/50 cursor-pointer flex items-center justify-between border-b border-teal-100 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-base">🦾</span>
                  <div>
                    <span className="text-xs font-bold text-teal-950">Subcategoría: Artroscopia - Hombro</span>
                    <span className="text-[11px] text-teal-700 ml-2 font-mono">({artHombroItems.length} ítems)</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddItemToCategory('instrumental', 'artroscopia', undefined, 'hombro', true);
                    }}
                    className="flex items-center space-x-1 px-2 py-0.5 bg-white text-teal-800 border border-teal-300 text-[11px] font-semibold rounded hover:bg-teal-50 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Añadir Set Hombro</span>
                  </button>
                  {openArtHombro ? <ChevronDown className="w-4 h-4 text-teal-700" /> : <ChevronRight className="w-4 h-4 text-teal-700" />}
                </div>
              </div>

              {openArtHombro && (
                <div className="divide-y divide-slate-100">
                  {artHombroItems.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs">
                      No hay registros de artroscopia de hombro.
                    </div>
                  ) : (
                    artHombroItems.map(renderItemRow)
                  )}
                </div>
              )}
            </div>

            {/* Subcategoría: Rodilla */}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xs">
              <div 
                onClick={() => setOpenArtRodilla(!openArtRodilla)}
                className="px-4 py-2.5 bg-teal-50/60 hover:bg-teal-100/50 cursor-pointer flex items-center justify-between border-b border-teal-100 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-base">🦵</span>
                  <div>
                    <span className="text-xs font-bold text-teal-950">Subcategoría: Artroscopia - Rodilla</span>
                    <span className="text-[11px] text-teal-700 ml-2 font-mono">({artRodillaItems.length} ítems)</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddItemToCategory('instrumental', 'artroscopia', undefined, 'rodilla', true);
                    }}
                    className="flex items-center space-x-1 px-2 py-0.5 bg-white text-teal-800 border border-teal-300 text-[11px] font-semibold rounded hover:bg-teal-50 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Añadir Set Rodilla</span>
                  </button>
                  {openArtRodilla ? <ChevronDown className="w-4 h-4 text-teal-700" /> : <ChevronRight className="w-4 h-4 text-teal-700" />}
                </div>
              </div>

              {openArtRodilla && (
                <div className="divide-y divide-slate-100">
                  {artRodillaItems.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs">
                      No hay registros de artroscopia de rodilla.
                    </div>
                  ) : (
                    artRodillaItems.map(renderItemRow)
                  )}
                </div>
              )}
            </div>

            {/* Subcategoría: Otros */}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xs">
              <div 
                onClick={() => setOpenArtOtros(!openArtOtros)}
                className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 cursor-pointer flex items-center justify-between border-b border-slate-200 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-base">🔹</span>
                  <div>
                    <span className="text-xs font-bold text-slate-800">Subcategoría: Artroscopia - Otros / General</span>
                    <span className="text-[11px] text-slate-500 ml-2 font-mono">({artOtrosItems.length} ítems)</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {openArtOtros ? <ChevronDown className="w-4 h-4 text-slate-600" /> : <ChevronRight className="w-4 h-4 text-slate-600" />}
                </div>
              </div>

              {openArtOtros && (
                <div className="divide-y divide-slate-100">
                  {artOtrosItems.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs">
                      No hay registros en artroscopia otros.
                    </div>
                  ) : (
                    artOtrosItems.map(renderItemRow)
                  )}
                </div>
              )}
            </div>

          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 3. SECCIÓN DESPLEGABLE: INSTRUMENTAL - OSTEOSÍNTESIS */}
      {/* ======================================================== */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden transition-all">
        <div 
          onClick={() => onToggleSection('osteosintesis')}
          className="px-5 py-3.5 bg-slate-50 hover:bg-amber-50/30 cursor-pointer flex items-center justify-between border-b border-slate-200 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center">
              <Bone className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-slate-900">Instrumental: Osteosíntesis</h3>
                <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {osteosintesisItems.length} referencias
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Cajas completas de grandes y pequeños fragmentos (con listado de piezas), placas bloqueadas LCP y clavos.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAddItemToCategory('instrumental', 'osteosintesis', undefined, undefined, true);
              }}
              className="flex items-center space-x-1 px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Nuevo Set / Ítem</span>
            </button>
            <div className="text-slate-400 p-1">
              {openSections['osteosintesis'] ? (
                <ChevronDown className="w-4 h-4 text-amber-700" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </div>
          </div>
        </div>

        {openSections['osteosintesis'] && (
          <div className="divide-y divide-slate-100">
            {osteosintesisItems.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No hay instrumental de osteosíntesis que coincida con los filtros.
              </div>
            ) : (
              osteosintesisItems.map(renderItemRow)
            )}
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 4. SECCIÓN DESPLEGABLE: REEMPLAZO ARTICULAR (CADERA Y RODILLA) */}
      {/* ======================================================== */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden transition-all">
        <div 
          onClick={() => onToggleSection('reemplazo_articular')}
          className="px-5 py-3.5 bg-slate-50 hover:bg-emerald-50/30 cursor-pointer flex items-center justify-between border-b border-slate-200 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-slate-900">Instrumental: Reemplazo Articular</h3>
                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {caderaItems.length + rodillaItems.length + reemplazoGeneralItems.length} referencias
                </span>
                <span className="text-[11px] text-slate-600">
                  Cadera: {caderaItems.length} · Rodilla: {rodillaItems.length}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Prótesis y sets quirúrgicos de fresado acetabular, raspas femorales y guías de corte de rodilla.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAddItemToCategory('instrumental', 'reemplazo_articular', 'cadera', undefined, true);
              }}
              className="flex items-center space-x-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Nuevo Set / Ítem</span>
            </button>
            <div className="text-slate-400 p-1">
              {openSections['reemplazo_articular'] ? (
                <ChevronDown className="w-4 h-4 text-emerald-700" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </div>
          </div>
        </div>

        {openSections['reemplazo_articular'] && (
          <div className="p-3.5 space-y-3.5 bg-slate-50/40">

            {/* Subcategoría: Cadera */}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xs">
              <div 
                onClick={() => setOpenHip(!openHip)}
                className="px-4 py-2.5 bg-sky-50/60 hover:bg-sky-100/50 cursor-pointer flex items-center justify-between border-b border-sky-100 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-base">🦴</span>
                  <div>
                    <span className="text-xs font-bold text-sky-950">Subcategoría: Reemplazo Articular - Cadera</span>
                    <span className="text-[11px] text-sky-800 ml-2 font-mono">({caderaItems.length} ítems)</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddItemToCategory('instrumental', 'reemplazo_articular', 'cadera', undefined, true);
                    }}
                    className="flex items-center space-x-1 px-2 py-0.5 bg-white text-sky-800 border border-sky-300 text-[11px] font-semibold rounded hover:bg-sky-50 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Añadir Set Cadera</span>
                  </button>
                  {openHip ? <ChevronDown className="w-4 h-4 text-sky-700" /> : <ChevronRight className="w-4 h-4 text-sky-700" />}
                </div>
              </div>

              {openHip && (
                <div className="divide-y divide-slate-100">
                  {caderaItems.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs">
                      No hay registros de reemplazo de cadera.
                    </div>
                  ) : (
                    caderaItems.map(renderItemRow)
                  )}
                </div>
              )}
            </div>

            {/* Subcategoría: Rodilla */}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xs">
              <div 
                onClick={() => setOpenKnee(!openKnee)}
                className="px-4 py-2.5 bg-cyan-50/60 hover:bg-cyan-100/50 cursor-pointer flex items-center justify-between border-b border-cyan-100 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-base">🦵</span>
                  <div>
                    <span className="text-xs font-bold text-cyan-950">Subcategoría: Reemplazo Articular - Rodilla</span>
                    <span className="text-[11px] text-cyan-800 ml-2 font-mono">({rodillaItems.length} ítems)</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddItemToCategory('instrumental', 'reemplazo_articular', 'rodilla', undefined, true);
                    }}
                    className="flex items-center space-x-1 px-2 py-0.5 bg-white text-cyan-800 border border-cyan-300 text-[11px] font-semibold rounded hover:bg-cyan-50 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Añadir Set Rodilla</span>
                  </button>
                  {openKnee ? <ChevronDown className="w-4 h-4 text-cyan-700" /> : <ChevronRight className="w-4 h-4 text-cyan-700" />}
                </div>
              </div>

              {openKnee && (
                <div className="divide-y divide-slate-100">
                  {rodillaItems.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs">
                      No hay registros de reemplazo de rodilla.
                    </div>
                  ) : (
                    rodillaItems.map(renderItemRow)
                  )}
                </div>
              )}
            </div>

          </div>
        )}
      </div>

    </div>
  );
};
