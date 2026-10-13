import { InventoryItem, StockHealth } from '../types/inventory';

export function getStockHealth(item: InventoryItem): StockHealth {
  if (item.stockActual === 0) return 'critico';
  if (item.stockActual < item.stockMinimo) return 'critico';
  if (item.stockActual === item.stockMinimo) return 'bajo';
  if (item.stockActual > item.stockMinimo * 3 && item.stockMinimo > 0) return 'exceso';
  return 'optimo';
}

export function getStockHealthBadge(health: StockHealth) {
  switch (health) {
    case 'critico':
      return {
        label: 'Stock Crítico',
        bg: 'bg-rose-50 text-rose-700 border-rose-200',
        dot: 'bg-rose-500',
        indicator: 'text-rose-600'
      };
    case 'bajo':
      return {
        label: 'Stock Mínimo',
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
        dot: 'bg-amber-500',
        indicator: 'text-amber-600'
      };
    case 'optimo':
      return {
        label: 'Stock Óptimo',
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500',
        indicator: 'text-emerald-600'
      };
    case 'exceso':
      return {
        label: 'Sobre-stock',
        bg: 'bg-blue-50 text-blue-700 border-blue-200',
        dot: 'bg-blue-500',
        indicator: 'text-blue-600'
      };
  }
}

export function getStatusBadge(status: InventoryItem['estado']) {
  switch (status) {
    case 'disponible':
      return {
        label: 'En Almacén',
        bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        dot: 'bg-emerald-500'
      };
    case 'apartado':
      return {
        label: 'Apartado / Reservado',
        bg: 'bg-blue-100 text-blue-800 border-blue-300',
        dot: 'bg-blue-500'
      };
    case 'en_consignacion':
      return {
        label: 'En Consignación',
        bg: 'bg-cyan-100 text-cyan-800 border-cyan-300',
        dot: 'bg-cyan-500'
      };
    case 'en_revision':
      return {
        label: 'En Revisión Técnica',
        bg: 'bg-amber-100 text-amber-800 border-amber-300',
        dot: 'bg-orange-500'
      };
    case 'agotado':
      return {
        label: 'Sin Existencias',
        bg: 'bg-rose-100 text-rose-800 border-rose-300',
        dot: 'bg-rose-500'
      };
  }
}

export function getCategoryLabel(item: InventoryItem): {
  group: string;
  category: string;
  subcategory?: string;
  fullPath: string;
  colorClass: string;
} {
  if (item.primaryCategory === 'equipos_medicos') {
    return {
      group: 'Equipos Médicos',
      category: 'Equipos Médicos',
      fullPath: 'Equipos Médicos',
      colorClass: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    };
  }

  if (item.instrumentalCategory === 'artroscopia') {
    let sub = '';
    if (item.artroscopiaSubcategory === 'hombro') sub = 'Hombro';
    else if (item.artroscopiaSubcategory === 'rodilla') sub = 'Rodilla';
    else if (item.artroscopiaSubcategory === 'otros') sub = 'Otros';

    return {
      group: 'Instrumental',
      category: 'Artroscopia',
      subcategory: sub || undefined,
      fullPath: sub ? `Instrumental › Artroscopia › ${sub}` : 'Instrumental › Artroscopia',
      colorClass: 'bg-teal-50 text-teal-700 border-teal-200'
    };
  }

  if (item.instrumentalCategory === 'osteosintesis') {
    return {
      group: 'Instrumental',
      category: 'Osteosíntesis',
      fullPath: 'Instrumental › Osteosíntesis',
      colorClass: 'bg-amber-50 text-amber-800 border-amber-200'
    };
  }

  if (item.instrumentalCategory === 'reemplazo_articular') {
    if (item.reemplazoSubcategory === 'cadera') {
      return {
        group: 'Instrumental',
        category: 'Reemplazo Articular',
        subcategory: 'Cadera',
        fullPath: 'Instrumental › Reemplazo Articular › Cadera',
        colorClass: 'bg-sky-50 text-sky-800 border-sky-200'
      };
    }
    if (item.reemplazoSubcategory === 'rodilla') {
      return {
        group: 'Instrumental',
        category: 'Reemplazo Articular',
        subcategory: 'Rodilla',
        fullPath: 'Instrumental › Reemplazo Articular › Rodilla',
        colorClass: 'bg-cyan-50 text-cyan-800 border-cyan-200'
      };
    }
    return {
      group: 'Instrumental',
      category: 'Reemplazo Articular',
      fullPath: 'Instrumental › Reemplazo Articular',
      colorClass: 'bg-emerald-50 text-emerald-800 border-emerald-200'
    };
  }

  return {
    group: 'General',
    category: 'Otro',
    fullPath: 'General',
    colorClass: 'bg-slate-50 text-slate-700 border-slate-200'
  };
}

export function exportInventoryToCSV(items: InventoryItem[], filename = 'inventario_cuesta_cuesta_medica.csv') {
  const headers = [
    'SKU',
    'Nombre',
    'Grupo',
    'Categoría',
    'Subcategoría',
    'Subtipo',
    'Stock Actual',
    'Stock Mínimo',
    'Unidad',
    'Estado',
    'Ubicación Almacén',
    'Lote',
    'N° Serie',
    'Fabricante',
    'Material',
    'Registro Sanitario',
    'Precio Venta',
    'Costo Unitario',
    'Notas'
  ];

  const rows = items.map(item => {
    const cat = getCategoryLabel(item);
    return [
      `"${item.sku.replace(/"/g, '""')}"`,
      `"${item.nombre.replace(/"/g, '""')}"`,
      `"${cat.group}"`,
      `"${cat.category}"`,
      `"${cat.subcategory || '-'}"`,
      `"${item.subtipo || '-'}"`,
      item.stockActual,
      item.stockMinimo,
      `"${item.unidadMedida}"`,
      `"${item.estado}"`,
      `"${item.ubicacion.replace(/"/g, '""')}"`,
      `"${item.lote.replace(/"/g, '""')}"`,
      `"${item.numeroSerie || '-'}"`,
      `"${item.fabricante.replace(/"/g, '""')}"`,
      `"${item.material || '-'}"`,
      `"${item.registroSanitario || '-'}"`,
      item.precioVenta || 0,
      item.costoUnitario || 0,
      `"${(item.notas || '').replace(/"/g, '""')}"`
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
