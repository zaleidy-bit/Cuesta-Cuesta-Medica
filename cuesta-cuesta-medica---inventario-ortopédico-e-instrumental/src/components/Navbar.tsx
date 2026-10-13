import React from 'react';
import { 
  Plus, 
  FileSpreadsheet, 
  ClipboardList, 
  Layers, 
  ListFilter, 
  Package,
  Building2
} from 'lucide-react';

interface NavbarProps {
  criticalCount: number;
  setsCount: number;
  inConsignmentCount: number;
  viewMode: 'table' | 'collapsible';
  setViewMode: (mode: 'table' | 'collapsible') => void;
  onOpenNewItemModal: (isSet?: boolean) => void;
  onOpenRemissionModal: () => void;
  onExportExcel: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  criticalCount,
  setsCount,
  inConsignmentCount,
  viewMode,
  setViewMode,
  onOpenNewItemModal,
  onOpenRemissionModal,
  onExportExcel
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Wordmark Brand */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center shadow-md shadow-teal-900/30">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base sm:text-lg font-black tracking-tight text-white uppercase whitespace-nowrap">
                  Cuesta Cuesta Médica
                </span>
                <span className="text-[10px] text-teal-400 font-mono font-bold uppercase tracking-wider hidden sm:inline">
                  · Inventario Quirúrgico
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden md:block">
                Equipos Médicos e Instrumental Quirúrgico por Sets y Piezas
              </p>
            </div>
          </div>

          {/* Zone 2: Navigation & View Mode Toggles */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* View Switcher: Segmented Control */}
            <div className="bg-slate-800 p-0.5 rounded-lg border border-slate-700/80 flex items-center text-xs font-medium">
              <button
                type="button"
                onClick={() => setViewMode('collapsible')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  viewMode === 'collapsible'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Vista agrupada por categorías y sets quirúrgicos"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cajas y Sets</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  viewMode === 'table'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Vista en tabla general detallada"
              >
                <ListFilter className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tabla General</span>
              </button>
            </div>

            {/* Remisión de Despacho Quirúrgico */}
            <button
              type="button"
              onClick={onOpenRemissionModal}
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              title="Generar nota de remisión o despacho para cirugía"
            >
              <ClipboardList className="w-3.5 h-3.5 text-teal-400" />
              <span>Remisión Quirúrgica</span>
            </button>

            {/* Exportar Excel */}
            <button
              type="button"
              onClick={onExportExcel}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              title="Descargar inventario en formato Excel (.xlsx)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-teal-400" />
              <span>Exportar Excel</span>
            </button>
          </div>

          {/* Zone 3: Primary Action CTA */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={() => onOpenNewItemModal(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white text-xs font-bold rounded-lg transition-all shadow-sm cursor-pointer whitespace-nowrap"
              title="Crear un nuevo set quirúrgico con su listado de instrumental o ítem"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>+ Nuevo Set / Ítem</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
