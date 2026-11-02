import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";

const articles = [
  {
    slug: "10-destinos-nordeste",
    title: "10 Destinos Imperdíveis no Nordeste Brasileiro",
    excerpt: "Do litoral paradisíaco de Alagoas às dunas do Maranhão, o Nordeste guarda tesouros que vão transformar sua próxima viagem.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
    tags: ["Nordeste", "Praia"],
    tagColor: "bg-orange-100 text-orange-700",
    date: "15 Nov 2024",
    readTime: "8 min",
    content: [
      "O Nordeste brasileiro é uma região de contrastes fascinantes: de praias desertas com água cristalina a dunas que parecem outro planeta, passando por cidades coloniais preservadas e uma gastronomia única. Com mais de 3.000 km de litoral, é impossível visitar tudo em uma só viagem — mas alguns destinos são absolutamente essenciais.",
      "Entre os destaques estão Jericoacoara no Ceará, com suas lagoas de água doce e pôr do sol sobre as dunas; Maragogi em Alagoas, cujas piscinas naturais ficam em águas tão claras que parecem aquário; e a Chapada Diamantina na Bahia, onde cachoeiras espetaculares se escondem entre trilhas de tirar o fôlego. Cada um oferece uma experiência completamente diferente.",
      "Para quem busca tranquilidade e autenticidade, Galinhos no Rio Grande do Norte é uma vila de pescadores acessível apenas de barco, sem carros nas ruas. Já Trancoso na Bahia combina praias selvagens com uma vida noturna sofisticada ao redor do famoso Quadrado. A escolha do destino depende muito do perfil do viajante — mas a certeza é que o Nordeste sempre supera as expectativas.",
      "A melhor época para visitar a maioria dos destinos nordestinos é entre julho e dezembro, quando as chuvas são mais escassas e o sol predomina. No entanto, cada estado tem suas particularidades climáticas, e mesmo na época chuvosa é possível encontrar dias ensolarados. O importante é pesquisar bem o destino específico e planejar com antecedência, especialmente para a alta temporada do verão e do réveillon.",
    ],
    related: ["gramado-inverno-guia", "chapada-diamantina-guia"],
  },
  {
    slug: "gramado-inverno-guia",
    title: "Gramado no Inverno: Guia Completo 2024",
    excerpt: "Descubra quando ir, onde se hospedar e o que fazer na cidade mais charmosa do Sul.",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=80",
    tags: ["Sul", "Frio"],
    tagColor: "bg-blue-100 text-blue-700",
    date: "10 Nov 2024",
    readTime: "10 min",
    content: [
      "Gramado é o destino de inverno mais procurado do Brasil, e por boas razões. A cidade gaúcha de influência alemã e italiana combina uma arquitetura europeia impecável com uma gastronomia reconfortante e uma natureza exuberante — especialmente entre junho e setembro, quando as temperaturas podem cair abaixo de zero e a possibilidade de neve deixa os visitantes encantados.",
      "O coração de Gramado é a famosa Rua Coberta, ladeada por chocolaterias, bistrôs e lojas de artesanato. A região tem mais de 100 atrações turísticas, dos parques temáticos aos jardins floridos. O Lago Negro é parada obrigatória para um passeio de pedalinho ao entardecer, e as fontes de chocolate quente espalhadas pela cidade são irresistíveis no frio.",
      "Em termos de hospedagem, Gramado tem desde pousadas charmosas para casais até grandes hotéis com spa para famílias. A recomendação é reservar com meses de antecedência no inverno — especialmente durante o Natal Luz, o festival mais famoso da cidade, que transforma Gramado em um cenário de conto de fadas entre outubro e janeiro.",
      "A gastronomia de Gramado é outro ponto alto: fondues de queijo e chocolate, cucas quentinhas, cafés coloniais fartos e cerveja artesanal produzida localmente. A poucos minutos de carro está Canela, cidade-irmã com o Parque do Caracol e a Cascata do Caracol, uma das cachoeiras mais belas do Sul do Brasil. Juntas, as duas cidades formam o roteiro perfeito para um fim de semana inesquecível.",
    ],
    related: ["10-destinos-nordeste", "roteiro-minas-gerais-historico"],
  },
  {
    slug: "chapada-diamantina-guia",
    title: "Chapada Diamantina: Tudo que você precisa saber",
    excerpt: "Cachoeiras escondidas, grutas iluminadas e trilhas épicas no coração da Bahia.",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=80",
    tags: ["Bahia", "Natureza"],
    tagColor: "bg-green-100 text-green-700",
    date: "5 Nov 2024",
    readTime: "12 min",
    content: [
      "A Chapada Diamantina, no interior da Bahia, é um dos destinos de ecoturismo mais espetaculares do Brasil. O parque nacional abriga uma diversidade impressionante de ecossistemas: campos rupestres, florestas, rios de água cristalina e formações rochosas que datam de milhões de anos. Lençóis é a cidade-base mais popular, mas Mucugê e Igatu também são excelentes pontos de partida.",
      "As cachoeiras da Chapada são o grande atrativo: a Cachoeira da Fumaça, com seus impressionantes 340 metros de queda livre, é visível de longe e exige uma trilha de aproximadamente 12 km. A Cachoeira do Sossego, escondida entre rochas, oferece uma piscina natural perfeita para um mergulho refrescante. E a Gruta Azul, acessível apenas de barco, tem águas de um azul inexplicável que encanta fotógrafos do mundo todo.",
      "Para quem gosta de aventura, a Chapada oferece trilhas de todos os níveis — de caminhadas leves de 2 horas a expedições de vários dias. O Morro do Pai Inácio, com suas vistas panorâmicas, e o Poço Encantado, com seu raio de luz que ilumina as águas verdes como mágica em certas horas do dia, são experiências únicas. Guias locais são indispensáveis para acessar as atrações mais remotas com segurança.",
      "A melhor época para visitar é entre junho e setembro, quando as trilhas estão mais secas e as cachoeiras cheias. Evite o período de chuvas intensas (novembro a março), quando muitas trilhas ficam inacessíveis. A hospedagem em Lençóis vai de hostels acolhedores a pousadas de charme, e a culinária baiana com cardápio regional completa a experiência de uma forma absolutamente deliciosa.",
    ],
    related: ["10-destinos-nordeste", "sao-thome-das-letras-mistico"],
  },
  {
    slug: "fernando-noronha-economize",
    title: "Fernando de Noronha: Como se Hospedar Gastando Menos",
    excerpt: "Estratégias para reduzir custos sem abrir mão da experiência única do arquipélago.",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80",
    tags: ["Nordeste", "Praia"],
    tagColor: "bg-orange-100 text-orange-700",
    date: "1 Nov 2024",
    readTime: "9 min",
    content: [
      "Fernando de Noronha tem a reputação de ser um dos destinos mais caros do Brasil — e não é por acaso. O arquipélago cobra uma Taxa de Preservação Ambiental (TPA) diária, os voos são limitados e a oferta de hospedagem é controlada. Mas com planejamento antecipado e algumas estratégias, é possível vivenciar este paraíso sem comprometer todo o orçamento do ano.",
      "A dica número um é viajar fora da alta temporada: nos meses de setembro a novembro, o mar está calmo, o sol predomina e os preços podem ser 30% a 40% menores do que em dezembro ou julho. Outra estratégia é reservar hospedagem com muita antecedência — pousadas e chalés se esgotam meses antes, e quem deixa para a última hora paga mais caro pelas poucas opções restantes.",
      "Optar por casas e quartos compartilhados no Airbnb ou pousadas menores pode reduzir significativamente o custo da hospedagem. Para as refeições, evite os restaurantes mais turísticos próximos às praias principais e explore as barracas locais com pratos por preços mais acessíveis — a qualidade é ótima e o clima é mais autêntico. Alugar uma buggy por dia (e não por excursão) também sai mais barato para quem quer explorar a ilha por conta própria.",
      "Calcule bem a TPA antes de ir: ela é cobrada por pessoa por dia e aumenta quanto mais tempo você fica na ilha, então estadias de 5 a 7 dias são o ponto ideal de custo-benefício. Se a ideia é mergulhar, compare os pacotes de diferentes operadoras — os preços variam bastante. Com planejamento, Fernando de Noronha pode ser um sonho possível sem dívidas.",
    ],
    related: ["10-destinos-nordeste", "chapada-diamantina-guia"],
  },
  {
    slug: "roteiro-minas-gerais-historico",
    title: "Roteiro de 7 dias em Minas Gerais Histórico",
    excerpt: "Ouro Preto, Tiradentes, Mariana e São João del-Rei formam um circuito histórico único.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
    tags: ["Sudeste", "Cultural"],
    tagColor: "bg-purple-100 text-purple-700",
    date: "25 Out 2024",
    readTime: "11 min",
    content: [
      "Minas Gerais é o estado brasileiro com a história mais rica e preservada. Fundadas durante o ciclo do ouro no século XVIII, as cidades históricas mineiras guardam igrejas barrocas, casarões coloniais e ruas de pedra que contam a história de um período que definiu o Brasil. Um roteiro de 7 dias permite conhecer os principais centros históricos com profundidade.",
      "Dias 1 e 2 em Ouro Preto: a joia da coroa do turismo histórico mineiro. A cidade-monumento da UNESCO impressiona com suas 13 igrejas barrocas, museus excelentes e vistas panorâmicas. A Igreja de São Francisco de Assis, com esculturas de Aleijadinho, é imperdível. No segundo dia, uma visita à vizinha Mariana, a primeira capital colonial de Minas, complementa bem o roteiro.",
      "Dias 3 e 4 em Tiradentes: considerada a cidade mais bem preservada de Minas, Tiradentes é pequena, tranquila e absolutamente encantadora. A Rua Direita concentra restaurantes premiados e as igrejas são abertas para visita durante todo o dia. São João del-Rei, a 15 minutos de carro, tem o charme adicional da famosa Estrada de Ferro — o trem que circula desde 1881 ainda leva turistas às cidades vizinhas.",
      "Dias 5, 6 e 7 podem ser dedicados a Diamantina, no norte de Minas, patrimônio histórico da humanidade pela UNESCO e cidade natal de Juscelino Kubitschek. A cidade tem um mercado municipal vibrante, uma catedral imponente e as cascatinhas do Sítio do Acaba Mundo para quem quer combinar história e natureza. Para a hospedagem, todas as cidades têm pousadas coloniais charmosas que completam a imersão histórica.",
    ],
    related: ["gramado-inverno-guia", "sao-thome-das-letras-mistico"],
  },
  {
    slug: "sao-thome-das-letras-mistico",
    title: "São Thomé das Letras: O Místico Sul de Minas",
    excerpt: "Construída em pedra quartzito e envolta em lendas, São Thomé é um destino único no Brasil.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80",
    tags: ["Minas", "Espiritual"],
    tagColor: "bg-indigo-100 text-indigo-700",
    date: "20 Out 2024",
    readTime: "7 min",
    content: [
      "São Thomé das Letras é uma cidade diferente de qualquer outra no Brasil. Construída inteiramente com pedras quartzito cinzas arrancadas das montanhas ao redor, a pequena cidade no sul de Minas Gerais parece saída de outro mundo — ou de outro tempo. Conhecida como a 'cidade dos místicos', atrai visitantes em busca de espiritualidade, natureza e silêncio.",
      "A cidade fica a 1.430 metros de altitude e oferece vistas impressionantes do Vale do Rio Verde. As cachoeiras ao redor são o principal atrativo natural: a Cachoeira Véu de Noiva, de 12 metros de queda livre, é acessível a pé; a Cachoeira Flor de Lis fica escondida numa trilha entre rochas; e o Poço do Miriti tem uma piscina natural de água fria e transparente. São mais de 20 quedas d'água catalogadas na região.",
      "A comunidade de São Thomé abraça o misticismo: histórias de OVNIs, portais energéticos e a 'lenda das letras' gravadas nas rochas (que deram nome à cidade) fazem parte da identidade local. O Vale do Matutu, a poucos quilômetros, é um refúgio alternativo com comunidade hippie, permacultura e um vórtice de energia que atrai viajantes de todo o mundo em busca de reconexão.",
      "A melhor época para visitar é durante o inverno mineiro (junho a agosto), quando as noites são frias e estreladas e as cachoeiras cheias. A cidade tem hospedagem simples mas acolhedora, com pousadas construídas nas próprias pedras da região. A gastronomia inclui pratos vegetarianos e veganos em abundância, além de lanches e sopas quentinhas perfeitas para o clima serrano. Um fim de semana em São Thomé é suficiente para se desconectar completamente do mundo.",
    ],
    related: ["roteiro-minas-gerais-historico", "chapada-diamantina-guia"],
  },
];

