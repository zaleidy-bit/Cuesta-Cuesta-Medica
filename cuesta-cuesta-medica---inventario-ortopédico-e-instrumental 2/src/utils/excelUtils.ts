import * as XLSX from 'xlsx';
import { 
  InventoryItem, 
  PrimaryCategory, 
  InstrumentalCategory, 
  ArtroscopiaSubcategory, 
  ReemplazoSubcategory, 
  ItemStatus 
} from '../types/inventory';
import { getCategoryLabel } from './inventoryUtils';

export interface ParsedItemPreview {
  raw: Record<string, any>;
  item: InventoryItem;
  status: 'new' | 'update' | 'warning';
  warnings: string[];
  selected: boolean;
}

export interface ExcelParseResult {
  sheetNames: string[];
  selectedSheet: string;
  items: ParsedItemPreview[];
  summary: {
    total: number;
    newCount: number;
    updateCount: number;
    warningCount: number;
  };
}

/**
 * Normaliza nombres de encabezados para mapeo flexible
 */
function normalizeHeader(header: string): string {
  return header
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quita acentos
    .replace(/[^a-z0-9]/g, '') // Quita espacios y caracteres especiales
    .trim();
}

/**
 * Detecta y clasifica la categoría ortopédica/médica a partir del texto ingresado
 */
export function inferCategories(categoryText: string, subcategoryText: string = ''): {
  primaryCategory: PrimaryCategory;
  instrumentalCategory?: InstrumentalCategory;
  artroscopiaSubcategory?: ArtroscopiaSubcategory;
  reemplazoSubcategory?: ReemplazoSubcategory;
} {
  const combined = `${categoryText} ${subcategoryText}`.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // 1. Equipos Médicos
  if (
    combined.includes('equipo') || 
    combined.includes('motor') || 
    combined.includes('torre') || 
    combined.includes('camara') || 
    combined.includes('fuente') || 
    combined.includes('shaver') || 
    combined.includes('consola') || 
    combined.includes('perforador')
  ) {
    return { primaryCategory: 'equipos_medicos' };
  }

  // 2. Artroscopia
  if (combined.includes('artroscop') || combined.includes('artroscop')) {
    let artSub: ArtroscopiaSubcategory = 'otros';
    if (combined.includes('hombro') || combined.includes('manguito') || combined.includes('labrum')) {
      artSub = 'hombro';
    } else if (combined.includes('rodilla') || combined.includes('menisco') || combined.includes('cruzado') || combined.includes('lca')) {
      artSub = 'rodilla';
    }
    return {
      primaryCategory: 'instrumental',
      instrumentalCategory: 'artroscopia',
      artroscopiaSubcategory: artSub
    };
  }

  // 3. Reemplazo Articular (Cadera / Rodilla)
  if (combined.includes('reemplazo') || combined.includes('artroplastia') || combined.includes('protesis') || combined.includes('cadera') || combined.includes('cotilo') || combined.includes('vastago')) {
    let remSub: ReemplazoSubcategory = 'cadera';
    if (combined.includes('rodilla') || combined.includes('femur') && combined.includes('tibia')) {
      remSub = 'rodilla';
    } else if (combined.includes('cadera') || combined.includes('acetabulo') || combined.includes('cotilo')) {
      remSub = 'cadera';
    }
    return {
      primaryCategory: 'instrumental',
      instrumentalCategory: 'reemplazo_articular',
      reemplazoSubcategory: remSub
    };
  }

  // 4. Osteosíntesis
  if (
    combined.includes('osteosintesis') || 
    combined.includes('placa') || 
    combined.includes('tornillo') || 
    combined.includes('clavo') || 
    combined.includes('bloqueada') || 
    combined.includes('enclavado')
  ) {
    return {
      primaryCategory: 'instrumental',
      instrumentalCategory: 'osteosintesis'
    };
  }

  // Por defecto: instrumental general o osteosíntesis
  return {
    primaryCategory: 'instrumental',
    instrumentalCategory: 'osteosintesis'
  };
}

/**
 * Normaliza el estado
 */
