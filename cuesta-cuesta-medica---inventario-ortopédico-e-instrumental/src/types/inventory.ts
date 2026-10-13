export type PrimaryCategory = 'equipos_medicos' | 'instrumental';

export type InstrumentalCategory = 'artroscopia' | 'osteosintesis' | 'reemplazo_articular';

export type ArtroscopiaSubcategory = 'hombro' | 'rodilla' | 'otros';

export type ReemplazoSubcategory = 'cadera' | 'rodilla';

export type ItemStatus = 
  | 'disponible' 
  | 'apartado' 
  | 'en_consignacion' 
  | 'en_revision' 
  | 'agotado';

export type StockHealth = 'critico' | 'bajo' | 'optimo' | 'exceso';

/**
 * Representa una pieza individual dentro de un Set Quirúrgico o Caja de Cirugía
 */
export interface SetPiece {
  id: string;
  codigo: string;             // ej: "HOM-01", "PZ-05", "ART-012"
  nombre: string;             // ej: "Palpador Artroscópico Graduado 90°"
  cantidad: number;           // ej: 1, 2, 4
  categoriaPieza?: string;    // ej: "Palpación", "Corte", "Tracción", "Acceso/Cánulas", "Fijación", "Bandeja"
  estadoPieza: 'completa' | 'en_revision' | 'desgastada' | 'faltante' | 'esterilizada';
  posicionBandeja?: string;   // ej: "Bandeja Superior - Ranura 2", "Nivel 2"
  numeroSerie?: string;
  observaciones?: string;
  verificadoQuirurgico?: boolean; // Para checklist de conteo pre/post quirúrgico
}

export interface InventoryItem {
  id: string;
  sku: string; // Código de referencia o catálogo interno
  nombre: string;
  descripcion: string;
  primaryCategory: PrimaryCategory;
  instrumentalCategory?: InstrumentalCategory; // Solo si primaryCategory === 'instrumental'
  artroscopiaSubcategory?: ArtroscopiaSubcategory; // Solo si instrumentalCategory === 'artroscopia'
  reemplazoSubcategory?: ReemplazoSubcategory; // Solo si instrumentalCategory === 'reemplazo_articular'
  subtipo?: string; // e.g. "Caja / Set Quirúrgico", "Implante", "Instrumental de Mano", "Equipo"
  
  // Soporte especializado para Sets de Instrumental
  esSet?: boolean; // true si es una caja/set compuesto por múltiples piezas
  totalPiezas?: number; // Total de piezas en el set
  piezas?: SetPiece[]; // Desglose detallado de las piezas que componen el set
  estadoSet?: 'completo' | 'incompleto_falta_pieza' | 'en_esterilizacion' | 'listo_cirugia';
  fechaUltimaRevisionPiezas?: string;
  responsableRevision?: string;

  // Datos de inventario interno y stock
  stockActual: number; // Cantidad de sets o unidades físicas en bodega
  stockMinimo: number;
  unidadMedida: 'sets' | 'cajas' | 'unidades' | 'piezas' | 'kits';
  ubicacion: string; // e.g. "Bodega Principal - Estante Instrumental B3"
  
  // Trazabilidad comercial y técnica
  lote: string;
  numeroSerie?: string;
  registroSanitario?: string; // Registro Sanitario / INVIMA / CE / FDA
  fabricante: string; // Stryker, DePuy Synthes, Zimmer Biomet, Smith & Nephew, Arthrex, etc.
  material?: string; // Titanio Ti-6Al-4V, Acero Quirúrgico 316L, PEEK, etc.
  
  // Estado comercial interno
  estado: ItemStatus;
  precioVenta?: number; // Precio de lista / venta comercial o alquiler por evento quirúrgico
  costoUnitario?: number; // Costo interno
  
  reservaCliente?: {
    cliente?: string;
    fechaReserva?: string;
    numeroPedido?: string;
  };

  notas?: string;
  fechaRegistro: string;
  ultimaActualizacion: string;
}

export interface StockMovement {
  id: string;
  itemId: string;
  itemNombre: string;
  sku: string;
  tipo: 'entrada' | 'salida_venta' | 'envio_consignacion' | 'retorno_consignacion' | 'ajuste';
  cantidad: number;
  fecha: string;
  responsable: string;
  clienteODestino?: string;
  motivo?: string;
  lote?: string;
  piezasVerificadas?: number; // Cantidad de piezas verificadas en el movimiento si es set
}

export interface InventoryFilterState {
  search: string;
  primaryCategory: 'todos' | PrimaryCategory;
  instrumentalCategory: 'todos' | InstrumentalCategory;
  artroscopiaSubcategory: 'todos' | ArtroscopiaSubcategory;
  reemplazoSubcategory: 'todos' | ReemplazoSubcategory;
  soloSets?: boolean; // Filtro para ver únicamente sets quirúrgicos
  estado: 'todos' | ItemStatus;
  stockHealth: 'todos' | 'critico_bajo' | 'critico' | 'bajo' | 'optimo';
  ubicacion: string;
  fabricante: string;
}
