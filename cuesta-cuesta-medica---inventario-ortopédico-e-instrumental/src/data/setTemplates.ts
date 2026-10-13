import { SetPiece } from '../types/inventory';

export interface SetTemplate {
  id: string;
  nombre: string;
  categoria: 'artroscopia_hombro' | 'artroscopia_rodilla' | 'osteosintesis' | 'cadera' | 'rodilla';
  totalPiezas: number;
  descripcion: string;
  piezas: Omit<SetPiece, 'id'>[];
}

export const SURGICAL_SET_TEMPLATES: SetTemplate[] = [
  {
    id: 'tpl-art-hombro-23',
    nombre: 'Set de Artroscopia de Hombro (23 piezas)',
    categoria: 'artroscopia_hombro',
    totalPiezas: 23,
    descripcion: 'Instrumental quirúrgico especializado para reparación de manguito rotador, inestabilidad glenohumeral (Bankart) y SLAP.',
    piezas: [
      {
        codigo: 'HOM-01',
        nombre: 'Palpador Artroscópico Graduado en Milímetros 90°',
        cantidad: 1,
        categoriaPieza: 'Palpación y Exploración',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja Superior - Ranura 1',
        observaciones: 'Punta calibrada en 5mm'
      },
      {
        codigo: 'HOM-02',
        nombre: 'Tijera Artroscópica Curva Izquierda de Perfil Bajo',
        cantidad: 1,
        categoriaPieza: 'Corte y Resección',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja Superior - Ranura 2',
        observaciones: 'Filo óptimo'
      },
      {
        codigo: 'HOM-03',
        nombre: 'Tijera Artroscópica Curva Derecha de Perfil Bajo',
        cantidad: 1,
        categoriaPieza: 'Corte y Resección',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja Superior - Ranura 3',
        observaciones: 'Filo óptimo'
      },
      {
        codigo: 'HOM-04',
        nombre: 'Pinza Basket Punch Recto de 15° con Extractor',
        cantidad: 1,
        categoriaPieza: 'Corte y Resección',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja Superior - Ranura 4',
        observaciones: 'Mecanismo de resorte suave'
      },
      {
        codigo: 'HOM-05',
        nombre: 'Pinza Grasper de Agarre Artroscópico con Cremallera',
        cantidad: 1,
        categoriaPieza: 'Tracción y Agarre',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja Superior - Ranura 5',
        observaciones: 'Mandíbulas dentadas antideslizantes'
      },
      {
        codigo: 'HOM-06',
        nombre: 'Pinza Grasper Rotatoria 360° para Manejo de Suturas',
        cantidad: 1,
        categoriaPieza: 'Tracción y Agarre',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja Superior - Ranura 6',
        observaciones: 'Rotación con bloqueo'
      },
      {
        codigo: 'HOM-07',
        nombre: 'Pasador de Sutura Scorpion FastPass con Aguja Reutilizable',
        cantidad: 1,
        categoriaPieza: 'Sutura y Pasaje',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja Superior - Ranura 7',
        observaciones: 'Gatillo calibrado'
      },
      {
        codigo: 'HOM-08',
        nombre: 'Empujador de Nudos Artroscópico Cerrado (Knot Pusher)',
        cantidad: 1,
        categoriaPieza: 'Fijación de Nudos',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja Superior - Ranura 8'
      },
      {
        codigo: 'HOM-09',
        nombre: 'Cortador de Sutura Artroscópico Distal con Tope',
        cantidad: 1,
        categoriaPieza: 'Corte de Sutura',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja Superior - Ranura 9'
      },
      {
        codigo: 'HOM-10',
        nombre: 'Cureta Artroscópica Acodada 30° para Preparación Ósea',
        cantidad: 1,
        categoriaPieza: 'Preparación Ósea',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja Superior - Ranura 10'
      },
      {
        codigo: 'HOM-11',
        nombre: 'Raspador de Tejido Blando / Elevador de Periostio 15°',
        cantidad: 1,
        categoriaPieza: 'Preparación de Tejido',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja Superior - Ranura 11'
      },
      {
        codigo: 'HOM-12',
        nombre: 'Cánula Roscada Transparente con Válvula 8.25mm x 7cm',
        cantidad: 2,
        categoriaPieza: 'Acceso y Cánulas',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja Inferior - Compartimiento Cánulas',
        observaciones: '2 unidades selladas'
      },
      {
        codigo: 'HOM-13',
        nombre: 'Cánula Lisa de Trabajo 7.0mm x 7cm con Válvula Dam',
        cantidad: 2,
        categoriaPieza: 'Acceso y Cánulas',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja Inferior - Compartimiento Cánulas',
        observaciones: '2 unidades'
      },
      {
        codigo: 'HOM-14',
        nombre: 'Obturador Cónico Romo para Cánula 8.25mm',
        cantidad: 2,
        categoriaPieza: 'Acceso y Cánulas',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja Inferior',
        observaciones: '2 unidades'
      },
      {
        codigo: 'HOM-15',
        nombre: 'Trocár Piramidal Cortante con Camisa de Protección',
        cantidad: 1,
        categoriaPieza: 'Acceso Quirúrgico',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja Inferior'
      },
      {
        codigo: 'HOM-16',
        nombre: 'Guía de Broca para Arpón 2.8mm con Mango Angulado',
        cantidad: 1,
        categoriaPieza: 'Guías de Inserción',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja Inferior'
      },
      {
        codigo: 'HOM-17',
        nombre: 'Broca Canulada Calibrada de 2.8mm Acero Quirúrgico',
        cantidad: 1,
        categoriaPieza: 'Perforación',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja Inferior'
      },
      {
        codigo: 'HOM-18',
        nombre: 'Atornillador Hexagonal Canulado con Mango de Silicona',
        cantidad: 1,
        categoriaPieza: 'Inserción de Implantes',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja Inferior'
      },
      {
        codigo: 'HOM-19',
        nombre: 'Vástago Medidor de Profundidad Subacromial',
        cantidad: 1,
        categoriaPieza: 'Medición',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja Inferior'
      },
      {
        codigo: 'HOM-20',
        nombre: 'Bandeja Perforada de Esterilización con Tapete de Silicona',
        cantidad: 1,
        categoriaPieza: 'Contenedor y Resguardo',
        estadoPieza: 'completa',
        posicionBandeja: 'Base Contenedor',
        observaciones: 'Grado autoclave 134°C'
      }
    ]
  },
  {
    id: 'tpl-art-rodilla-18',
    nombre: 'Set de Artroscopia de Rodilla y Reconstrucción LCA (18 piezas)',
    categoria: 'artroscopia_rodilla',
    totalPiezas: 18,
    descripcion: 'Instrumental para meniscectomía, sutura meniscal y perforación de túneles femoral/tibial en LCA.',
    piezas: [
      {
        codigo: 'ROD-01',
        nombre: 'Palpador Artroscópico Graduado 4mm',
        cantidad: 1,
        categoriaPieza: 'Palpación',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja Superior'
      },
      {
        codigo: 'ROD-02',
        nombre: 'Pinza Basket Punch Recta 15° Meniscal',
        cantidad: 1,
        categoriaPieza: 'Corte Meniscal',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja Superior'
      },
      {
        codigo: 'ROD-03',
        nombre: 'Pinza Basket Punch Curva Izquierda',
        cantidad: 1,
        categoriaPieza: 'Corte Meniscal',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja Superior'
      },
      {
        codigo: 'ROD-04',
        nombre: 'Pinza Basket Punch Curva Derecha',
        cantidad: 1,
        categoriaPieza: 'Corte Meniscal',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja Superior'
      },
      {
        codigo: 'ROD-05',
        nombre: 'Pinza Grasper para Extracción de Cuerpos Libres',
        cantidad: 1,
        categoriaPieza: 'Extracción',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja Superior'
      },
      {
        codigo: 'ROD-06',
        nombre: 'Tijera Artroscópica Recta de Microcorte',
        cantidad: 1,
        categoriaPieza: 'Corte',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja Superior'
      },
      {
        codigo: 'ROD-07',
        nombre: 'Guía de Túnel Tibial LCA con Arco Graduado 45°-65°',
        cantidad: 1,
        categoriaPieza: 'Guías de Túnel',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja Inferior'
      },
      {
        codigo: 'ROD-08',
        nombre: 'Guía de Offset Femoral LCA 5mm / 6mm / 7mm',
        cantidad: 1,
        categoriaPieza: 'Guías de Túnel',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja Inferior'
      },
      {
        codigo: 'ROD-09',
        nombre: 'Camisa Guía de Perforación con Bloqueo de Pasador',
        cantidad: 1,
        categoriaPieza: 'Guías de Túnel',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja Inferior'
      },
      {
        codigo: 'ROD-10',
        nombre: 'Broca Canulada para Túnel 8.0mm',
        cantidad: 1,
        categoriaPieza: 'Brocas',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja Inferior'
      },
      {
        codigo: 'ROD-11',
        nombre: 'Broca Canulada para Túnel 9.0mm',
        cantidad: 1,
        categoriaPieza: 'Brocas',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja Inferior'
      },
      {
        codigo: 'ROD-12',
        nombre: 'Tornillo Machuelo Canulado para Fémur',
        cantidad: 1,
        categoriaPieza: 'Roscado',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja Inferior'
      },
      {
        codigo: 'ROD-13',
        nombre: 'Atornillador Canulado para Tornillos de Interferencia',
        cantidad: 1,
        categoriaPieza: 'Inserción',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja Inferior'
      },
      {
        codigo: 'ROD-14',
        nombre: 'Pasador de Alambre / Guía de Injerto de Nitinol',
        cantidad: 2,
        categoriaPieza: 'Pasadores',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja Inferior',
        observaciones: '2 unidades'
      },
      {
        codigo: 'ROD-15',
        nombre: 'Medidor de Profundidad de Túnel Femoral',
        cantidad: 1,
        categoriaPieza: 'Medición',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja Inferior'
      },
      {
        codigo: 'ROD-16',
        nombre: 'Cánula Artroscópica con Válvula 6.5mm',
        cantidad: 1,
        categoriaPieza: 'Acceso',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja Inferior'
      },
      {
        codigo: 'ROD-17',
        nombre: 'Bandeja de Aluminio Anodizado con Tapa',
        cantidad: 1,
        categoriaPieza: 'Contenedor',
        estadoPieza: 'completa',
        posicionBandeja: 'Base'
      }
    ]
  },
  {
    id: 'tpl-ost-pequenos-22',
    nombre: 'Caja Instrumental Pequeños Fragmentos 3.5mm LCP (22 piezas)',
    categoria: 'osteosintesis',
    totalPiezas: 22,
    descripcion: 'Instrumental para osteosíntesis de radio, cúbito, peroné y clavícula con placas y tornillos bloqueados.',
    piezas: [
      {
        codigo: 'PF-01',
        nombre: 'Atornillador Dinamométrico con Limitador de Torque 1.5 Nm',
        cantidad: 1,
        categoriaPieza: 'Atornillado',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja Nivel 1'
      },
      {
        codigo: 'PF-02',
        nombre: 'Vástago Hexagonal Stardrive T15 con Acople Rápido',
        cantidad: 2,
        categoriaPieza: 'Puntas de Atornillador',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja Nivel 1'
      },
      {
        codigo: 'PF-03',
        nombre: 'Guía de Broca Doble 3.5 / 2.5mm',
        cantidad: 2,
        categoriaPieza: 'Guías',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja Nivel 1'
      },
      {
        codigo: 'PF-04',
        nombre: 'Guía de Broca Bloqueada Roscada LCP 3.5mm',
        cantidad: 2,
        categoriaPieza: 'Guías Bloqueadas',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja Nivel 1'
      },
      {
        codigo: 'PF-05',
        nombre: 'Medidor de Profundidad para Tornillos de 3.5mm (hasta 60mm)',
        cantidad: 1,
        categoriaPieza: 'Medición',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja Nivel 1'
      },
      {
        codigo: 'PF-06',
        nombre: 'Broca de Acero Quirúrgico 2.5mm con Acople Rápido',
        cantidad: 2,
        categoriaPieza: 'Brocas',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja Nivel 1'
      },
      {
        codigo: 'PF-07',
        nombre: 'Broca de Acero Quirúrgico 3.5mm para Orificio de Fricción',
        cantidad: 1,
        categoriaPieza: 'Brocas',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja Nivel 1'
      },
      {
        codigo: 'PF-08',
        nombre: 'Machuelo Cortical 3.5mm con Mango Canulado',
        cantidad: 1,
        categoriaPieza: 'Roscado',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja Nivel 1'
      },
      {
        codigo: 'PF-09',
        nombre: 'Pinza de Reducción Ósea con Puntas Agudas y Cremallera',
        cantidad: 2,
        categoriaPieza: 'Reducción Ósea',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja Nivel 2'
      },
      {
        codigo: 'PF-10',
        nombre: 'Pinza de Reducción Verbrugge Autocentrante con Rosca',
        cantidad: 2,
        categoriaPieza: 'Reducción Ósea',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja Nivel 2'
      },
      {
        codigo: 'PF-11',
        nombre: 'Doblador de Placas Anatómico Par (Derecho e Izquierdo)',
        cantidad: 2,
        categoriaPieza: 'Moldeado',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja Nivel 2'
      },
      {
        codigo: 'PF-12',
        nombre: 'Separadores de Hohmann Cortos 8mm de Punta Roma',
        cantidad: 2,
        categoriaPieza: 'Separación',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja Nivel 2'
      },
      {
        codigo: 'PF-13',
        nombre: 'Contenedor Metálico Perforado con Cierre de Seguridad',
        cantidad: 1,
        categoriaPieza: 'Contenedor',
        estadoPieza: 'completa',
        posicionBandeja: 'Base'
      }
    ]
  },
  {
    id: 'tpl-cad-fresado-18',
    nombre: 'Set Instrumental de Fresado y Preparación Acetabular de Cadera (18 piezas)',
    categoria: 'cadera',
    totalPiezas: 18,
    descripcion: 'Fresas acetabulares hemisféricas de alta precisión y mangos de acople para reemplazo total de cadera.',
    piezas: [
      {
        codigo: 'FRS-01',
        nombre: 'Mango de Fresado Acetabular Acodado con Acople Rápido',
        cantidad: 1,
        categoriaPieza: 'Mangos de Fresado',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja Principal'
      },
      {
        codigo: 'FRS-02',
        nombre: 'Mango de Fresado Recto Modular',
        cantidad: 1,
        categoriaPieza: 'Mangos de Fresado',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja Principal'
      },
      {
        codigo: 'FRS-03',
        nombre: 'Fresa Acetabular Hemisférica 44mm',
        cantidad: 1,
        categoriaPieza: 'Fresas',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja de Fresas'
      },
      {
        codigo: 'FRS-04',
        nombre: 'Fresa Acetabular Hemisférica 46mm',
        cantidad: 1,
        categoriaPieza: 'Fresas',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja de Fresas'
      },
      {
        codigo: 'FRS-05',
        nombre: 'Fresa Acetabular Hemisférica 48mm',
        cantidad: 1,
        categoriaPieza: 'Fresas',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja de Fresas'
      },
      {
        codigo: 'FRS-06',
        nombre: 'Fresa Acetabular Hemisférica 50mm',
        cantidad: 1,
        categoriaPieza: 'Fresas',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja de Fresas'
      },
      {
        codigo: 'FRS-07',
        nombre: 'Fresa Acetabular Hemisférica 52mm',
        cantidad: 1,
        categoriaPieza: 'Fresas',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja de Fresas'
      },
      {
        codigo: 'FRS-08',
        nombre: 'Fresa Acetabular Hemisférica 54mm',
        cantidad: 1,
        categoriaPieza: 'Fresas',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja de Fresas'
      },
      {
        codigo: 'FRS-09',
        nombre: 'Fresa Acetabular Hemisférica 56mm',
        cantidad: 1,
        categoriaPieza: 'Fresas',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja de Fresas'
      },
      {
        codigo: 'FRS-10',
        nombre: 'Fresa Acetabular Hemisférica 58mm',
        cantidad: 1,
        categoriaPieza: 'Fresas',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja de Fresas'
      },
      {
        codigo: 'FRS-11',
        nombre: 'Fresa Acetabular Hemisférica 60mm',
        cantidad: 1,
        categoriaPieza: 'Fresas',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja de Fresas'
      },
      {
        codigo: 'FRS-12',
        nombre: 'Fresa Acetabular Hemisférica 62mm',
        cantidad: 1,
        categoriaPieza: 'Fresas',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja de Fresas'
      },
      {
        codigo: 'FRS-13',
        nombre: 'Impactador de Copa Acetabular Orientable con Guía de Anteversión',
        cantidad: 1,
        categoriaPieza: 'Impactador',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja Principal'
      },
      {
        codigo: 'FRS-14',
        nombre: 'Guía de Posicionamiento Acetabular 45° Inclinación / 20° Anteversión',
        cantidad: 1,
        categoriaPieza: 'Guías de Orientación',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja Principal'
      },
      {
        codigo: 'FRS-15',
        nombre: 'Atornillador Universal Cardánico Flexible para Tornillos de Copa',
        cantidad: 1,
        categoriaPieza: 'Atornillado',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja Principal'
      },
      {
        codigo: 'FRS-16',
        nombre: 'Guía de Broca para Tornillos de Copa 3.2mm',
        cantidad: 1,
        categoriaPieza: 'Guías',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja Principal'
      },
      {
        codigo: 'FRS-17',
        nombre: 'Medidor de Profundidad de Tornillos de Copa',
        cantidad: 1,
        categoriaPieza: 'Medición',
        estadoPieza: 'completa',
        posicionBandeja: 'Bandeja Principal'
      },
      {
        codigo: 'FRS-18',
        nombre: 'Bandeja Contenedora de Esterilización con Ranuras Graduadas',
        cantidad: 1,
        categoriaPieza: 'Contenedor',
        estadoPieza: 'completa',
        posicionBandeja: 'Base'
      }
    ]
  }
];