function normalizeStatus(statusRaw: any): ItemStatus {
  if (!statusRaw) return 'disponible';
  const s = String(statusRaw).toLowerCase().trim();
  if (s.includes('apartado') || s.includes('reservado')) return 'apartado';
  if (s.includes('consigna') || s.includes('prestamo')) return 'en_consignacion';
  if (s.includes('revision') || s.includes('mantenimiento') || s.includes('cuarentena')) return 'en_revision';
  if (s.includes('agota') || s.includes('cero') || s.includes('sin stock')) return 'agotado';
  return 'disponible';
}

/**
 * Mapeo inteligente de fila de Excel a InventoryItem
 */
export function mapRowToInventoryItem(
  row: Record<string, any>, 
  index: number, 
  existingItems: InventoryItem[]
): ParsedItemPreview {
  const warnings: string[] = [];
  const normalizedKeys: Record<string, any> = {};

  // Indexar por key normalizada
  Object.keys(row).forEach(key => {
    normalizedKeys[normalizeHeader(key)] = row[key];
  });

  // Helper para buscar por múltiples nombres de columna
  const getVal = (...aliases: string[]) => {
    for (const alias of aliases) {
      const norm = normalizeHeader(alias);
      if (normalizedKeys[norm] !== undefined && normalizedKeys[norm] !== null && String(normalizedKeys[norm]).trim() !== '') {
        return normalizedKeys[norm];
      }
    }
    return undefined;
  };

  // SKU / Código de referencia
  let sku = getVal('sku', 'codigo', 'cod', 'referencia', 'ref', 'id', 'itemcode', 'numero_parte', 'partnumber');
  if (!sku) {
    sku = `REF-IMP-${Date.now().toString().slice(-4)}-${index + 1}`;
    warnings.push('SKU no especificado; se generó uno automático.');
  } else {
    sku = String(sku).trim().toUpperCase();
  }

  // Nombre
  let nombre = getVal('nombre', 'descripcion_corta', 'producto', 'item', 'descripcion', 'instrumental', 'equipo');
  if (!nombre) {
    nombre = `Ítem importado ${sku}`;
    warnings.push('Nombre no especificado; verifique la descripción.');
  } else {
    nombre = String(nombre).trim();
  }

  // Descripción detallada
  const descripcion = getVal('descripcion', 'detalle', 'especificaciones', 'nombre_completo') || nombre;

  // Categorías
  const catRaw = getVal('categoria', 'grupo', 'tipo_item', 'familia', 'primarycategory') || '';
  const subcatRaw = getVal('subcategoria', 'articulacion', 'linea', 'procedimiento', 'subtipo') || '';
  const { primaryCategory, instrumentalCategory, artroscopiaSubcategory, reemplazoSubcategory } = inferCategories(
    String(catRaw), 
    String(subcatRaw)
  );

  // Subtipo
  const subtipo = getVal('subtipo', 'clase', 'presentacion') || (
    primaryCategory === 'equipos_medicos' ? 'Equipo Electromédico' : 'Implante / Instrumental'
  );

  // Stock Actual
  const stockRaw = getVal('stock_actual', 'stock', 'cantidad', 'existencia', 'unidades', 'cant');
  let stockActual = 1;
  if (stockRaw !== undefined) {
    const parsed = Number(String(stockRaw).replace(/,/g, '.').replace(/[^0-9.-]/g, ''));
    if (!isNaN(parsed) && parsed >= 0) {
      stockActual = Math.floor(parsed);
    } else {
      warnings.push(`Cantidad "${stockRaw}" inválida; se asignó stock 1.`);
    }
  }

  // Stock Mínimo
  const minRaw = getVal('stock_minimo', 'minimo', 'stock_min', 'stock_seguridad');
  let stockMinimo = 2;
  if (minRaw !== undefined) {
    const parsed = Number(String(minRaw).replace(/,/g, '.').replace(/[^0-9.-]/g, ''));
    if (!isNaN(parsed) && parsed >= 0) {
      stockMinimo = Math.floor(parsed);
    }
  }

  // Unidad de Medida
  const unidadRaw = String(getVal('unidad', 'unidad_medida', 'um') || 'unidades').toLowerCase();
  let unidadMedida: InventoryItem['unidadMedida'] = 'unidades';
  if (unidadRaw.includes('set')) unidadMedida = 'sets';
  else if (unidadRaw.includes('caja')) unidadMedida = 'cajas';
  else if (unidadRaw.includes('kit')) unidadMedida = 'kits';
  else if (unidadRaw.includes('pieza')) unidadMedida = 'piezas';

  // Ubicación en bodega
  const ubicacion = String(getVal('ubicacion', 'almacen', 'bodega', 'estante', 'deposito') || 'Bodega Principal - Recepción');

  // Lote
  const lote = String(getVal('lote', 'no_lote', 'batch', 'num_lote') || `LT-${Date.now().toString().slice(-4)}`);

  // Serial
  const numeroSerie = getVal('numero_serie', 'serial', 'serie', 'sn');

  // Fabricante
  const fabricante = String(getVal('fabricante', 'marca', 'proveedor', 'laboratorio') || 'Cuesta Cuesta Médica / Distribuido');

  // Material
  const material = getVal('material', 'composicion', 'aleacion');

  // Registro Sanitario
  const registroSanitario = getVal('registro_sanitario', 'invima', 'registro', 'sanitario', 'fda', 'ce');

  // Estado
  const estado = normalizeStatus(getVal('estado', 'status', 'condicion'));

  // Precios
  const precioRaw = getVal('precio_venta', 'precio', 'valor_venta', 'pvp');
  let precioVenta: number | undefined;
  if (precioRaw !== undefined) {
    const parsed = Number(String(precioRaw).replace(/,/g, '.').replace(/[^0-9.-]/g, ''));
    if (!isNaN(parsed) && parsed >= 0) precioVenta = parsed;
  }

  const costoRaw = getVal('costo_unitario', 'costo', 'valor_costo');
  let costoUnitario: number | undefined;
  if (costoRaw !== undefined) {
    const parsed = Number(String(costoRaw).replace(/,/g, '.').replace(/[^0-9.-]/g, ''));
    if (!isNaN(parsed) && parsed >= 0) costoUnitario = parsed;
  }

  // Notas
  const notas = getVal('notas', 'observaciones', 'comentarios');

  // Verificar si ya existe en inventario
  const existingItem = existingItems.find(i => i.sku.toLowerCase() === sku.toLowerCase());
  const statusType: 'new' | 'update' | 'warning' = warnings.length > 0
    ? 'warning'
    : (existingItem ? 'update' : 'new');

  const today = new Date().toISOString().split('T')[0];

  const item: InventoryItem = {
    id: existingItem ? existingItem.id : `item-excel-${Date.now()}-${index}`,
    sku,
    nombre,
    descripcion: String(descripcion),
    primaryCategory,
    instrumentalCategory,
    artroscopiaSubcategory,
    reemplazoSubcategory,
    subtipo: String(subtipo),
    stockActual,
    stockMinimo,
    unidadMedida,
    ubicacion,
    lote,
    numeroSerie: numeroSerie ? String(numeroSerie) : undefined,
    registroSanitario: registroSanitario ? String(registroSanitario) : undefined,
    fabricante,
    material: material ? String(material) : undefined,
    estado,
    precioVenta,
    costoUnitario,
    notas: notas ? String(notas) : undefined,
    fechaRegistro: existingItem ? existingItem.fechaRegistro : today,
    ultimaActualizacion: today
  };

  return {
    raw: row,
    item,
    status: statusType,
    warnings,
    selected: true
  };
}

