import React, { useState } from 'react';
import { InventoryItem } from '../types/inventory';
import { 
  ArrowUpDown, 
  Eye, 
  Edit3, 
  Trash2, 
  FileText,
  Package,
  ListOrdered
} from 'lucide-react';
import { getStockHealth, getStockHealthBadge, getStatusBadge, getCategoryLabel } from '../utils/inventoryUtils';

interface InventoryListViewProps {
  items: InventoryItem[];
  onViewItem: (item: InventoryItem) => void;
  onViewPieces: (item: InventoryItem) => void;
  onEditItem: (item: InventoryItem) => void;
  onMovementItem: (item: InventoryItem) => void;
  onDeleteItem: (id: string) => void;
}

export const InventoryListView: React.FC<InventoryListViewProps> = ({
  items,
  onViewItem,
  onViewPieces,
  onEditItem,
  onMovementItem,
  onDeleteItem
}) => {
  const [sortField, setSortField] = useState<'nombre' | 'sku' | 'stockActual' | 'categoria'>('nombre');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedItems = [...items].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'nombre') {
      comparison = a.nombre.localeCompare(b.nombre);
    } else if (sortField === 'sku') {
      comparison = a.sku.localeCompare(b.sku);
    } else if (sortField === 'stockActual') {
      comparison = a.stockActual - b.stockActual;
    } else if (sortField === 'categoria') {
      const catA = getCategoryLabel(a).fullPath;
      const catB = getCategoryLabel(b).fullPath;
      comparison = catA.localeCompare(catB);
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
          <FileText className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-700">No se encontraron ítems ni sets</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
          No hay registros que coincidan con la búsqueda o filtros actuales.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
      
      {/* Table Header Summary */}
      <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
        <div className="font-semibold">
          Mostrando <strong className="text-slate-900 font-mono tabular-nums">{items.length}</strong> registros en almacén
        </div>
        <div className="text-[11px] text-slate-400">
          Haz clic en cualquier set para ver su desglose completo de piezas e instrumental
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider select-none">
              <th 
                className="py-2.5 px-4 cursor-pointer hover:text-teal-700 transition-colors w-32"
                onClick={() => handleSort('sku')}
              >
                <div className="flex items-center space-x-1">
                  <span>Código / SKU</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              
              <th 
                className="py-2.5 px-4 cursor-pointer hover:text-teal-700 transition-colors"
                onClick={() => handleSort('nombre')}
              >
                <div className="flex items-center space-x-1">
                  <span>Descripción del Set o Instrumental</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              <th 
                className="py-2.5 px-4 cursor-pointer hover:text-teal-700 transition-colors"
                onClick={() => handleSort('categoria')}
              >
                <div className="flex items-center space-x-1">
                  <span>Categoría</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              <th className="py-2.5 px-4">Lote / Fab</th>

              <th className="py-2.5 px-4">Ubicación Bodega</th>

              <th 
                className="py-2.5 px-4 text-center cursor-pointer hover:text-teal-700 transition-colors"
                onClick={() => handleSort('stockActual')}
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>Stock</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              <th className="py-2.5 px-4 text-center">Estado</th>

              <th className="py-2.5 px-4 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {sortedItems.map((item) => {
              const catInfo = getCategoryLabel(item);
              const health = getStockHealth(item);
              const healthBadge = getStockHealthBadge(health);
              const statusBadge = getStatusBadge(item.estado);
              const piecesCount = item.piezas?.length || item.totalPiezas || 0;

              return (
                <tr 
                  key={item.id}
                  className={`hover:bg-slate-50/80 transition-colors group ${
                    item.esSet ? 'bg-teal-50/15' : ''
                  }`}
                >
                  {/* SKU */}
                  <td className="py-3 px-4 font-mono font-bold text-slate-800 whitespace-nowrap align-top">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] border border-slate-200">
                      {item.sku}
                    </span>
                    {item.esSet && (
                      <span className="block mt-1 text-[10px] text-teal-800 font-sans font-bold">
                        Set Quirúrgico
                      </span>
                    )}
                  </td>

                  {/* Name & pieces */}
                  <td className="py-3 px-4 align-top max-w-sm">
                    <div 
                      onClick={() => onViewItem(item)}
                      className="font-bold text-slate-900 hover:text-teal-700 cursor-pointer transition-colors leading-snug"
                    >
                      {item.nombre}
                    </div>

                    <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {item.descripcion}
                    </div>

                    {item.esSet && (
                      <div className="mt-1 flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => onViewPieces(item)}
                          className="inline-flex items-center space-x-1 text-[11px] bg-teal-100 hover:bg-teal-200 text-teal-900 font-bold px-2 py-0.5 rounded border border-teal-300 transition-colors cursor-pointer"
                        >
                          <ListOrdered className="w-3 h-3 text-teal-700" />
                          <span>Desglose: {piecesCount} piezas</span>
                        </button>
                      </div>
                    )}
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4 align-top whitespace-nowrap text-[11px]">
                    <div className="font-semibold text-slate-800">
                      {catInfo.category}
                    </div>
                    {catInfo.subcategory && (
                      <div className="text-slate-500 text-[10px]">
                        › {catInfo.subcategory}
                      </div>
                    )}
                  </td>

                  {/* Lote & Fabricante */}
                  <td className="py-3 px-4 align-top whitespace-nowrap text-[11px]">
                    <div className="font-mono font-semibold text-slate-800">
                      LT: {item.lote}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {item.fabricante}
                    </div>
                  </td>

                  {/* Ubicación */}
                  <td className="py-3 px-4 align-top text-[11px] text-slate-600 max-w-[160px]">
                    <span className="line-clamp-2">{item.ubicacion}</span>
                  </td>

                  {/* Stock */}
                  <td className="py-3 px-4 align-top text-center whitespace-nowrap">
                    <div className="flex items-center justify-center space-x-1 font-bold font-mono tabular-nums">
                      <span className="text-sm text-slate-900">{item.stockActual}</span>
                      <span className="text-[10px] text-slate-400">/ {item.stockMinimo} {item.unidadMedida}</span>
                    </div>
                    <div className="mt-0.5">
                      <span className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-semibold border ${healthBadge.bg}`}>
                        {healthBadge.label}
                      </span>
                    </div>
                  </td>

                  {/* Estado */}
                  <td className="py-3 px-4 align-top text-center whitespace-nowrap">
                    <span className={`inline-block py-0.5 px-2 rounded text-[10px] font-bold border ${statusBadge.bg}`}>
                      {statusBadge.label}
                    </span>
                  </td>

                  {/* Acciones */}
                  <td className="py-3 px-4 align-top text-right whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-1">
                      {item.esSet && (
                        <button
                          type="button"
                          onClick={() => onViewPieces(item)}
                          className="p-1.5 text-teal-700 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
                          title="Ver y verificar piezas del set"
                        >
                          <ListOrdered className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onMovementItem(item)}
                        className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
                        title="Registrar Movimiento"
                      >
                        <ArrowUpDown className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onViewItem(item)}
                        className="p-1.5 text-slate-500 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                        title="Ver Ficha Detallada"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEditItem(item)}
                        className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                        title="Editar Ítem o Piezas"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteItem(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};
