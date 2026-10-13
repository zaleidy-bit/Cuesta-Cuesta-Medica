import React, { useState } from 'react';
import { X, ArrowUpDown, Building, CheckCircle } from 'lucide-react';
import { InventoryItem, StockMovement, ItemStatus } from '../types/inventory';

interface MovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem | null;
  onConfirmMovement: (movement: StockMovement, newStock: number, newStatus?: ItemStatus, reservationData?: any) => void;
}

export const MovementModal: React.FC<MovementModalProps> = ({
  isOpen,
  onClose,
  item,
  onConfirmMovement
}) => {
  if (!isOpen || !item) return null;

  const [tipo, setTipo] = useState<StockMovement['tipo']>('salida_venta');
  const [cantidad, setCantidad] = useState<number>(1);
  const [responsable, setResponsable] = useState<string>('Jefe de Almacén');
  const [clienteODestino, setClienteODestino] = useState<string>('Cliente / Institución Comercial');
  const [motivo, setMotivo] = useState<string>('Despacho comercial por venta');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let newStock = item.stockActual;
    let newStatus: ItemStatus = item.estado;
    let reservationData = undefined;

    if (tipo === 'entrada') {
      newStock = item.stockActual + cantidad;
      if (item.estado === 'agotado' && newStock > 0) {
        newStatus = 'disponible';
      }
    } else if (tipo === 'salida_venta') {
      newStock = Math.max(0, item.stockActual - cantidad);
      if (newStock === 0) {
        newStatus = 'agotado';
      }
    } else if (tipo === 'envio_consignacion') {
      newStatus = 'en_consignacion';
    } else if (tipo === 'retorno_consignacion') {
      newStatus = 'disponible';
    } else if (tipo === 'ajuste') {
      newStock = cantidad;
      if (newStock === 0) newStatus = 'agotado';
      else if (item.estado === 'agotado') newStatus = 'disponible';
    }

    const movement: StockMovement = {
      id: `mov-${Date.now()}`,
      itemId: item.id,
      itemNombre: item.nombre,
      sku: item.sku,
      tipo,
      cantidad,
      fecha: new Date().toLocaleString(),
      responsable,
      clienteODestino,
      motivo,
      lote: item.lote
    };

    onConfirmMovement(movement, newStock, newStatus, reservationData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center">
              <ArrowUpDown className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Registrar Movimiento de Almacén</h3>
              <p className="text-xs text-slate-400">Control interno de entradas, salidas y consignaciones</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item Info Summary */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <div>
            <span className="font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              {item.sku}
            </span>
            <h4 className="font-bold text-slate-900 mt-1">{item.nombre}</h4>
            <span className="text-slate-500">Lote: <strong>{item.lote}</strong> | Ubicación: {item.ubicacion}</span>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-slate-500">Stock Actual</div>
            <div className="text-lg font-black text-slate-800">{item.stockActual} {item.unidadMedida}</div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Tipo de movimiento */}
          <div>
            <label className="block text-slate-700 font-bold mb-1.5">
              Tipo de Operación:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setTipo('salida_venta');
                  setMotivo('Despacho comercial por venta');
                }}
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                  tipo === 'salida_venta'
                    ? 'bg-blue-50 border-blue-400 text-blue-900 font-bold ring-1 ring-blue-300'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="font-semibold text-xs">📦 Salida por Venta</div>
                <div className="text-[10px] text-slate-500 font-normal">Despacho de mercancía vendida</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTipo('entrada');
                  setMotivo('Ingreso por recepción de pedido o importación');
                }}
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                  tipo === 'entrada'
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold ring-1 ring-emerald-300'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="font-semibold text-xs">📥 Entrada de Mercancía</div>
                <div className="text-[10px] text-slate-500 font-normal">Recepción de compras a proveedor</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTipo('envio_consignacion');
                  setMotivo('Envío a consignación comercial');
                }}
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                  tipo === 'envio_consignacion'
                    ? 'bg-cyan-50 border-cyan-400 text-cyan-900 font-bold ring-1 ring-cyan-300'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="font-semibold text-xs">🔷 Envío a Consignación</div>
                <div className="text-[10px] text-slate-500 font-normal">Colocación con distribuidor o cliente</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTipo('ajuste');
                  setMotivo('Ajuste de inventario por conteo físico');
                }}
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                  tipo === 'ajuste'
                    ? 'bg-amber-50 border-amber-400 text-amber-900 font-bold ring-1 ring-amber-300'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="font-semibold text-xs">⚙️ Ajuste de Stock</div>
                <div className="text-[10px] text-slate-500 font-normal">Corrección por conteo físico en bodega</div>
              </button>
            </div>
          </div>

          {/* Cantidad */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              {tipo === 'ajuste' ? 'Nuevo Stock Total:' : `Cantidad de ${item.unidadMedida}:`}
            </label>
            <input
              type="number"
              min={tipo === 'ajuste' ? '0' : '1'}
              value={cantidad}
              onChange={(e) => setCantidad(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-sm"
            />
          </div>

          {/* Cliente o Destino */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Cliente, Proveedor o Destino:
            </label>
            <input
              type="text"
              value={clienteODestino}
              onChange={(e) => setClienteODestino(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
              placeholder="Ej. Distribuidora del Norte / Pedido #1024"
            />
          </div>

          {/* Responsable */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Responsable en Almacén:
            </label>
            <input
              type="text"
              value={responsable}
              onChange={(e) => setResponsable(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
              placeholder="Nombre del encargado de inventario"
            />
          </div>

          {/* Motivo */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Motivo u Observación:
            </label>
            <input
              type="text"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
            />
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-semibold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg shadow-sm cursor-pointer"
            >
              Confirmar Movimiento
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