/**
 * Lee y procesa un archivo Excel (.xlsx / .xls) o CSV
 */
export async function parseExcelOrCsvFile(
  file: File, 
  existingItems: InventoryItem[],
  sheetNameOverride?: string
): Promise<ExcelParseResult> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array', cellDates: true });

  const sheetNames = workbook.SheetNames;
  if (sheetNames.length === 0) {
    throw new Error('El archivo de Excel no contiene ninguna hoja.');
  }

  const selectedSheet = sheetNameOverride && sheetNames.includes(sheetNameOverride) 
    ? sheetNameOverride 
    : sheetNames[0];

  const worksheet = workbook.Sheets[selectedSheet];
  const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

  if (rows.length === 0) {
    throw new Error(`La hoja "${selectedSheet}" está vacía o no tiene encabezados válidos.`);
  }

  const items: ParsedItemPreview[] = rows.map((row, idx) => 
    mapRowToInventoryItem(row, idx, existingItems)
  );

  let newCount = 0;
  let updateCount = 0;
  let warningCount = 0;

  items.forEach(p => {
    if (p.status === 'new') newCount++;
    else if (p.status === 'update') updateCount++;
    else if (p.status === 'warning') warningCount++;
  });

  return {
    sheetNames,
    selectedSheet,
    items,
    summary: {
      total: items.length,
      newCount,
      updateCount,
      warningCount
    }
  };
}

