import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronDown, 
  Search, 
  X, 
  Filter, 
  Check, 
  Cpu, 
  Activity, 
  Bone, 
  Sparkles, 
  Layers,
  Package
} from 'lucide-react';
import { InventoryItem } from '../types/inventory';

interface CategoryFilterDropdownProps {
  items: InventoryItem[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  soloSets: boolean;
  onToggleSoloSets: () => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusChange: (val: string) => void;
  stockFilter: string;
  onStockFilterChange: (val: string) => void;
  locationFilter: string;
  onLocationChange: (val: string) => void;
  onResetFilters: () => void;
  isCollapsibleView?: boolean;
  onExpandAll?: () => void;
  onCollapseAll?: () => void;
}

export const CategoryFilterDropdown: React.FC<CategoryFilterDropdownProps> = ({
  items,
  selectedCategory,
  onSelectCategory,
  soloSets,
  onToggleSoloSets,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  stockFilter,
  onStockFilterChange,
  locationFilter,
  onLocationChange,
  onResetFilters,
  isCollapsibleView,
  onExpandAll,
  onCollapseAll
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalCount = items.length;
  const setsCount = items.filter(i => i.esSet).length;
  const equiposCount = items.filter(i => i.primaryCategory === 'equipos_medicos').length;
  const artHombroCount = items.filter(i => i.instrumentalCategory === 'artroscopia' && i.artroscopiaSubcategory === 'hombro').length;
  const artRodillaCount = items.filter(i => i.instrumentalCategory === 'artroscopia' && i.artroscopiaSubcategory === 'rodilla').length;
  const osteosintesisCount = items.filter(i => i.instrumentalCategory === 'osteosintesis').length;
  const caderaCount = items.filter(i => i.instrumentalCategory === 'reemplazo_articular' && i.reemplazoSubcategory === 'cadera').length;
  const rodillaCount = items.filter(i => i.instrumentalCategory === 'reemplazo_articular' && i.reemplazoSubcategory === 'rodilla').length;

  const locations = Array.from(new Set(items.map(i => i.ubicacion))).sort();

  const getSelectedLabel = () => {
    switch (selectedCategory) {
      case 'equipos_medicos': return `Equipos Médicos (${equiposCount})`;
      case 'artroscopia': return `Artroscopia (Todos)`;
      case 'art_hombro': return `Artroscopia › Hombro (${artHombroCount})`;
      case 'art_rodilla': return `Artroscopia › Rodilla (${artRodillaCount})`;
      case 'osteosintesis': return `Osteosíntesis (${osteosintesisCount})`;
      case 'reemplazo_articular': return `Reemplazo Articular (Todos)`;
      case 'cadera': return `Reemplazo Articular › Cadera (${caderaCount})`;
      case 'rodilla': return `Reemplazo Articular › Rodilla (${rodillaCount})`;
      default: return `Todas las Categorías (${totalCount})`;
    }
  };

  const hasActiveFilters = 
    selectedCategory !== 'todos' || 
    soloSets ||
    searchTerm !== '' || 
    statusFilter !== 'todos' || 
    stockFilter !== 'todos' || 
    locationFilter !== 'todos';

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 mb-6 transition-all">
      
      {/* Upper Bar: Search + Category Selector + Status Filters */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
        
        {/* Real-time search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por código, set, instrumental, lote, fabricante..."
            className="w-full pl-10 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Solo Sets Quirúrgicos Toggle Button */}
        <button
          type="button"
          onClick={onToggleSoloSets}
          className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all border cursor-pointer whitespace-nowrap ${
            soloSets
              ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
          title="Filtrar únicamente sets quirúrgicos con desglose de instrumental"
        >
          <Package className="w-3.5 h-3.5" />
          <span>Solo Sets ({setsCount})</span>
        </button>

        {/* Category Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`w-full sm:w-auto flex items-center justify-between space-x-2 px-3 py-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory !== 'todos'
                ? 'bg-teal-50 text-teal-900 border-teal-300'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-teal-600" />
              <span className="font-bold">{getSelectedLabel()}</span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 left-0 sm:left-auto sm:right-0 mt-2 w-full sm:w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 max-h-96 overflow-y-auto animate-in fade-in zoom-in-95 text-xs">
              
              <button
                type="button"
                onClick={() => {
                  onSelectCategory('todos');
                  setIsDropdownOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-left hover:bg-slate-50 ${
                  selectedCategory === 'todos' ? 'bg-teal-50 text-teal-900 font-bold' : 'text-slate-700'
                }`}
              >
                <span>Todas las Categorías</span>
                <span className="font-mono text-slate-400">{totalCount}</span>
              </button>

              <div className="h-px bg-slate-100 my-1"></div>

              {/* Equipos */}
              <button
                type="button"
                onClick={() => {
                  onSelectCategory('equipos_medicos');
                  setIsDropdownOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-left hover:bg-indigo-50/50 ${
                  selectedCategory === 'equipos_medicos' ? 'bg-indigo-50 text-indigo-900 font-bold' : 'text-slate-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Cpu className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Equipos Médicos</span>
                </div>
                <span className="font-mono text-slate-400">{equiposCount}</span>
              </button>

              {/* Artroscopia */}
              <button
                type="button"
                onClick={() => {
                  onSelectCategory('artroscopia');
                  setIsDropdownOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-left hover:bg-teal-50/50 ${
                  selectedCategory === 'artroscopia' ? 'bg-teal-50 text-teal-900 font-bold' : 'text-slate-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Activity className="w-3.5 h-3.5 text-teal-600" />
                  <span>Artroscopia (General)</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelectCategory('art_hombro');
                  setIsDropdownOpen(false);
                }}
                className={`w-full flex items-center justify-between pl-8 pr-3.5 py-1.5 text-left hover:bg-teal-50/50 ${
                  selectedCategory === 'art_hombro' ? 'bg-teal-50 text-teal-900 font-bold' : 'text-slate-600'
                }`}
              >
                <span>🦾 Artroscopia de Hombro</span>
                <span className="font-mono text-slate-400">{artHombroCount}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelectCategory('art_rodilla');
                  setIsDropdownOpen(false);
                }}
                className={`w-full flex items-center justify-between pl-8 pr-3.5 py-1.5 text-left hover:bg-teal-50/50 ${
                  selectedCategory === 'art_rodilla' ? 'bg-teal-50 text-teal-900 font-bold' : 'text-slate-600'
                }`}
              >
                <span>🦵 Artroscopia de Rodilla</span>
                <span className="font-mono text-slate-400">{artRodillaCount}</span>
              </button>

              {/* Osteosíntesis */}
              <button
                type="button"
                onClick={() => {
                  onSelectCategory('osteosintesis');
                  setIsDropdownOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-left hover:bg-amber-50/50 ${
                  selectedCategory === 'osteosintesis' ? 'bg-amber-50 text-amber-900 font-bold' : 'text-slate-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Bone className="w-3.5 h-3.5 text-amber-600" />
                  <span>Osteosíntesis</span>
                </div>
                <span className="font-mono text-slate-400">{osteosintesisCount}</span>
              </button>

              {/* Reemplazo */}
              <button
                type="button"
                onClick={() => {
                  onSelectCategory('reemplazo_articular');
                  setIsDropdownOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-left hover:bg-emerald-50/50 ${
                  selectedCategory === 'reemplazo_articular' ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Reemplazo Articular (General)</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelectCategory('cadera');
                  setIsDropdownOpen(false);
                }}
                className={`w-full flex items-center justify-between pl-8 pr-3.5 py-1.5 text-left hover:bg-sky-50/50 ${
                  selectedCategory === 'cadera' ? 'bg-sky-50 text-sky-900 font-bold' : 'text-slate-600'
                }`}
              >
                <span>🦴 Cadera (Fresas, Vástagos, Copas)</span>
                <span className="font-mono text-slate-400">{caderaCount}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelectCategory('rodilla');
                  setIsDropdownOpen(false);
                }}
                className={`w-full flex items-center justify-between pl-8 pr-3.5 py-1.5 text-left hover:bg-cyan-50/50 ${
                  selectedCategory === 'rodilla' ? 'bg-cyan-50 text-cyan-900 font-bold' : 'text-slate-600'
                }`}
              >
                <span>🦵 Rodilla (Guías, Fémur, Tibias)</span>
                <span className="font-mono text-slate-400">{rodillaCount}</span>
              </button>

            </div>
          )}
        </div>

        {/* Estado Filter */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
        >
          <option value="todos">Todos los Estados</option>
          <option value="disponible">🟢 En Almacén / Disponible</option>
          <option value="apartado">🔵 Apartado / Reservado</option>
          <option value="en_consignacion">🔷 En Consignación</option>
          <option value="en_revision">🟠 En Revisión Técnica</option>
          <option value="agotado">🔴 Sin Existencias</option>
        </select>

        {/* Nivel de Stock */}
        <select
          value={stockFilter}
          onChange={(e) => onStockFilterChange(e.target.value)}
          className="px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
        >
          <option value="todos">Nivel de Stock</option>
          <option value="critico">🚨 Crítico</option>
          <option value="bajo">⚠️ Mínimo</option>
          <option value="optimo">✅ Óptimo</option>
        </select>

        {/* Reset button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="flex items-center space-x-1 px-2.5 py-2 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg border border-rose-200 cursor-pointer"
            title="Limpiar filtros"
          >
            <X className="w-3.5 h-3.5" />
            <span className="font-semibold">Limpiar</span>
          </button>
        )}

      </div>

      {/* Quick Segmented Filter Strip */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-slate-400 font-semibold mr-1">Filtrar por:</span>
          
          <button
            type="button"
            onClick={() => onSelectCategory('todos')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
              selectedCategory === 'todos' && !soloSets
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Todos ({totalCount})
          </button>

          <button
            type="button"
            onClick={() => onSelectCategory('art_hombro')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
              selectedCategory === 'art_hombro'
                ? 'bg-teal-700 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-teal-50'
            }`}
          >
            Set / Art. Hombro ({artHombroCount})
          </button>

          <button
            type="button"
            onClick={() => onSelectCategory('art_rodilla')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
              selectedCategory === 'art_rodilla'
                ? 'bg-teal-700 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-teal-50'
            }`}
          >
            Set / Art. Rodilla ({artRodillaCount})
          </button>

          <button
            type="button"
            onClick={() => onSelectCategory('osteosintesis')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
              selectedCategory === 'osteosintesis'
                ? 'bg-amber-700 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-amber-50'
            }`}
          >
            Osteosíntesis ({osteosintesisCount})
          </button>

          <button
            type="button"
            onClick={() => onSelectCategory('cadera')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
              selectedCategory === 'cadera'
                ? 'bg-sky-700 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-sky-50'
            }`}
          >
            Cadera ({caderaCount})
          </button>

          <button
            type="button"
            onClick={() => onSelectCategory('equipos_medicos')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
              selectedCategory === 'equipos_medicos'
                ? 'bg-indigo-700 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-indigo-50'
            }`}
          >
            Equipos ({equiposCount})
          </button>
        </div>

        {isCollapsibleView && onExpandAll && onCollapseAll && (
          <div className="flex items-center space-x-2 text-[11px] text-slate-500">
            <button
              type="button"
              onClick={onExpandAll}
              className="hover:text-teal-700 font-semibold cursor-pointer"
            >
              Expandir todas
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={onCollapseAll}
              className="hover:text-slate-800 font-semibold cursor-pointer"
            >
              Colapsar todas
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
