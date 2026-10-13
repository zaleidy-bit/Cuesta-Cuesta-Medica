import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  ClipboardCheck, 
  Building2,
  Package
} from 'lucide-react';
import { InventoryItem } from '../types/inventory';
import { getCategoryLabel } from '../utils/inventoryUtils';

interface SurgicalRemissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: InventoryItem[];
}

export const SurgicalRemissionModal: React.FC<SurgicalRemissionModalProps> = ({
  isOpen,
  onClose,
  items
}) => {
  const [cliente, setCliente] = useState('Distribuidora Médica del Valle');
  const [identificacion, setIdentificacion] = useState('NIT 900.823.140-1');
  const [destino, setDestino] = useState('Clínica Especializada del Prado - Quirófano 3');
  const [numeroOrden, setNumeroOrden] = useState('ORD-2026-442');
  const [fechaDespacho, setFechaDespacho] = useState(new Date().toISOString().split('T')[0]);
  const [responsableAlmacen, setResponsableAlmacen] = useState('Javier Domínguez (Jefe de Almacén)');

  // Selected item IDs for the remission
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([
    'set-hom-001',
    'art-hom-001',
    'art-hom-002',
    'ost-002'
  ]);

  if (!isOpen) return null;

  const toggleItemSelection = (id: string) => {
    if (selectedItemIds.includes(id)) {
      setSelectedItemIds(selectedItemIds.filter(i => i !== id));
    } else {
      setSelectedItemIds([...selectedItemIds, id]);
    }
  };

  const selectedItems = items.filter(i => selectedItemIds.includes(i.id));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 my-6">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white">
              <ClipboardCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Remisión y Despacho Quirúrgico</h3>
              <p className="text-xs text-slate-400">Comprobante oficial de entrega y control de instrumental por sets</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Remission Document Content */}
        <div className="p-8 max-h-[80vh] overflow-y-auto space-y-5 text-xs text-slate-800 print:max-h-none print:overflow-visible print:p-4">
          
          {/* Official Letterhead */}
          <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
                <span>CUESTA CUESTA MÉDICA</span>
              </div>
              <div className="text-xs text-slate-500 font-semibold">
                División de Implantes Ortopédicos, Instrumental Quirúrgico y Equipos Médicos
              </div>
              <div className="text-[11px] text-slate-400">
                Artroscopia · Osteosíntesis · Reemplazo Articular (Cadera y Rodilla)
              </div>
            </div>

            <div className="text-left sm:text-right bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Remisión de Entrega N°</div>
              <div className="text-lg font-black text-teal-800 font-mono">REM-CCM-8842</div>
              <div className="text-[10px] text-slate-500 font-mono">Fecha: {fechaDespacho}</div>
            </div>
          </div>

          {/* Client & Dispatch Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Institución / Cliente</label>
              <input
                type="text"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                className="w-full bg-white px-2 py-1.5 rounded border border-slate-300 font-semibold text-xs mt-0.5"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase">NIT / Documento</label>
              <input
                type="text"
                value={identificacion}
                onChange={(e) => setIdentificacion(e.target.value)}
                className="w-full bg-white px-2 py-1.5 rounded border border-slate-300 font-semibold text-xs mt-0.5"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Destino / Procedimiento</label>
              <input
                type="text"
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
                className="w-full bg-white px-2 py-1.5 rounded border border-slate-300 font-semibold text-xs mt-0.5"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Orden / Caso Quirúrgico</label>
              <input
                type="text"
                value={numeroOrden}
                onChange={(e) => setNumeroOrden(e.target.value)}
                className="w-full bg-white px-2 py-1.5 rounded border border-slate-300 font-bold text-teal-800 text-xs mt-0.5 font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Fecha Despacho</label>
              <input
                type="date"
                value={fechaDespacho}
                onChange={(e) => setFechaDespacho(e.target.value)}
                className="w-full bg-white px-2 py-1.5 rounded border border-slate-300 font-semibold text-xs mt-0.5 font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Responsable Almacén</label>
              <input
                type="text"
                value={responsableAlmacen}
                onChange={(e) => setResponsableAlmacen(e.target.value)}
                className="w-full bg-white px-2 py-1.5 rounded border border-slate-300 font-semibold text-xs mt-0.5"
              />
            </div>
          </div>

          {/* Item Selector (Hidden during print) */}
          <div className="print:hidden bg-teal-50/60 p-3 rounded-xl border border-teal-200">
            <div className="font-bold text-teal-950 mb-1.5 flex items-center justify-between text-xs">
              <span>Seleccione los sets e instrumental a despachar ({selectedItems.length} seleccionados):</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5 max-h-40 overflow-y-auto pr-1">
              {items.map(item => {
                const isSelected = selectedItemIds.includes(item.id);
                const piecesCount = item.piezas?.length || item.totalPiezas || 0;
                return (
                  <label 
                    key={item.id}
                    className={`flex items-center space-x-2 p-1.5 rounded text-[11px] cursor-pointer transition-colors ${
                      isSelected ? 'bg-teal-100 text-teal-950 font-semibold' : 'bg-white hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleItemSelection(item.id)}
                      className="rounded text-teal-600 focus:ring-teal-500"
                    />
                    <span className="truncate">
                      {item.sku} · {item.nombre} {item.esSet ? `(${piecesCount} pz)` : ''}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Dispatched Items Official Table */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
              Detalle de Sets y Mercancía Despachada
            </h4>
            <div className="border border-slate-300 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 border-b border-slate-300 text-[10px] uppercase font-bold text-slate-700">
                  <tr>
                    <th className="py-2 px-3">Código / SKU</th>
                    <th className="py-2 px-3">Descripción / Instrumental</th>
                    <th className="py-2 px-3">Desglose de Piezas</th>
                    <th className="py-2 px-3">Lote</th>
                    <th className="py-2 px-3 text-center">Cant</th>
                    <th className="py-2 px-3 text-center">Conteo Verificado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {selectedItems.map((item) => {
                    const cat = getCategoryLabel(item);
                    const piecesCount = item.piezas?.length || item.totalPiezas || 0;

                    return (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                          {item.sku}
                        </td>
                        <td className="py-2 px-3 font-semibold text-slate-900">
                          {item.nombre}
                          <span className="block text-[10px] text-slate-500 font-normal">
                            Fabricante: {item.fabricante} {item.material ? `· Material: ${item.material}` : ''}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-[11px] text-slate-700">
                          {item.esSet ? (
                            <span className="font-bold text-teal-800">
                              📦 Set con {piecesCount} piezas
                            </span>
                          ) : (
                            <span className="text-slate-500">Ítem individual</span>
                          )}
                        </td>
                        <td className="py-2 px-3 font-mono text-slate-800 whitespace-nowrap">
                          {item.lote}
                        </td>
                        <td className="py-2 px-3 text-center font-bold text-slate-900 font-mono">
                          1 {item.unidadMedida}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span className="inline-block w-4 h-4 border border-slate-400 rounded"></span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Signatures & Acceptance Blocks */}
          <div className="pt-8 grid grid-cols-2 gap-8 border-t border-slate-200">
            <div className="text-center">
              <div className="border-b border-slate-400 pb-1 mb-1 font-semibold text-slate-800">
                {responsableAlmacen}
              </div>
              <div className="text-[10px] text-slate-500 uppercase">
                Entregado por: Almacén Cuesta Cuesta Médica
              </div>
            </div>

            <div className="text-center">
              <div className="border-b border-slate-400 pb-1 mb-1 font-semibold text-slate-800 text-slate-400">
                &nbsp;
              </div>
              <div className="text-[10px] text-slate-500 uppercase">
                Recibido a Conformidad por: Instrumentador(a) / Quirófano
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="text-[10px] text-slate-400 text-center pt-1">
            Documento de control quirúrgico de CUESTA CUESTA MÉDICA. Todos los sets e instrumental fueron contados e inspeccionados físicamente previo al despacho.
          </div>

        </div>

      </div>
    </div>
  );
};