/**
 * Genera y descarga una plantilla Excel (.xlsx) oficial preconfigurada para Cuesta Cuesta Médica
 */
export function downloadExcelTemplate() {
  const headers = [
    'SKU',
    'Nombre',
    'Descripción',
    'Grupo',
    'Categoría',
    'Subcategoría',
    'Subtipo',
    'Stock Actual',
    'Stock Mínimo',
    'Unidad Medida',
    'Ubicación Almacén',
    'Lote',
    'Número Serie',
    'Fabricante',
    'Material',
    'Registro Sanitario',
    'Estado',
    'Precio Venta',
    'Costo Unitario',
    'Notas'
  ];

  const sampleRows = [
    {
      'SKU': 'ART-HOM-001',
      'Nombre': 'Arpón SutureTak PEEK 3.0mm con Sutura FiberWire',
      'Descripción': 'Anclaje bioinerte para reparación de labrum y manguito rotador en hombro.',
      'Grupo': 'Instrumental',
      'Categoría': 'Artroscopia',
      'Subcategoría': 'Hombro',
      'Subtipo': 'Implante Artroscópico',
      'Stock Actual': 12,
      'Stock Mínimo': 5,
      'Unidad Medida': 'unidades',
      'Ubicación Almacén': 'Vitrina Implantes V-1',
      'Lote': 'LT-2024-8891',
      'Número Serie': '',
      'Fabricante': 'Arthrex',
      'Material': 'PEEK / FiberWire',
      'Registro Sanitario': 'INVIMA 2021DM-0019284',
      'Estado': 'disponible',
      'Precio Venta': 450000,
      'Costo Unitario': 290000,
      'Notas': 'Revisar fecha de caducidad estéril antes de despacho.'
    },
    {
      'SKU': 'ART-ROD-002',
      'Nombre': 'Tornillo de Interferencia Bioabsorbible 8x25mm',
      'Descripción': 'Tornillo canulado para fijación de injerto en Ligamento Cruzado Anterior (LCA).',
      'Grupo': 'Instrumental',
      'Categoría': 'Artroscopia',
      'Subcategoría': 'Rodilla',
      'Subtipo': 'Implante Artroscópico',
      'Stock Actual': 8,
      'Stock Mínimo': 4,
      'Unidad Medida': 'unidades',
      'Ubicación Almacén': 'Vitrina Implantes V-2',
      'Lote': 'LT-2024-9102',
      'Número Serie': '',
      'Fabricante': 'Smith & Nephew',
      'Material': 'PLLA / Hidroxiapatita',
      'Registro Sanitario': 'INVIMA 2020DM-0015421',
      'Estado': 'disponible',
      'Precio Venta': 520000,
      'Costo Unitario': 340000,
      'Notas': 'Compatible con cánula de 9mm.'
    },
    {
      'SKU': 'OST-RAD-003',
      'Nombre': 'Placa Bloqueada de Titanio 3.5mm para Radio Distal Volar',
      'Descripción': 'Placa anatómica para fractura articular de radio distal con tornillos de ángulo variable.',
      'Grupo': 'Instrumental',
      'Categoría': 'Osteosíntesis',
      'Subcategoría': '',
      'Subtipo': 'Placa Anatómica',
      'Stock Actual': 5,
      'Stock Mínimo': 3,
      'Unidad Medida': 'piezas',
      'Ubicación Almacén': 'Bodega Principal - Estante B2',
      'Lote': 'LT-2024-4410',
      'Número Serie': '',
      'Fabricante': 'DePuy Synthes',
      'Material': 'Titanio Ti-6Al-4V Grado Médico',
      'Registro Sanitario': 'INVIMA 2022DM-0021300',
      'Estado': 'disponible',
      'Precio Venta': 1200000,
      'Costo Unitario': 780000,
      'Notas': 'Incluye set de pruebas estéril.'
    },
    {
      'SKU': 'REP-CAD-004',
      'Nombre': 'Vástago Femoral Cónico No Cementado Cadera Corail Talla 11',
      'Descripción': 'Vástago de recubrimiento hidroxiapatita con cono 12/14 estándar para artroplastia total de cadera.',
      'Grupo': 'Instrumental',
      'Categoría': 'Reemplazo Articular',
      'Subcategoría': 'Cadera',
      'Subtipo': 'Componente Protésico Femoral',
      'Stock Actual': 4,
      'Stock Mínimo': 2,
      'Unidad Medida': 'piezas',
      'Ubicación Almacén': 'Bodega Alta Seguridad - Implantes Cadera',
      'Lote': 'LT-2024-1189',
      'Número Serie': 'SN-COR-98210',
      'Fabricante': 'DePuy Synthes',
      'Material': 'Titanio con recubrimiento de Hidroxiapatita',
      'Registro Sanitario': 'INVIMA 2019DM-0012903',
      'Estado': 'disponible',
      'Precio Venta': 3800000,
      'Costo Unitario': 2450000,
      'Notas': 'Requiere instrumental Corail para fresado y raspado.'
    },
    {
      'SKU': 'REP-ROD-005',
      'Nombre': 'Componente Femoral Rodilla PFC Sigma Talla 3 Izquierda',
      'Descripción': 'Componente de aleación CoCrMo cementado para reemplazo articular total de rodilla.',
      'Grupo': 'Instrumental',
      'Categoría': 'Reemplazo Articular',
      'Subcategoría': 'Rodilla',
      'Subtipo': 'Componente Protésico Rodilla',
      'Stock Actual': 3,
      'Stock Mínimo': 2,
      'Unidad Medida': 'piezas',
      'Ubicación Almacén': 'Bodega Alta Seguridad - Implantes Rodilla',
      'Lote': 'LT-2024-7721',
      'Número Serie': 'SN-PFC-44321',
      'Fabricante': 'DePuy Synthes',
      'Material': 'CoCrMo (Cobalto Cromo Molibdeno)',
      'Registro Sanitario': 'INVIMA 2021DM-0018843',
      'Estado': 'disponible',
      'Precio Venta': 4100000,
      'Costo Unitario': 2680000,
      'Notas': 'Verificar bandeja de tibia complementaria.'
    },
    {
      'SKU': 'EQM-TOR-006',
      'Nombre': 'Torre de Artroscopia Completa 4K UHD con Shaver y Bomba de Irrigación',
      'Descripción': 'Consola de video 4K, insuflador/bomba de fluidos articular, pieza de mano shaver y fuente de luz LED.',
      'Grupo': 'Equipos Médicos',
      'Categoría': 'Equipos Médicos',
      'Subcategoría': '',
      'Subtipo': 'Equipo Quirúrgico Electromédico',
      'Stock Actual': 2,
      'Stock Mínimo': 1,
      'Unidad Medida': 'sets',
      'Ubicación Almacén': 'Zona Técnica - Equipos Médicos Mayor',
      'Lote': 'EQ-2023-010',
      'Número Serie': 'SN-STRYK-99402',
      'Fabricante': 'Stryker',
      'Material': 'Aluminio anodizado y componentes electrónicos grado hospitalario',
      'Registro Sanitario': 'INVIMA 2020E-0009112',
      'Estado': 'disponible',
      'Precio Venta': 45000000,
      'Costo Unitario': 32000000,
      'Notas': 'Mantenimiento preventivo semestral al día.'
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleRows, { header: headers });

  // Ancho estimado de columnas
  worksheet['!cols'] = [
    { wch: 14 }, // SKU
    { wch: 38 }, // Nombre
    { wch: 45 }, // Descripción
    { wch: 16 }, // Grupo
    { wch: 20 }, // Categoría
    { wch: 15 }, // Subcategoría
    { wch: 24 }, // Subtipo
    { wch: 12 }, // Stock Actual
    { wch: 12 }, // Stock Mínimo
    { wch: 14 }, // Unidad Medida
    { wch: 32 }, // Ubicación Almacén
    { wch: 14 }, // Lote
    { wch: 16 }, // Número Serie
    { wch: 18 }, // Fabricante
    { wch: 26 }, // Material
    { wch: 24 }, // Registro Sanitario
    { wch: 14 }, // Estado
    { wch: 14 }, // Precio Venta
    { wch: 14 }, // Costo Unitario
    { wch: 35 }  // Notas
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventario_Cuesta_Cuesta');

  // Hoja de instrucciones y categorías válidas
  const instrucciones = [
    { 'Instrucción': 'Columna SKU', 'Detalle': 'Código único de referencia. Si está vacío, se generará uno automático.' },
    { 'Instrucción': 'Grupos válidos', 'Detalle': '"Instrumental" o "Equipos Médicos"' },
    { 'Instrucción': 'Categorías válidas', 'Detalle': '"Artroscopia", "Osteosíntesis", "Reemplazo Articular", "Equipos Médicos"' },
    { 'Instrucción': 'Subcategorías Artroscopia', 'Detalle': '"Hombro", "Rodilla", "Otros"' },
    { 'Instrucción': 'Subcategorías Reemplazo Articular', 'Detalle': '"Cadera", "Rodilla"' },
    { 'Instrucción': 'Estados válidos', 'Detalle': '"disponible", "apartado", "en_consignacion", "en_revision", "agotado"' },
    { 'Instrucción': 'Unidades de Medida', 'Detalle': '"unidades", "piezas", "sets", "cajas", "kits"' }
  ];
  const wsGuia = XLSX.utils.json_to_sheet(instrucciones);
  wsGuia['!cols'] = [{ wch: 28 }, { wch: 65 }];
  XLSX.utils.book_append_sheet(workbook, wsGuia, 'Guía_y_Categorías');

  XLSX.writeFile(workbook, 'plantilla_inventario_cuesta_cuesta_medica.xlsx');
}

/**
 * Exporta el inventario completo a un archivo Excel nativo (.xlsx)
 */
export function exportInventoryToExcel(items: InventoryItem[], filename = 'inventario_cuesta_cuesta_medica.xlsx') {
  const data = items.map(item => {
    const cat = getCategoryLabel(item);
    return {
      'SKU': item.sku,
      'Nombre': item.nombre,
      'Descripción': item.descripcion,
      'Grupo': cat.group,
      'Categoría': cat.category,
      'Subcategoría': cat.subcategory || '',
      'Subtipo': item.subtipo || '',
      'Stock Actual': item.stockActual,
      'Stock Mínimo': item.stockMinimo,
      'Unidad Medida': item.unidadMedida,
      'Estado': item.estado,
      'Ubicación Almacén': item.ubicacion,
      'Lote': item.lote,
      'Número Serie': item.numeroSerie || '',
      'Fabricante': item.fabricante,
      'Material': item.material || '',
      'Registro Sanitario': item.registroSanitario || '',
      'Precio Venta': item.precioVenta || 0,
      'Costo Unitario': item.costoUnitario || 0,
      'Notas': item.notas || '',
      'Fecha Registro': item.fechaRegistro,
      'Última Actualización': item.ultimaActualizacion
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(data);

  worksheet['!cols'] = [
    { wch: 14 },
    { wch: 38 },
    { wch: 45 },
    { wch: 16 },
    { wch: 20 },
    { wch: 15 },
    { wch: 24 },
    { wch: 12 },
    { wch: 12 },
    { wch: 14 },
    { wch: 14 },
    { wch: 30 },
    { wch: 14 },
    { wch: 16 },
    { wch: 18 },
    { wch: 24 },
    { wch: 22 },
    { wch: 14 },
    { wch: 14 },
    { wch: 30 },
    { wch: 14 },
    { wch: 16 }
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventario');

  XLSX.writeFile(workbook, filename);
}