const slugMap = Object.fromEntries(articles.map(a => [a.slug, a]));

export function generateStaticParams() {
  return articles.map(a => ({ slug: a.slug }));
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = slugMap[params.slug];
  if (!article) notFound();

  const related = articles.filter(a => article.related.includes(a.slug));

  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      <Header />
      <div className="pt-20">
        {/* Hero image */}
        <div className="relative h-72 sm:h-96 overflow-hidden">
          <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 max-w-4xl mx-auto">
            <div className="flex gap-2 mb-3">
              {article.tags.map(tag => (
                <span key={tag} className={`text-xs font-semibold px-3 py-1 rounded-full ${article.tagColor}`}>
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">{article.title}</h1>
            <div className="flex items-center gap-4 mt-3 text-white/70 text-sm">
              <span>📅 {article.date}</span>
              <span>·</span>
              <span>⏱ {article.readTime} de leitura</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <Link href="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm mb-8 transition-colors">
            ← Voltar ao Blog
          </Link>

          <p className="text-lg text-gray-600 mb-8 leading-relaxed font-medium border-l-4 border-blue-500 pl-4">
            {article.excerpt}
          </p>

          <div className="space-y-6">
            {article.content.map((paragraph, i) => (
              <p key={i} className="text-gray-700 leading-relaxed text-base">
                {paragraph}
              </p>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 text-center border border-blue-100">
            <p className="text-lg font-bold text-gray-900 mb-2">Pronto para conhecer este destino?</p>
            <p className="text-gray-500 text-sm mb-4">Nossa IA encontra os melhores hotéis com os melhores preços.</p>
            <Link href="/#buscar" className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all">
              ✨ Buscar hotéis com IA
            </Link>
          </div>

          {/* Related articles */}
          {related.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Artigos relacionados</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {related.map(rel => (
                  <Link key={rel.slug} href={`/blog/${rel.slug}`} className="group block">
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all">
                      <div className="h-36 overflow-hidden">
                        <img src={rel.image} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <div className="p-4">
                        <div className="flex gap-2 mb-2">
                          {rel.tags.map(tag => (
                            <span key={tag} className={`text-xs font-semibold px-2 py-0.5 rounded-full ${rel.tagColor}`}>{tag}</span>
                          ))}
                        </div>
                        <h3 className="font-bold text-gray-900 text-sm leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">{rel.title}</h3>
                        <p className="text-blue-600 text-xs font-medium mt-2">Ler mais →</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
