/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  InventoryItem, 
  StockMovement, 
  PrimaryCategory, 
  InstrumentalCategory, 
  ArtroscopiaSubcategory,
  ReemplazoSubcategory, 
  ItemStatus 
} from './types/inventory';
import { INITIAL_INVENTORY, INITIAL_MOVEMENTS } from './data/mockData';
import { getStockHealth, exportInventoryToCSV } from './utils/inventoryUtils';
import { exportInventoryToExcel } from './utils/excelUtils';

// Components
import { Navbar } from './components/Navbar';
import { InventoryStats } from './components/InventoryStats';
import { CategoryFilterDropdown } from './components/CategoryFilterDropdown';
import { CollapsibleCategorySections } from './components/CollapsibleCategorySections';
import { InventoryListView } from './components/InventoryListView';
import { ItemModal } from './components/ItemModal';
import { MovementModal } from './components/MovementModal';
import { ItemDetailModal } from './components/ItemDetailModal';
import { SurgicalRemissionModal } from './components/SurgicalRemissionModal';
import { SetPiecesModal } from './components/SetPiecesModal';

const STORAGE_KEY_ITEMS = 'cuesta_cuesta_inventory_items_v4';
const STORAGE_KEY_MOVEMENTS = 'cuesta_cuesta_inventory_movements_v4';

