/**
 * Dados realistas de imóveis da região do ABC para seed/demonstração
 * Baseados em valores e características reais do mercado imobiliário do ABC Paulista
 */

export interface SeedProperty {
  id: string;
  title: string;
  description: string;
  type: 'apartment' | 'house' | 'commercial' | 'land' | 'kitnet';
  operation: 'sale' | 'rent';
  price: number;
  area_m2: number;
  bedrooms: number;
  bathrooms: number;
  parking_spots: number;
  city: string;
  neighborhood: string;
  address: string;
  features: string[];
  images: string[];
  source: string;
  source_url?: string;
  contact_name: string;
  contact_phone: string;
  active: boolean;
}

export const SEED_PROPERTIES: Omit<SeedProperty, 'id'>[] = [
  // ===================== SANTO ANDRÉ =====================
  {
    title: 'Apartamento 3 dormitórios com suíte - Centro de Santo André',
    description: 'Excelente apartamento no coração de Santo André. 3 dormitórios sendo 1 suíte, sala ampla com varanda gourmet, cozinha planejada, 2 vagas de garagem. Condomínio com piscina, academia e salão de festas. Próximo ao Metrô Capuava.',
    type: 'apartment', operation: 'sale', price: 580000,
    area_m2: 98, bedrooms: 3, bathrooms: 2, parking_spots: 2,
    city: 'Santo André', neighborhood: 'Centro',
    address: 'Rua Coronel Oliveira Lima, 250 - Centro, Santo André',
    features: ['pool', 'gym', 'elevator', 'balcony', 'gated', 'party_room'],
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'],
    source: 'vivareal', contact_name: 'Imobiliária ABC Premium', contact_phone: '(11) 4435-2200', active: true,
  },
  {
    title: 'Apartamento 2 dormitórios - Bairro Jardim - Santo André',
    description: 'Apartamento bem localizado no Jardim. 2 dormitórios, sala, cozinha, área de serviço. 1 vaga de garagem. Condomínio com portaria 24h. Fácil acesso às principais vias.',
    type: 'apartment', operation: 'rent', price: 1800,
    area_m2: 65, bedrooms: 2, bathrooms: 1, parking_spots: 1,
    city: 'Santo André', neighborhood: 'Jardim',
    address: 'Av. Industrial, 1050 - Jardim, Santo André',
    features: ['elevator', 'gated'],
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
    source: 'olx', contact_name: 'João Mendes', contact_phone: '(11) 97823-4501', active: true,
  },
  {
    title: 'Casa 4 dormitórios com piscina - Vila Assunção, Santo André',
    description: 'Espetacular casa em condomínio fechado na Vila Assunção. 4 dormitórios com 2 suítes, escritório, sala de jantar e living, piscina aquecida, churrasqueira, 3 vagas. Acabamento de alto padrão.',
    type: 'house', operation: 'sale', price: 1850000,
    area_m2: 280, bedrooms: 4, bathrooms: 4, parking_spots: 3,
    city: 'Santo André', neighborhood: 'Vila Assunção',
    address: 'Rua das Magnólias, 85 - Vila Assunção, Santo André',
    features: ['pool', 'gym', 'gated', 'balcony', 'party_room', 'furnished'],
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
    source: 'zapimoveis', contact_name: 'Construtora Sonho Real', contact_phone: '(11) 4448-9900', active: true,
  },
  {
    title: 'Kitnet mobiliada - próximo UFABC, Santo André',
    description: 'Kitnet totalmente mobiliada e equipada. Ideal para estudantes da UFABC. Studio com cama, mesa, armário embutido, geladeira e microondas inclusos. Água inclusa no aluguel.',
    type: 'kitnet', operation: 'rent', price: 950,
    area_m2: 28, bedrooms: 0, bathrooms: 1, parking_spots: 0,
    city: 'Santo André', neighborhood: 'Bangu',
    address: 'Rua Professor Fernando Rios, 200 - Bangu, Santo André',
    features: ['furnished', 'elevator'],
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
    source: 'olx', contact_name: 'Proprietária Maria Helena', contact_phone: '(11) 98712-6633', active: true,
  },
  {
    title: 'Sala Comercial 45m² - Centro Empresarial, Santo André',
    description: 'Sala comercial em excelente localização no Centro de Santo André. 45m², recepção, 2 ambientes, banheiro privativo, 1 vaga de garagem. Prédio com segurança 24h.',
    type: 'commercial', operation: 'rent', price: 2200,
    area_m2: 45, bedrooms: 0, bathrooms: 1, parking_spots: 1,
    city: 'Santo André', neighborhood: 'Centro',
    address: 'Av. Dom Pedro II, 500, Sala 301 - Centro, Santo André',
    features: ['elevator', 'gated'],
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'],
    source: 'vivareal', contact_name: 'JR Imóveis Comerciais', contact_phone: '(11) 4422-7788', active: true,
  },

  // ===================== SÃO BERNARDO DO CAMPO =====================
  {
    title: 'Apartamento 3 suítes com vista - Nova Petrópolis, SBC',
    description: 'Imponente apartamento com vista panorâmica em Nova Petrópolis. 3 suítes com closet, sala ampla para 3 ambientes, varanda gourmet com churrasqueira, 3 vagas cobertas. Condomínio com rooftop e piscina.',
    type: 'apartment', operation: 'sale', price: 920000,
    area_m2: 145, bedrooms: 3, bathrooms: 3, parking_spots: 3,
    city: 'São Bernardo do Campo', neighborhood: 'Nova Petrópolis',
    address: 'Rua Marechal Deodoro, 1200, Ap 154 - Nova Petrópolis, SBC',
    features: ['pool', 'gym', 'elevator', 'balcony', 'gated', 'party_room', 'rooftop'],
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
    source: 'zapimoveis', contact_name: 'Morar Bem SBC', contact_phone: '(11) 4348-7700', active: true,
  },
  {
    title: 'Casa de Alvenaria 2 dormitórios - Riacho Grande, SBC',
    description: 'Casa aconchegante em Riacho Grande. 2 dormitórios, sala, cozinha, quintal espaçoso. Ótima para primeira moradia. Bairro tranquilo e residencial.',
    type: 'house', operation: 'sale', price: 340000,
    area_m2: 80, bedrooms: 2, bathrooms: 1, parking_spots: 1,
    city: 'São Bernardo do Campo', neighborhood: 'Riacho Grande',
    address: 'Rua das Orquídeas, 52 - Riacho Grande, SBC',
    features: ['gated'],
    images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800'],
    source: 'olx', contact_name: 'Proprietário Carlos Silva', contact_phone: '(11) 96541-3322', active: true,
  },
  {
    title: 'Apartamento 2 dormitórios - Assunção, SBC',
    description: 'Ótimo apartamento para locação no bairro Assunção. 2 dormitórios, sala, banheiro, cozinha. Prédio com portaria e garagem para 1 carro.',
    type: 'apartment', operation: 'rent', price: 1650,
    area_m2: 60, bedrooms: 2, bathrooms: 1, parking_spots: 1,
    city: 'São Bernardo do Campo', neighborhood: 'Assunção',
    address: 'Av. Senador Vergueiro, 3000, Ap 42 - Assunção, SBC',
    features: ['elevator', 'gated'],
    images: ['https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800'],
    source: 'vivareal', contact_name: 'Imobiliária Sul do ABC', contact_phone: '(11) 4333-5500', active: true,
  },
  {
    title: 'Terreno 300m² - Rudge Ramos, SBC',
    description: 'Terreno plano e bem localizado em Rudge Ramos. 10x30m, documentação regularizada, próximo à escola e comércio. Ideal para construção de casa ou pequeno condomínio.',
    type: 'land', operation: 'sale', price: 280000,
    area_m2: 300, bedrooms: 0, bathrooms: 0, parking_spots: 0,
    city: 'São Bernardo do Campo', neighborhood: 'Rudge Ramos',
    address: 'Rua Afonso Celso, 400 - Rudge Ramos, SBC',
    features: [],
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'],
    source: 'olx', contact_name: 'Marcelo Santos', contact_phone: '(11) 97654-2211', active: true,
  },
  {
    title: 'Galpão Industrial 800m² - Demarchi, SBC',
    description: 'Galpão industrial em excelente localização. 800m² de área total, pé-direito de 7m, 2 banheiros, área administrativa, pátio externo. Acesso fácil pela Via Anchieta.',
    type: 'commercial', operation: 'rent', price: 12000,
    area_m2: 800, bedrooms: 0, bathrooms: 2, parking_spots: 10,
    city: 'São Bernardo do Campo', neighborhood: 'Demarchi',
    address: 'Rua dos Trabalhadores, 1500 - Demarchi, SBC',
    features: ['gated'],
    images: ['https://images.unsplash.com/photo-1565793219834-f4dde9e4c00a?w=800'],
    source: 'zapimoveis', contact_name: 'ABC Industrial Imóveis', contact_phone: '(11) 4339-6600', active: true,
  },

  // ===================== SÃO CAETANO DO SUL =====================
  {
    title: 'Apartamento Alto Padrão 3 suítes - Barcelona, SCS',
    description: 'Sofisticado apartamento no premiado bairro Barcelona. 3 suítes sendo a master com closet, home theater, varanda gourmet, 3 vagas + depósito. Condomínio clube com piscina aquecida, sauna e academia top.',
    type: 'apartment', operation: 'sale', price: 1350000,
    area_m2: 160, bedrooms: 3, bathrooms: 3, parking_spots: 3,
    city: 'São Caetano do Sul', neighborhood: 'Barcelona',
    address: 'Av. Goiás, 800, Ap 201 - Barcelona, São Caetano do Sul',
    features: ['pool', 'gym', 'elevator', 'balcony', 'gated', 'party_room', 'sauna', 'pet_friendly'],
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'],
    source: 'zapimoveis', contact_name: 'Prime Real Estate SCS', contact_phone: '(11) 4223-9900', active: true,
  },
  {
    title: 'Apartamento 2 dormitórios - Nova Gerty, São Caetano',
    description: 'Apartamento bem conservado em Nova Gerty. 2 dormitórios, sala, cozinha, 1 banheiro, 1 vaga. Próximo a escolas e supermercados. Ótimo bairro familiar.',
    type: 'apartment', operation: 'rent', price: 1900,
    area_m2: 68, bedrooms: 2, bathrooms: 1, parking_spots: 1,
    city: 'São Caetano do Sul', neighborhood: 'Nova Gerty',
    address: 'Rua Visconde do Rio Branco, 150, Ap 23 - Nova Gerty, SCS',
    features: ['elevator', 'gated'],
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
    source: 'vivareal', contact_name: 'Imobiliária Centro-Sul', contact_phone: '(11) 4229-3344', active: true,
  },
  {
    title: 'Casa 3 dormitórios - Santo Antônio, São Caetano',
    description: 'Linda casa em São Caetano. 3 dormitórios, sala com lareira, cozinha americana moderna, quintal com piscina e churrasqueira. 2 vagas de garagem.',
    type: 'house', operation: 'sale', price: 875000,
    area_m2: 180, bedrooms: 3, bathrooms: 2, parking_spots: 2,
    city: 'São Caetano do Sul', neighborhood: 'Santo Antônio',
    address: 'Rua Leopoldina, 300 - Santo Antônio, SCS',
    features: ['pool', 'balcony', 'gated'],
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
    source: 'olx', contact_name: 'Ana Oliveira', contact_phone: '(11) 98821-4400', active: true,
  },

  // ===================== DIADEMA =====================
  {
    title: 'Apartamento 2 dormitórios - Centro de Diadema',
    description: 'Apartamento novo em Diadema. 2 dormitórios, sala, cozinha, área de serviço, 1 vaga. Condomínio recém-construído com portaria eletrônica.',
    type: 'apartment', operation: 'sale', price: 295000,
    area_m2: 58, bedrooms: 2, bathrooms: 1, parking_spots: 1,
    city: 'Diadema', neighborhood: 'Centro',
    address: 'Av. Antônio Piranga, 450, Ap 12 - Centro, Diadema',
    features: ['elevator', 'gated'],
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
    source: 'vivareal', contact_name: 'Incorporadora Diadema Nova', contact_phone: '(11) 4056-7700', active: true,
  },
  {
    title: 'Casa 3 quartos com quintal - Conceição, Diadema',
    description: 'Casa espaçosa em Diadema. 3 quartos, sala grande, cozinha, quintal com área de lazer. Ótimo custo-benefício para família.',
    type: 'house', operation: 'rent', price: 2100,
    area_m2: 110, bedrooms: 3, bathrooms: 2, parking_spots: 2,
    city: 'Diadema', neighborhood: 'Conceição',
    address: 'Rua das Primaveras, 78 - Conceição, Diadema',
    features: ['gated'],
    images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800'],
    source: 'olx', contact_name: 'Roberto Nunes', contact_phone: '(11) 97234-5521', active: true,
  },

  // ===================== MAUÁ =====================
  {
    title: 'Apartamento 2 dormitórios - Jardim Zaíra, Mauá',
    description: 'Apartamento aconchegante em Mauá. 2 dormitórios, sala, cozinha com armários, 1 vaga de garagem. Condomínio tranquilo e bem cuidado.',
    type: 'apartment', operation: 'sale', price: 255000,
    area_m2: 55, bedrooms: 2, bathrooms: 1, parking_spots: 1,
    city: 'Mauá', neighborhood: 'Jardim Zaíra',
    address: 'Rua Dr. Paulo Frontin, 200, Ap 31 - Jardim Zaíra, Mauá',
    features: ['elevator', 'gated'],
    images: ['https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800'],
    source: 'vivareal', contact_name: 'Mauá Imóveis', contact_phone: '(11) 4558-2200', active: true,
  },
  {
    title: 'Casa 2 quartos - Vila Mercedes, Mauá',
    description: 'Casa simples e bem localizada. 2 quartos, sala, cozinha, quintal. Boa opção para primeiro imóvel.',
    type: 'house', operation: 'sale', price: 190000,
    area_m2: 70, bedrooms: 2, bathrooms: 1, parking_spots: 0,
    city: 'Mauá', neighborhood: 'Vila Mercedes',
    address: 'Rua Pernambuco, 88 - Vila Mercedes, Mauá',
    features: [],
    images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800'],
    source: 'olx', contact_name: 'Fernanda Costa', contact_phone: '(11) 96322-1190', active: true,
  },

  // ===================== RIBEIRÃO PIRES =====================
  {
    title: 'Chácara 5.000m² - Parque Aliança, Ribeirão Pires',
    description: 'Belíssima chácara em Ribeirão Pires. 5.000m² de terreno com casa principal de 200m², piscina, lago artificial, pomar, horta. Perfeita para lazer e moradia em contato com a natureza.',
    type: 'house', operation: 'sale', price: 1100000,
    area_m2: 5000, bedrooms: 4, bathrooms: 3, parking_spots: 5,
    city: 'Ribeirão Pires', neighborhood: 'Parque Aliança',
    address: 'Estrada do Alvarenga, 4500 - Parque Aliança, Ribeirão Pires',
    features: ['pool', 'gated', 'party_room'],
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'],
    source: 'zapimoveis', contact_name: 'Chácaras ABC', contact_phone: '(11) 4822-3311', active: true,
  },
  {
    title: 'Apartamento 2 dormitórios - Centro, Ribeirão Pires',
    description: 'Ótimo apartamento no centro de Ribeirão Pires. 2 dormitórios, sala, cozinha, 1 vaga. Próximo a todo o comércio.',
    type: 'apartment', operation: 'rent', price: 1400,
    area_m2: 58, bedrooms: 2, bathrooms: 1, parking_spots: 1,
    city: 'Ribeirão Pires', neighborhood: 'Centro',
    address: 'Rua Gen. Osório, 300, Ap 5 - Centro, Ribeirão Pires',
    features: ['elevator'],
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
    source: 'olx', contact_name: 'Proprietário', contact_phone: '(11) 97822-6600', active: true,
  },
];
