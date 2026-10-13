import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Cpu, 
  Activity, 
  Bone, 
  Sparkles,
  Package,
  Plus,
  Trash2,
  Copy,
  ChevronDown,
  Layers,
  FileCheck
} from 'lucide-react';
import { 
  InventoryItem, 
  PrimaryCategory, 
  InstrumentalCategory, 
  ArtroscopiaSubcategory,
  ReemplazoSubcategory, 
  ItemStatus,
  SetPiece 
} from '../types/inventory';
import { SURGICAL_SET_TEMPLATES } from '../data/setTemplates';

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<InventoryItem>) => void;
  initialItem?: InventoryItem | null;
  defaultCategory?: {
    primary: PrimaryCategory;
    instrumental?: InstrumentalCategory;
    reemplazo?: ReemplazoSubcategory;
    artroscopia?: ArtroscopiaSubcategory;
  };
  forceSetMode?: boolean;
}

export const ItemModal: React.FC<ItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialItem,
  defaultCategory,
  forceSetMode = false
}) => {
  const [formData, setFormData] = useState<Partial<InventoryItem>>({
    sku: '',
    nombre: '',
    descripcion: '',
    primaryCategory: 'instrumental',
    instrumentalCategory: 'artroscopia',
    artroscopiaSubcategory: 'hombro',
    reemplazoSubcategory: undefined,
    subtipo: 'Set / Caja Quirúrgica',
    esSet: true,
    totalPiezas: 0,
    piezas: [],
    stockActual: 1,
    stockMinimo: 1,
    unidadMedida: 'sets',
    ubicacion: 'Bodega Principal - Estante Instrumental B3',
    lote: '',
    numeroSerie: '',
    registroSanitario: '',
    fabricante: 'Arthrex',
    material: 'Acero Quirúrgico Alemán 316L',
    estado: 'disponible',
    precioVenta: 0,
    costoUnitario: 0,
    notas: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newPieceCode, setNewPieceCode] = useState('');
  const [newPieceName, setNewPieceName] = useState('');
  const [newPieceQty, setNewPieceQty] = useState(1);
  const [newPieceCategory, setNewPieceCategory] = useState('Corte y Disección');
  const [newPieceTray, setNewPieceTray] = useState('Bandeja Superior');

  useEffect(() => {
    if (initialItem) {
      setFormData(initialItem);
    } else {
      const isSet = forceSetMode || (defaultCategory?.primary === 'instrumental' || !defaultCategory);
      const randomRef = Math.floor(1000 + Math.random() * 9000);

      setFormData({
        sku: isSet ? `SET-HOM-${randomRef}` : `REF-${randomRef}`,
        nombre: isSet ? 'Set de Artroscopia de Hombro (23 Piezas)' : '',
        descripcion: isSet ? 'Caja completa de instrumental para artroscopia de hombro.' : '',
        primaryCategory: defaultCategory?.primary || 'instrumental',
        instrumentalCategory: defaultCategory?.instrumental || 'artroscopia',
        artroscopiaSubcategory: defaultCategory?.artroscopia || 'hombro',
        reemplazoSubcategory: defaultCategory?.reemplazo,
        subtipo: isSet ? 'Set / Caja Quirúrgica' : 'Implante / Instrumental',
        esSet: isSet,
        totalPiezas: isSet ? 23 : 0,
        piezas: isSet ? SURGICAL_SET_TEMPLATES[0].piezas.map((p, i) => ({ ...p, id: `pz-${Date.now()}-${i}` })) : [],
        stockActual: 1,
        stockMinimo: 1,
        unidadMedida: isSet ? 'sets' : 'unidades',
        ubicacion: 'Bodega Principal - Estante Instrumental B3',
        lote: `LT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        numeroSerie: '',
        registroSanitario: 'INVIMA 2024DM-',
        fabricante: 'Arthrex',
        material: 'Acero Inoxidable Quirúrgico',
        estado: 'disponible',
        precioVenta: isSet ? 8500 : 0,
        costoUnitario: isSet ? 5500 : 0,
        notas: ''
      });
    }
    setErrors({});
  }, [initialItem, defaultCategory, isOpen, forceSetMode]);

  if (!isOpen) return null;

  // Piezas calculation
  const piezasList = formData.piezas || [];
  const calculatedTotalPiezas = piezasList.reduce((acc, p) => acc + (p.cantidad || 1), 0);

  // Quick template loading
  const handleLoadTemplate = (templateId: string) => {
    const tpl = SURGICAL_SET_TEMPLATES.find(t => t.id === templateId);
    if (!tpl) return;

    let instrumentalCat: InstrumentalCategory = 'artroscopia';
    let artroscopiaSub: ArtroscopiaSubcategory | undefined = undefined;
    let reemplazoSub: ReemplazoSubcategory | undefined = undefined;

    if (tpl.categoria === 'artroscopia_hombro') {
      instrumentalCat = 'artroscopia';
      artroscopiaSub = 'hombro';
    } else if (tpl.categoria === 'artroscopia_rodilla') {
      instrumentalCat = 'artroscopia';
      artroscopiaSub = 'rodilla';
    } else if (tpl.categoria === 'osteosintesis') {
      instrumentalCat = 'osteosintesis';
    } else if (tpl.categoria === 'cadera') {
      instrumentalCat = 'reemplazo_articular';
      reemplazoSub = 'cadera';
    } else if (tpl.categoria === 'rodilla') {
      instrumentalCat = 'reemplazo_articular';
      reemplazoSub = 'rodilla';
    }

    const newPieces: SetPiece[] = tpl.piezas.map((p, idx) => ({
      ...p,
      id: `pz-${Date.now()}-${idx}`
    }));

    setFormData(prev => ({
      ...prev,
      nombre: tpl.nombre,
      descripcion: tpl.descripcion,
      primaryCategory: 'instrumental',
      instrumentalCategory: instrumentalCat,
      artroscopiaSubcategory: artroscopiaSub,
      reemplazoSubcategory: reemplazoSub,
      subtipo: 'Set / Caja Quirúrgica',
      esSet: true,
      totalPiezas: tpl.totalPiezas,
      piezas: newPieces,
      unidadMedida: 'sets'
    }));
  };

  // Add piece to set
  const handleAddPiece = () => {
    if (!newPieceName.trim()) {
      alert('Por favor escribe el nombre de la pieza de instrumental.');
      return;
    }

    const code = newPieceCode.trim() || `PZ-${piezasList.length + 1}`;
    const newPiece: SetPiece = {
      id: `pz-${Date.now()}-${Math.random()}`,
      codigo: code,
      nombre: newPieceName.trim(),
      cantidad: Math.max(1, newPieceQty),
      categoriaPieza: newPieceCategory,
      posicionBandeja: newPieceTray || 'Bandeja Principal',
      estadoPieza: 'completa'
    };

    const updatedPiezas = [...piezasList, newPiece];
    const newTotal = updatedPiezas.reduce((acc, p) => acc + (p.cantidad || 1), 0);

    setFormData(prev => ({
      ...prev,
      piezas: updatedPiezas,
      totalPiezas: newTotal
    }));

    setNewPieceName('');
    setNewPieceCode('');
    setNewPieceQty(1);
  };

  // Remove piece
  const handleRemovePiece = (id: string) => {
    const updatedPiezas = piezasList.filter(p => p.id !== id);
    const newTotal = updatedPiezas.reduce((acc, p) => acc + (p.cantidad || 1), 0);
    setFormData(prev => ({
      ...prev,
      piezas: updatedPiezas,
      totalPiezas: newTotal
    }));
  };

  // Update piece quantity
  const handleUpdatePieceQty = (id: string, delta: number) => {
    const updatedPiezas = piezasList.map(p => {
      if (p.id === id) {
        const nextQty = Math.max(1, p.cantidad + delta);
        return { ...p, cantidad: nextQty };
      }
      return p;
    });
    const newTotal = updatedPiezas.reduce((acc, p) => acc + (p.cantidad || 1), 0);
    setFormData(prev => ({
      ...prev,
      piezas: updatedPiezas,
      totalPiezas: newTotal
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.sku?.trim()) newErrors.sku = 'El código o SKU es obligatorio';
    if (!formData.nombre?.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!formData.lote?.trim()) newErrors.lote = 'El número de lote es obligatorio';
    if (!formData.fabricante?.trim()) newErrors.fabricante = 'Indique el fabricante';
    if (formData.stockActual === undefined || formData.stockActual < 0) {
      newErrors.stockActual = 'El stock no puede ser negativo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const dataToSave = {
      ...formData,
      totalPiezas: formData.esSet ? calculatedTotalPiezas : undefined,
      piezas: formData.esSet ? piezasList : undefined
    };

    onSave(dataToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 my-6">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold">
              {formData.esSet ? <Package className="w-5 h-5" /> : <Cpu className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">
                {initialItem 
                  ? (formData.esSet ? 'Editar Set Quirúrgico e Instrumental' : 'Editar Ítem de Inventario')
                  : (formData.esSet ? 'Registrar Nuevo Set Quirúrgico con Piezas' : 'Registrar Nuevo Ítem')}
              </h2>
              <p className="text-xs text-slate-400">
                CUESTA CUESTA MÉDICA · Control de Instrumental por Cajas y Piezas
              </p>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 max-h-[82vh] overflow-y-auto space-y-5 text-xs">
          
          {/* Tipo de Registro: Set con Piezas vs Ítem Individual */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <label className="block text-slate-700 font-bold mb-2">
              Modalidad de Registro en Inventario:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label 
                className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  formData.esSet
                    ? 'bg-teal-50 border-teal-400 ring-2 ring-teal-200 text-teal-950 font-bold'
                    : 'bg-white border-slate-200 hover:bg-slate-100'
                }`}
              >
                <input
                  type="radio"
                  name="esSet"
                  checked={!!formData.esSet}
                  onChange={() => setFormData({ 
                    ...formData, 
                    esSet: true, 
                    primaryCategory: 'instrumental',
                    unidadMedida: 'sets',
                    subtipo: 'Set / Caja Quirúrgica' 
                  })}
                  className="sr-only"
                />
                <Package className="w-5 h-5 text-teal-600 mt-0.5 shrink-0" />
                <div>
                  <div className="text-sm font-bold">Set Quirúrgico (Con listado de instrumental)</div>
                  <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                    Caja o set compuesto por múltiples piezas (ej. Set de Artroscopia de Hombro con 23 piezas).
                  </div>
                </div>
              </label>

              <label 
                className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  !formData.esSet
                    ? 'bg-slate-100 border-slate-400 ring-2 ring-slate-200 text-slate-900 font-bold'
                    : 'bg-white border-slate-200 hover:bg-slate-100'
                }`}
              >
                <input
                  type="radio"
                  name="esSet"
                  checked={!formData.esSet}
                  onChange={() => setFormData({ 
                    ...formData, 
                    esSet: false, 
                    unidadMedida: 'unidades',
                    subtipo: 'Implante / Instrumental' 
                  })}
                  className="sr-only"
                />
                <Cpu className="w-5 h-5 text-slate-600 mt-0.5 shrink-0" />
                <div>
                  <div className="text-sm font-bold">Ítem Individual o Equipo Médico</div>
                  <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                    Implantes individuales (tornillos, arpones, prótesis) o equipos médicos independientes.
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Plantillas Quirúrgicas Rápidas (Only if Set) */}
          {formData.esSet && (
            <div className="bg-teal-50/70 p-3.5 rounded-xl border border-teal-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-teal-950 flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <span>Cargar Plantilla Estándar de Instrumental Quirúrgico:</span>
                </span>
                <span className="text-[11px] text-teal-800">1 clic para prellenar todas las piezas</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                {SURGICAL_SET_TEMPLATES.map(tpl => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => handleLoadTemplate(tpl.id)}
                    className="p-2 text-left bg-white hover:bg-teal-100/60 border border-teal-300 rounded-lg transition-all cursor-pointer group shadow-2xs"
                  >
                    <div className="font-bold text-teal-950 text-[11px] group-hover:text-teal-800 leading-tight">
                      {tpl.nombre}
                    </div>
                    <div className="text-[10px] text-teal-700 mt-0.5">
                      {tpl.totalPiezas} piezas incluidas
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 1. Categorización */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Línea Principal
              </label>
              <select
                value={formData.primaryCategory}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  primaryCategory: e.target.value as PrimaryCategory,
                  instrumentalCategory: e.target.value === 'instrumental' ? 'artroscopia' : undefined
                })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-medium"
              >
                <option value="instrumental">Instrumental e Implantes</option>
                <option value="equipos_medicos">Equipos Médicos</option>
              </select>
            </div>

            {formData.primaryCategory === 'instrumental' && (
              <>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Categoría de Instrumental
                  </label>
                  <select
                    value={formData.instrumentalCategory || 'artroscopia'}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      instrumentalCategory: e.target.value as InstrumentalCategory,
                      artroscopiaSubcategory: e.target.value === 'artroscopia' ? 'hombro' : undefined,
                      reemplazoSubcategory: e.target.value === 'reemplazo_articular' ? 'cadera' : undefined
                    })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-medium"
                  >
                    <option value="artroscopia">Artroscopia</option>
                    <option value="osteosintesis">Osteosíntesis</option>
                    <option value="reemplazo_articular">Reemplazo Articular</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Subcategoría Específica
                  </label>
                  {formData.instrumentalCategory === 'artroscopia' ? (
                    <select
                      value={formData.artroscopiaSubcategory || 'hombro'}
                      onChange={(e) => setFormData({ ...formData, artroscopiaSubcategory: e.target.value as ArtroscopiaSubcategory })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-medium"
                    >
                      <option value="hombro">Hombro</option>
                      <option value="rodilla">Rodilla</option>
                      <option value="otros">Otros / General</option>
                    </select>
                  ) : formData.instrumentalCategory === 'reemplazo_articular' ? (
                    <select
                      value={formData.reemplazoSubcategory || 'cadera'}
                      onChange={(e) => setFormData({ ...formData, reemplazoSubcategory: e.target.value as ReemplazoSubcategory })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-medium"
                    >
                      <option value="cadera">Cadera</option>
                      <option value="rodilla">Rodilla</option>
                    </select>
                  ) : (
                    <div className="py-2 px-3 text-slate-400 bg-slate-100 rounded-lg font-medium">
                      Osteosíntesis General
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* 2. Información del Set o Ítem */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Código / SKU *
              </label>
              <input
                type="text"
                value={formData.sku || ''}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                placeholder="Ej. SET-ART-HOM23"
              />
              {errors.sku && <p className="text-rose-600 text-[11px] mt-1">{errors.sku}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">
                Nombre del Set o Ítem *
              </label>
              <input
                type="text"
                value={formData.nombre || ''}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                placeholder="Ej. Set de Artroscopia de Hombro (23 Piezas)"
              />
              {errors.nombre && <p className="text-rose-600 text-[11px] mt-1">{errors.nombre}</p>}
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Descripción y Especificaciones Técnicas
            </label>
            <textarea
              rows={2}
              value={formData.descripcion || ''}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
              placeholder="Descripción del set, indicaciones quirúrgicas, compatibilidad..."
            />
          </div>

          {/* ======================================================== */}
          {/* SECCIÓN CRÍTICA: DESGLOSE DE PIEZAS DEL SET */}
          {/* ======================================================== */}
          {formData.esSet && (
            <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 space-y-3.5">
              
              {/* Header del Desglose de Piezas */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                <div className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-teal-400" />
                  <div>
                    <h3 className="text-sm font-extrabold text-white">
                      Desglose de Instrumental del Set ({calculatedTotalPiezas} piezas)
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Cada set se compone de su listado de instrumental. Agrega, edita o elimina piezas individuales.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold bg-teal-950 text-teal-300 border border-teal-700 px-2.5 py-1 rounded-md">
                    Total: {calculatedTotalPiezas} piezas en el set
                  </span>
                  {piezasList.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, piezas: [], totalPiezas: 0 })}
                      className="text-[11px] text-rose-400 hover:text-rose-300 px-2 py-1 rounded border border-rose-900/60 hover:bg-rose-950/40 cursor-pointer"
                    >
                      Limpiar piezas
                    </button>
                  )}
                </div>
              </div>

              {/* Formulario rápido para añadir una pieza */}
              <div className="bg-slate-800/90 p-3 rounded-lg border border-slate-700 grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 text-[10px] uppercase font-bold mb-1">Código</label>
                  <input
                    type="text"
                    value={newPieceCode}
                    onChange={(e) => setNewPieceCode(e.target.value)}
                    placeholder={`HOM-${piezasList.length + 1}`}
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-600 rounded text-white font-mono"
                  />
                </div>

                <div className="sm:col-span-5">
                  <label className="block text-slate-300 text-[10px] uppercase font-bold mb-1">Nombre del Instrumental *</label>
                  <input
                    type="text"
                    value={newPieceName}
                    onChange={(e) => setNewPieceName(e.target.value)}
                    placeholder="Ej. Palpador artroscópico graduado 90°"
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-600 rounded text-white font-medium"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddPiece();
                      }
                    }}
                  />
                </div>

                <div className="sm:col-span-1">
                  <label className="block text-slate-300 text-[10px] uppercase font-bold mb-1">Cant.</label>
                  <input
                    type="number"
                    min="1"
                    value={newPieceQty}
                    onChange={(e) => setNewPieceQty(parseInt(e.target.value) || 1)}
                    className="w-full px-2 py-1.5 bg-slate-900 border border-slate-600 rounded text-white font-bold text-center font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-300 text-[10px] uppercase font-bold mb-1">Tipo / Categoría</label>
                  <select
                    value={newPieceCategory}
                    onChange={(e) => setNewPieceCategory(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-900 border border-slate-600 rounded text-white"
                  >
                    <option value="Palpación">Palpación</option>
                    <option value="Corte y Disección">Corte y Disección</option>
                    <option value="Tracción y Agarre">Tracción y Agarre</option>
                    <option value="Sutura y Pasaje">Sutura y Pasaje</option>
                    <option value="Acceso y Cánulas">Acceso y Cánulas</option>
                    <option value="Guías y Brocas">Guías y Brocas</option>
                    <option value="Bandeja y Resguardo">Bandeja</option>
                  </select>
                </div>

                <div className="sm:col-span-2 flex items-end">
                  <button
                    type="button"
                    onClick={handleAddPiece}
                    className="w-full px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Añadir</span>
                  </button>
                </div>
              </div>

              {/* Tabla de piezas registradas */}
              <div className="max-h-56 overflow-y-auto rounded-lg border border-slate-800 bg-slate-950">
                {piezasList.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 text-xs">
                    No hay piezas añadidas. Usa los botones de plantilla arriba o escribe piezas con el botón "Añadir".
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-900 border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase">
                        <th className="py-2 px-3 w-8 text-center">#</th>
                        <th className="py-2 px-3 w-24">Código</th>
                        <th className="py-2 px-3">Instrumental</th>
                        <th className="py-2 px-3 w-20 text-center">Cant.</th>
                        <th className="py-2 px-3">Categoría</th>
                        <th className="py-2 px-3 w-12 text-center"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {piezasList.map((p, idx) => (
                        <tr key={p.id} className="hover:bg-slate-900/60 transition-colors">
                          <td className="py-1.5 px-3 text-center text-slate-500 text-[11px] font-mono">
                            {idx + 1}
                          </td>
                          <td className="py-1.5 px-3 font-bold text-teal-300 text-[11px]">
                            {p.codigo}
                          </td>
                          <td className="py-1.5 px-3 font-sans text-slate-200 font-medium">
                            {p.nombre}
                          </td>
                          <td className="py-1.5 px-3 text-center">
                            <div className="inline-flex items-center space-x-1 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                              <button
                                type="button"
                                onClick={() => handleUpdatePieceQty(p.id, -1)}
                                className="text-slate-400 hover:text-white px-1 cursor-pointer"
                              >
                                -
                              </button>
                              <span className="font-bold text-white px-1">{p.cantidad}</span>
                              <button
                                type="button"
                                onClick={() => handleUpdatePieceQty(p.id, 1)}
                                className="text-slate-400 hover:text-white px-1 cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="py-1.5 px-3 font-sans text-[11px] text-slate-400">
                            {p.categoriaPieza || '-'}
                          </td>
                          <td className="py-1.5 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemovePiece(p.id)}
                              className="text-slate-500 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                              title="Eliminar pieza"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

            </div>
          )}

          {/* 3. Trazabilidad Técnica */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Lote *
              </label>
              <input
                type="text"
                value={formData.lote || ''}
                onChange={(e) => setFormData({ ...formData, lote: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-semibold"
                placeholder="LT-ARTH-2026"
              />
              {errors.lote && <p className="text-rose-600 text-[11px] mt-1">{errors.lote}</p>}
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Fabricante / Marca *
              </label>
              <input
                type="text"
                value={formData.fabricante || ''}
                onChange={(e) => setFormData({ ...formData, fabricante: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                placeholder="Arthrex, DePuy, etc."
              />
              {errors.fabricante && <p className="text-rose-600 text-[11px] mt-1">{errors.fabricante}</p>}
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Material
              </label>
              <input
                type="text"
                value={formData.material || ''}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                placeholder="Acero 316L, Titanio, PEEK"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Registro Sanitario
              </label>
              <input
                type="text"
                value={formData.registroSanitario || ''}
                onChange={(e) => setFormData({ ...formData, registroSanitario: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                placeholder="INVIMA 2024DM-"
              />
            </div>
          </div>

          {/* 4. Inventario Físico en Bodega */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                {formData.esSet ? 'Sets Físicos en Almacén *' : 'Stock Actual *'}
              </label>
              <input
                type="number"
                min="0"
                value={formData.stockActual ?? 0}
                onChange={(e) => setFormData({ ...formData, stockActual: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Stock Mínimo de Alerta
              </label>
              <input
                type="number"
                min="0"
                value={formData.stockMinimo ?? 1}
                onChange={(e) => setFormData({ ...formData, stockMinimo: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Unidad de Medida
              </label>
              <select
                value={formData.unidadMedida || 'sets'}
                onChange={(e) => setFormData({ ...formData, unidadMedida: e.target.value as any })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-medium"
              >
                <option value="sets">Sets / Cajas Quirúrgicas</option>
                <option value="cajas">Cajas</option>
                <option value="unidades">Unidades</option>
                <option value="piezas">Piezas</option>
                <option value="kits">Kits</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Estado Comercial
              </label>
              <select
                value={formData.estado || 'disponible'}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value as ItemStatus })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-medium"
              >
                <option value="disponible">🟢 En Almacén / Disponible</option>
                <option value="apartado">🔵 Apartado / Reservado</option>
                <option value="en_consignacion">🔷 En Consignación</option>
                <option value="en_revision">🟠 En Revisión Técnica</option>
                <option value="agotado">🔴 Sin Existencias</option>
              </select>
            </div>
          </div>

          {/* 5. Ubicación y Precios */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Ubicación en Bodega
              </label>
              <input
                type="text"
                value={formData.ubicacion || ''}
                onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                placeholder="Bodega Principal - Estante B3"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Precio de Venta / Evento ($ USD)
              </label>
              <input
                type="number"
                min="0"
                value={formData.precioVenta ?? 0}
                onChange={(e) => setFormData({ ...formData, precioVenta: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Costo Unitario ($ USD)
              </label>
              <input
                type="number"
                min="0"
                value={formData.costoUnitario ?? 0}
                onChange={(e) => setFormData({ ...formData, costoUnitario: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Notas u Observaciones del Set
            </label>
            <input
              type="text"
              value={formData.notas || ''}
              onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
              placeholder="Ej. Set completo verificado, incluye caja perforada de esterilización..."
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <div className="text-slate-500 font-medium text-xs">
              {formData.esSet && (
                <span>
                  Resumen: <strong>{calculatedTotalPiezas} piezas</strong> en el set · <strong>{formData.stockActual} cajas</strong> en stock
                </span>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-semibold transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg shadow-sm flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{formData.esSet ? 'Guardar Set e Instrumental' : 'Guardar en Inventario'}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