export default function App() {
  // --- Persistent State ---
  const [items, setItems] = useState<InventoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ITEMS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading inventory from storage', e);
    }
    return INITIAL_INVENTORY;
  });

  const [movements, setMovements] = useState<StockMovement[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MOVEMENTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading movements from storage', e);
    }
    return INITIAL_MOVEMENTS;
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items));
    } catch (e) {
      console.error('Error saving inventory to storage', e);
    }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MOVEMENTS, JSON.stringify(movements));
    } catch (e) {
      console.error('Error saving movements to storage', e);
    }
  }, [movements]);

  // --- View & Filter State ---
  const [viewMode, setViewMode] = useState<'collapsible' | 'table'>('collapsible');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [soloSets, setSoloSets] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [stockFilter, setStockFilter] = useState<string>('todos');
  const [locationFilter, setLocationFilter] = useState<string>('todos');

  // Accordion Sections State
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    equipos_medicos: true,
    artroscopia: true,
    osteosintesis: true,
    reemplazo_articular: true
  });

  // --- Modals State ---
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [itemCategoryPreset, setItemCategoryPreset] = useState<{
    primary: PrimaryCategory;
    instrumental?: InstrumentalCategory;
    reemplazo?: ReemplazoSubcategory;
    artroscopia?: ArtroscopiaSubcategory;
  } | undefined>(undefined);
  const [forceSetMode, setForceSetMode] = useState<boolean>(true);

  // Set Pieces Inspector Modal
  const [isSetPiecesModalOpen, setIsSetPiecesModalOpen] = useState(false);
  const [selectedSetForPieces, setSelectedSetForPieces] = useState<InventoryItem | null>(null);

  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [selectedMovementItem, setSelectedMovementItem] = useState<InventoryItem | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState<InventoryItem | null>(null);

  const [isRemissionModalOpen, setIsRemissionModalOpen] = useState(false);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // --- Section Toggling ---
  const handleToggleSection = (sectionKey: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const handleExpandAll = () => {
    setOpenSections({
      equipos_medicos: true,
      artroscopia: true,
      osteosintesis: true,
      reemplazo_articular: true
    });
  };

  const handleCollapseAll = () => {
    setOpenSections({
      equipos_medicos: false,
      artroscopia: false,
      osteosintesis: false,
      reemplazo_articular: false
    });
  };

  // --- Reset All Filters ---
  const handleResetFilters = () => {
    setSelectedCategory('todos');
    setSoloSets(false);
    setSearchTerm('');
    setStatusFilter('todos');
    setStockFilter('todos');
    setLocationFilter('todos');
  };

  // --- Quick filter for critical items ---
  const handleFilterCritical = () => {
    setStockFilter('critico');
    setSelectedCategory('todos');
    setSoloSets(false);
  };

  // --- Filtering Logic ---
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // 0. Solo Sets Filter
      if (soloSets && !item.esSet) {
        return false;
      }

      // 1. Category Filter
      if (selectedCategory !== 'todos') {
        if (selectedCategory === 'equipos_medicos') {
          if (item.primaryCategory !== 'equipos_medicos') return false;
        } else if (selectedCategory === 'artroscopia') {
          if (item.instrumentalCategory !== 'artroscopia') return false;
        } else if (selectedCategory === 'art_hombro') {
          if (item.instrumentalCategory !== 'artroscopia' || item.artroscopiaSubcategory !== 'hombro') return false;
        } else if (selectedCategory === 'art_rodilla') {
          if (item.instrumentalCategory !== 'artroscopia' || item.artroscopiaSubcategory !== 'rodilla') return false;
        } else if (selectedCategory === 'art_otros') {
          if (item.instrumentalCategory !== 'artroscopia' || (item.artroscopiaSubcategory !== 'otros' && !!item.artroscopiaSubcategory)) return false;
        } else if (selectedCategory === 'osteosintesis') {
          if (item.instrumentalCategory !== 'osteosintesis') return false;
        } else if (selectedCategory === 'reemplazo_articular') {
          if (item.instrumentalCategory !== 'reemplazo_articular') return false;
        } else if (selectedCategory === 'cadera') {
          if (item.instrumentalCategory !== 'reemplazo_articular' || item.reemplazoSubcategory !== 'cadera') return false;
        } else if (selectedCategory === 'rodilla') {
          if (item.instrumentalCategory !== 'reemplazo_articular' || item.reemplazoSubcategory !== 'rodilla') return false;
        }
      }

      // 2. Search Term (also searches inside pieces names and codes!)
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchSku = item.sku.toLowerCase().includes(query);
        const matchName = item.nombre.toLowerCase().includes(query);
        const matchDesc = item.descripcion.toLowerCase().includes(query);
        const matchLote = item.lote.toLowerCase().includes(query);
        const matchFab = item.fabricante.toLowerCase().includes(query);
        const matchReg = (item.registroSanitario || '').toLowerCase().includes(query);
        const matchMat = (item.material || '').toLowerCase().includes(query);
        
        // Search in piece names inside the set
        const matchPieces = item.piezas?.some(p => 
          p.nombre.toLowerCase().includes(query) || p.codigo.toLowerCase().includes(query)
        );

        if (!matchSku && !matchName && !matchDesc && !matchLote && !matchFab && !matchReg && !matchMat && !matchPieces) {
          return false;
        }
      }

      // 3. Status Filter
      if (statusFilter !== 'todos' && item.estado !== statusFilter) {
        return false;
      }

      // 4. Stock Health Filter
      if (stockFilter !== 'todos') {
        const health = getStockHealth(item);
        if (stockFilter === 'critico' && health !== 'critico') return false;
        if (stockFilter === 'bajo' && health !== 'bajo') return false;
        if (stockFilter === 'optimo' && health !== 'optimo') return false;
      }

      // 5. Location Filter
      if (locationFilter !== 'todos' && item.ubicacion !== locationFilter) {
        return false;
      }

      return true;
    });
  }, [items, selectedCategory, soloSets, searchTerm, statusFilter, stockFilter, locationFilter]);

  // --- Handlers: Modal Openers ---
  const handleOpenNewItemModal = (isSet = true) => {
    setEditingItem(null);
    setItemCategoryPreset(undefined);
    setForceSetMode(isSet);
    setIsItemModalOpen(true);
  };

  const handleOpenAddItemPreset = (
    primary: PrimaryCategory,
    instrumentalCat?: InstrumentalCategory,
    reemplazoSub?: ReemplazoSubcategory,
    artroscopiaSub?: ArtroscopiaSubcategory,
    isSet = true
  ) => {
    setEditingItem(null);
    setItemCategoryPreset({
      primary,
      instrumental: instrumentalCat,
      reemplazo: reemplazoSub,
      artroscopia: artroscopiaSub
    });
    setForceSetMode(isSet);
    setIsItemModalOpen(true);
  };

  const handleOpenEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setItemCategoryPreset(undefined);
    setForceSetMode(!!item.esSet);
    setIsItemModalOpen(true);
  };

  const handleOpenViewItem = (item: InventoryItem) => {
    setSelectedDetailItem(item);
    setIsDetailModalOpen(true);
  };

  const handleOpenViewPieces = (item: InventoryItem) => {
    setSelectedSetForPieces(item);
    setIsSetPiecesModalOpen(true);
  };

  const handleOpenMovement = (item: InventoryItem) => {
    setSelectedMovementItem(item);
    setIsMovementModalOpen(true);
  };

  // --- Handlers: CRUD Actions ---
  const handleSaveItem = (itemData: Partial<InventoryItem>) => {
    const today = new Date().toISOString().split('T')[0];

    if (editingItem) {
      // Update
      setItems(prev => prev.map(it => {
        if (it.id === editingItem.id) {
          const updated: InventoryItem = {
            ...it,
            ...itemData,
            id: it.id,
            ultimaActualizacion: today
          } as InventoryItem;

          // Update pieces total if set
          if (updated.esSet && updated.piezas) {
            updated.totalPiezas = updated.piezas.reduce((acc, p) => acc + (p.cantidad || 1), 0);
          }

          return updated;
        }
        return it;
      }));

      // If updating the currently viewed set pieces modal, update it
      if (selectedSetForPieces && selectedSetForPieces.id === editingItem.id) {
        setSelectedSetForPieces({
          ...selectedSetForPieces,
          ...itemData
        } as InventoryItem);
      }

      showToast(`"${itemData.nombre}" actualizado correctamente.`);
    } else {
      // Create new
      const newItem: InventoryItem = {
        ...itemData,
        id: `item-${Date.now()}`,
        fechaRegistro: today,
        ultimaActualizacion: today
      } as InventoryItem;

      if (newItem.esSet && newItem.piezas) {
        newItem.totalPiezas = newItem.piezas.reduce((acc, p) => acc + (p.cantidad || 1), 0);
      }

      setItems(prev => [newItem, ...prev]);

      // Add movement log
      const newMov: StockMovement = {
        id: `mov-${Date.now()}`,
        itemId: newItem.id,
        itemNombre: newItem.nombre,
        sku: newItem.sku,
        tipo: 'entrada',
        cantidad: newItem.stockActual,
        fecha: new Date().toISOString().replace('T', ' ').slice(0, 16),
        responsable: 'Almacén Central',
        clienteODestino: 'Ingreso Nuevo a Inventario',
        motivo: newItem.esSet 
          ? `Registro inicial de set con ${newItem.totalPiezas || 0} piezas desglosadas.`
          : 'Registro inicial de ítem en bodega.',
        lote: newItem.lote
      };
      setMovements(prev => [newMov, ...prev]);

      showToast(
        newItem.esSet 
          ? `Set "${newItem.nombre}" creado con éxito (${newItem.totalPiezas || 0} piezas).`
          : `Ítem "${newItem.nombre}" registrado en inventario.`
      );
    }
  };

  const handleDeleteItem = (id: string) => {
    const itemToDelete = items.find(i => i.id === id);
    if (!itemToDelete) return;

    if (window.confirm(`¿Estás seguro de eliminar "${itemToDelete.nombre}" (${itemToDelete.sku}) del inventario?`)) {
      setItems(prev => prev.filter(i => i.id !== id));
      showToast(`Ítem "${itemToDelete.nombre}" eliminado del inventario.`);
    }
  };

  const handleConfirmMovement = (
    movement: StockMovement, 
    newStock: number, 
    newStatus?: ItemStatus, 
    reservationData?: any
  ) => {
    // 1. Add movement to history
    setMovements(prev => [movement, ...prev]);

    // 2. Adjust item physical stock
    setItems(prev => prev.map(it => {
      if (it.id === movement.itemId) {
        return {
          ...it,
          stockActual: newStock,
          estado: newStatus || it.estado,
          ultimaActualizacion: new Date().toISOString().split('T')[0]
        };
      }
      return it;
    }));

    showToast(`Movimiento registrado para ${movement.itemNombre} (${movement.tipo.replace('_', ' ')}).`);
  };

  // --- Handlers: Exports ---
  const handleExportCSV = () => {
    exportInventoryToCSV(items);
    showToast('Inventario exportado a CSV con éxito.');
  };

  const handleExportExcel = () => {
    exportInventoryToExcel(items);
    showToast('Inventario exportado a Excel (.xlsx) con éxito.');
  };

  const criticalCount = items.filter(i => getStockHealth(i) === 'critico').length;
  const inConsignmentCount = items.filter(i => i.estado === 'en_consignacion').length;
  const setsCount = items.filter(i => i.esSet).length;

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      
      {/* 1. Global Navigation Bar */}
      <Navbar
        criticalCount={criticalCount}
        setsCount={setsCount}
        inConsignmentCount={inConsignmentCount}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenNewItemModal={() => handleOpenNewItemModal(true)}
        onOpenRemissionModal={() => setIsRemissionModalOpen(true)}
        onExportExcel={handleExportExcel}
      />

      {/* 2. Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* KPI & Stats Metrics */}
        <InventoryStats
          items={items}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            setSoloSets(false);
          }}
          soloSets={soloSets}
          onToggleSoloSets={() => setSoloSets(!soloSets)}
          onFilterCritical={handleFilterCritical}
        />

        {/* Search, Filter and Segmented Controls */}
        <CategoryFilterDropdown
          items={items}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          soloSets={soloSets}
          onToggleSoloSets={() => setSoloSets(!soloSets)}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          stockFilter={stockFilter}
          onStockFilterChange={setStockFilter}
          locationFilter={locationFilter}
          onLocationChange={setLocationFilter}
          onResetFilters={handleResetFilters}
          isCollapsibleView={viewMode === 'collapsible'}
          onExpandAll={handleExpandAll}
          onCollapseAll={handleCollapseAll}
        />

        {/* View Mode: Collapsible Categories vs High-density Table */}
        {viewMode === 'collapsible' ? (
          <CollapsibleCategorySections
            items={filteredItems}
            onViewItem={handleOpenViewItem}
            onViewPieces={handleOpenViewPieces}
            onEditItem={handleOpenEditItem}
            onMovementItem={handleOpenMovement}
            onDeleteItem={handleDeleteItem}
            onAddItemToCategory={handleOpenAddItemPreset}
            openSections={openSections}
            onToggleSection={handleToggleSection}
          />
        ) : (
          <InventoryListView
            items={filteredItems}
            onViewItem={handleOpenViewItem}
            onViewPieces={handleOpenViewPieces}
            onEditItem={handleOpenEditItem}
            onMovementItem={handleOpenMovement}
            onDeleteItem={handleDeleteItem}
          />
        )}

      </main>

      {/* 3. Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-white uppercase tracking-wider">
              Cuesta Cuesta Médica
            </span>
            <span>·</span>
            <span>Sistema Quirúrgico de Almacén e Instrumental</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px] text-slate-400">
            <span>Artroscopia (Hombro / Rodilla)</span>
            <span>·</span>
            <span>Osteosíntesis</span>
            <span>·</span>
            <span>Reemplazo Articular (Cadera / Rodilla)</span>
          </div>
        </div>
      </footer>

      {/* --- MODALS --- */}

      {/* Item / Set Modal */}
      <ItemModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        onSave={handleSaveItem}
        initialItem={editingItem}
        defaultCategory={itemCategoryPreset}
        forceSetMode={forceSetMode}
      />

      {/* Dedicated Set Pieces Inspector & Checklist Sheet Modal */}
      <SetPiecesModal
        isOpen={isSetPiecesModalOpen}
        onClose={() => setIsSetPiecesModalOpen(false)}
        item={selectedSetForPieces}
        onEditSet={(item) => {
          setIsSetPiecesModalOpen(false);
          handleOpenEditItem(item);
        }}
      />

      {/* Movement Modal */}
      <MovementModal
        isOpen={isMovementModalOpen}
        onClose={() => setIsMovementModalOpen(false)}
        item={selectedMovementItem}
        onConfirmMovement={handleConfirmMovement}
      />

      {/* Item Detail Modal */}
      <ItemDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        item={selectedDetailItem}
        onEdit={handleOpenEditItem}
        onMovement={handleOpenMovement}
        onViewPieces={handleOpenViewPieces}
      />

      {/* Surgical Remission Modal */}
      <SurgicalRemissionModal
        isOpen={isRemissionModalOpen}
        onClose={() => setIsRemissionModalOpen(false)}
        items={items}
      />

      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center space-x-2 text-xs font-semibold animate-in slide-in-from-bottom-5">
          <span className="w-2 h-2 rounded-full bg-teal-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
