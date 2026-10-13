import React, { useState } from 'react';
import { 
  X, 
  Package, 
  CheckCircle2, 
  AlertTriangle, 
  Printer, 
  Search, 
  Sparkles, 
  Edit3, 
  Check, 
  RotateCcw,
  Layers,
  MapPin,
  Building2,
  Calendar
} from 'lucide-react';
import { InventoryItem, SetPiece } from '../types/inventory';

interface SetPiecesModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem | null;
  onEditSet: (item: InventoryItem) => void;
  onUpdatePieceStatus?: (itemId: string, pieceId: string, verified: boolean) => void;
}

export const SetPiecesModal: React.FC<SetPiecesModalProps> = ({
  isOpen,
  onClose,
  item,
  onEditSet
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('todos');
  const [checklistMode, setChecklistMode] = useState<boolean>(false);
  const [verifiedPieceIds, setVerifiedPieceIds] = useState<Record<string, boolean>>({});

  if (!isOpen || !item) return null;

  const piezas = item.piezas || [];
  const totalPiezasCount = piezas.reduce((acc, p) => acc + (p.cantidad || 1), 0);

  // Categories in this set
  const categories = Array.from(new Set(piezas.map(p => p.categoriaPieza).filter(Boolean))) as string[];

  // Filtered pieces
  const filteredPieces = piezas.filter(p => {
    if (filterCategory !== 'todos' && p.categoriaPieza !== filterCategory) return false;
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      return (
        p.nombre.toLowerCase().includes(q) ||
        p.codigo.toLowerCase().includes(q) ||
        (p.observaciones || '').toLowerCase().includes(q) ||
        (p.posicionBandeja || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const verifiedCount = piezas.filter(p => verifiedPieceIds[p.id]).length;
  const isAllVerified = totalPiezasCount > 0 && verifiedCount === piezas.length;

  const handleToggleVerify = (pieceId: string) => {
    setVerifiedPieceIds(prev => ({
      ...prev,
      [pieceId]: !prev[pieceId]
    }));
  };

  const handleVerifyAll = () => {
    const next: Record<string, boolean> = {};
    piezas.forEach(p => { next[p.id] = true; });
    setVerifiedPieceIds(next);
  };

  const handleResetVerification = () => {
    setVerifiedPieceIds({});
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 my-4">
        
        {/* Header - Clinical Dark Navy */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-900/40">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-800">
                  {item.sku}
                </span>
                <span className="text-xs text-slate-300 font-semibold">
                  Hoja de Conteo Quirúrgico e Instrumental
                </span>
              </div>
              <h2 className="text-base font-extrabold text-white mt-0.5">
                {item.nombre}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Set Summary Strip */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px] font-medium">Total de Piezas en el Set</span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-xl font-black text-slate-900 font-mono tabular-nums">{totalPiezasCount}</span>
              <span className="text-slate-500 font-medium">piezas desglosadas</span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px] font-medium">Sets Físicos en Almacén</span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-xl font-black text-teal-700 font-mono tabular-nums">{item.stockActual}</span>
              <span className="text-slate-500 font-medium">cajas completas</span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px] font-medium">Ubicación en Bodega</span>
            <div className="text-slate-800 font-semibold truncate flex items-center space-x-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{item.ubicacion}</span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px] font-medium">Lote / Fabricante</span>
            <div className="text-slate-800 font-semibold truncate mt-0.5 font-mono">
              {item.lote} · {item.fabricante}
            </div>
          </div>
        </div>

        {/* Verification Checklist Bar */}
        <div className="px-6 py-3 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setChecklistMode(!checklistMode)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
                checklistMode
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{checklistMode ? 'Modo Inspección Activo' : 'Activar Conteo Quirúrgico'}</span>
            </button>

            {checklistMode && (
              <div className="flex items-center space-x-2">
                <span className="text-slate-600 font-medium">
                  Verificadas: <strong className="text-slate-900 font-mono tabular-nums">{verifiedCount}</strong> / {piezas.length}
                </span>
                <button
                  type="button"
                  onClick={handleVerifyAll}
                  className="px-2 py-1 text-[11px] bg-teal-50 hover:bg-teal-100 text-teal-800 rounded font-semibold border border-teal-200 cursor-pointer"
                >
                  Marcar Todas
                </button>
                <button
                  type="button"
                  onClick={handleResetVerification}
                  className="px-2 py-1 text-[11px] text-slate-500 hover:text-slate-800 rounded font-medium hover:bg-slate-100 cursor-pointer flex items-center space-x-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reiniciar</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick Search & Category Filter */}
          <div className="flex items-center space-x-2 flex-1 sm:flex-initial justify-end">
            <div className="relative w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar pieza..."
                className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:bg-white"
              />
            </div>

            {categories.length > 0 && (
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
              >
                <option value="todos">Todas las categorías</option>
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Piece List Table */}
        <div className="max-h-[50vh] overflow-y-auto">
          {piezas.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              <Package className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="font-semibold text-slate-700">Este set no tiene piezas registradas aún.</p>
              <p className="text-[11px] mt-1 text-slate-500">
                Haz clic en "Editar Desglose de Piezas" para agregar el instrumental que lo conforma o cargar una plantilla predefinida.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEditSet(item);
                }}
                className="mt-3 px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold text-xs transition-colors cursor-pointer"
              >
                Configurar Piezas del Set
              </button>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/90 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider sticky top-0 z-10 backdrop-blur-xs">
                  {checklistMode && (
                    <th className="py-2.5 px-3 w-10 text-center">Conteo</th>
                  )}
                  <th className="py-2.5 px-4 w-12 text-center">#</th>
                  <th className="py-2.5 px-4 w-28">Código</th>
                  <th className="py-2.5 px-4">Instrumental / Pieza</th>
                  <th className="py-2.5 px-3 w-20 text-center">Cant.</th>
                  <th className="py-2.5 px-4">Categoría / Tipo</th>
                  <th className="py-2.5 px-4">Ubicación en Bandeja</th>
                  <th className="py-2.5 px-3 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPieces.map((pieza, idx) => {
                  const isVerified = verifiedPieceIds[pieza.id];

                  return (
                    <tr 
                      key={pieza.id} 
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isVerified ? 'bg-teal-50/40' : ''
                      }`}
                    >
                      {checklistMode && (
                        <td className="py-2 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={!!isVerified}
                            onChange={() => handleToggleVerify(pieza.id)}
                            className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500 cursor-pointer"
                          />
                        </td>
                      )}
                      
                      <td className="py-2.5 px-4 text-center font-mono text-slate-400 font-medium tabular-nums">
                        {idx + 1}
                      </td>

                      <td className="py-2.5 px-4 font-mono font-bold text-slate-800">
                        <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[11px] border border-slate-200">
                          {pieza.codigo}
                        </span>
                      </td>

                      <td className="py-2.5 px-4">
                        <div className="font-bold text-slate-900">
                          {pieza.nombre}
                        </div>
                        {pieza.observaciones && (
                          <div className="text-[11px] text-slate-500 italic mt-0.5">
                            {pieza.observaciones}
                          </div>
                        )}
                      </td>

                      <td className="py-2.5 px-3 text-center font-bold text-slate-900 font-mono tabular-nums">
                        {pieza.cantidad}
                      </td>

                      <td className="py-2.5 px-4 text-slate-600 text-[11px]">
                        {pieza.categoriaPieza || '-'}
                      </td>

                      <td className="py-2.5 px-4 text-slate-500 text-[11px]">
                        {pieza.posicionBandeja || 'Bandeja Principal'}
                      </td>

                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          pieza.estadoPieza === 'completa' || pieza.estadoPieza === 'esterilizada'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : pieza.estadoPieza === 'faltante'
                            ? 'bg-rose-50 text-rose-800 border border-rose-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          {pieza.estadoPieza === 'completa' ? 'Completa' :
                           pieza.estadoPieza === 'esterilizada' ? 'Esterilizada' :
                           pieza.estadoPieza === 'faltante' ? 'Faltante' : 'Revisión'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-slate-500 flex items-center space-x-1.5">
            <span>Última revisión:</span>
            <strong className="text-slate-800">{item.fechaUltimaRevisionPiezas || item.ultimaActualizacion}</strong>
            {item.responsableRevision && (
              <span>por {item.responsableRevision}</span>
            )}
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
              title="Imprimir hoja de conteo para control en quirófano o despacho"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Imprimir Hoja de Conteo</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onEditSet(item);
              }}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-teal-400" />
              <span>Editar Desglose de Piezas</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
