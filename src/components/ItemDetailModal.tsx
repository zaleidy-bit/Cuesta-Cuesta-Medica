import React from 'react';
import { 
  X, 
  MapPin, 
  ShieldCheck, 
  Cpu, 
  Sparkles,
  ArrowUpDown,
  Edit3,
  DollarSign,
  Package,
  ListOrdered
} from 'lucide-react';
import { InventoryItem } from '../types/inventory';
import { getStockHealth, getStockHealthBadge, getStatusBadge, getCategoryLabel } from '../utils/inventoryUtils';

interface ItemDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem | null;
  onEdit: (item: InventoryItem) => void;
  onMovement: (item: InventoryItem) => void;
  onViewPieces?: (item: InventoryItem) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  isOpen,
  onClose,
  item,
  onEdit,
  onMovement,
  onViewPieces
}) => {
  if (!isOpen || !item) return null;

  const catInfo = getCategoryLabel(item);
  const health = getStockHealth(item);
  const healthBadge = getStockHealthBadge(health);
  const statusBadge = getStatusBadge(item.estado);
  const piezas = item.piezas || [];
  const piecesCount = piezas.reduce((acc, p) => acc + (p.cantidad || 1), 0) || item.totalPiezas || 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 my-6">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold">
              {item.esSet ? <Package className="w-4 h-4" /> : item.primaryCategory === 'equipos_medicos' ? <Cpu className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </div>
            <div>
              <span className="text-[10px] font-mono text-teal-400 font-bold uppercase tracking-wider">
                {item.sku}
              </span>
              <h2 className="text-base font-bold text-white leading-tight">
                {item.esSet ? 'Ficha Técnica del Set Quirúrgico' : 'Ficha Técnica de Almacén'}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 text-xs max-h-[78vh] overflow-y-auto">
          
          {/* Main Title & Breadcrumb */}
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="font-semibold text-teal-800 text-xs">
                {catInfo.fullPath}
              </span>
              {item.esSet && (
                <span className="bg-teal-100 text-teal-900 px-2 py-0.5 rounded text-[11px] font-bold border border-teal-300">
                  Set Quirúrgico · {piecesCount} piezas
                </span>
              )}
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">{item.nombre}</h3>
            <p className="text-slate-600 text-xs mt-1.5 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
              {item.descripcion}
            </p>
          </div>

          {/* If it's a Set, show Pieces Preview Card */}
          {item.esSet && (
            <div className="bg-teal-50/70 border border-teal-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-teal-700" />
                  <span className="font-bold text-teal-950 text-xs">
                    Listado de Instrumental del Set ({piecesCount} piezas)
                  </span>
                </div>
                {onViewPieces && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onViewPieces(item);
                    }}
                    className="flex items-center space-x-1 px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded font-bold text-[11px] transition-colors cursor-pointer"
                  >
                    <ListOrdered className="w-3.5 h-3.5" />
                    <span>Abrir Hoja de Conteo</span>
                  </button>
                )}
              </div>

              {piezas.length > 0 ? (
                <div className="bg-white rounded-lg border border-teal-200/80 p-2.5 max-h-36 overflow-y-auto divide-y divide-slate-100">
                  {piezas.slice(0, 8).map((p, idx) => (
                    <div key={p.id} className="py-1 px-1 flex items-center justify-between text-[11px]">
                      <span className="text-slate-700 font-medium truncate">
                        <strong className="text-slate-900 font-mono mr-1.5">{p.codigo}:</strong>
                        {p.nombre}
                      </span>
                      <span className="text-slate-500 font-mono shrink-0 ml-2">
                        x{p.cantidad}
                      </span>
                    </div>
                  ))}
                  {piezas.length > 8 && (
                    <div className="pt-1.5 text-center text-[10px] text-teal-700 font-semibold">
                      + {piezas.length - 8} piezas adicionales (ver en hoja de conteo)
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-[11px] text-slate-500">No hay piezas desglosadas.</p>
              )}
            </div>
          )}

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div>
              <div className="text-[10px] text-slate-400 font-medium uppercase">Stock en Bodega</div>
              <div className="text-lg font-black text-slate-900 font-mono tabular-nums">
                {item.stockActual} {item.unidadMedida}
              </div>
              <div className="text-[10px] text-slate-500">Mínimo: {item.stockMinimo}</div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 font-medium uppercase">Condición</div>
              <div className="mt-1">
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${healthBadge.bg}`}>
                  {healthBadge.label}
                </span>
              </div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 font-medium uppercase">Estado</div>
              <div className="mt-1">
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${statusBadge.bg}`}>
                  {statusBadge.label}
                </span>
              </div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 font-medium uppercase">Precio de Lista</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5 font-mono tabular-nums">
                {item.precioVenta ? `$${item.precioVenta.toLocaleString()} USD` : 'N/D'}
              </div>
              {item.costoUnitario ? (
                <div className="text-[10px] text-slate-400 font-mono tabular-nums">Costo: ${item.costoUnitario.toLocaleString()}</div>
              ) : null}
            </div>
          </div>

          {/* Trazabilidad & Regulatory Clearance */}
          <div>
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Trazabilidad y Calidad</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 bg-white p-3 rounded-xl border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-400 block">Lote:</span>
                <span className="font-mono font-bold text-slate-800 text-xs">{item.lote}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Fabricante:</span>
                <span className="font-semibold text-slate-800">{item.fabricante}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Material:</span>
                <span className="text-slate-700">{item.material || 'Acero Quirúrgico'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Registro Sanitario:</span>
                <span className="font-mono text-slate-700">{item.registroSanitario || 'En trámite'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Ubicación:</span>
                <span className="text-slate-700 font-medium">{item.ubicacion}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Unidad:</span>
                <span className="text-slate-700 capitalize">{item.unidadMedida}</span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <div className="text-[10px] text-slate-400 font-mono">
              Registrado: {item.fechaRegistro} · Act: {item.ultimaActualizacion}
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onMovement(item);
                }}
                className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 font-semibold rounded-lg border border-teal-200 flex items-center space-x-1 transition-colors cursor-pointer"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>Movimiento</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(item);
                }}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg flex items-center space-x-1 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editar</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
