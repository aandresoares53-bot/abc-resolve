import Link from "next/link";
import Header from "@/components/Header";

const articles = [
  {
    slug: "10-destinos-nordeste",
    title: "10 Destinos Imperdíveis no Nordeste Brasileiro",
    excerpt: "Do litoral paradisíaco de Alagoas às dunas do Maranhão, o Nordeste guarda tesouros que vão transformar sua próxima viagem em uma experiência inesquecível.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    tags: ["Nordeste", "Praia"],
    tagColor: "bg-orange-100 text-orange-700",
    date: "15 Nov 2024",
    readTime: "8 min",
  },
  {
    slug: "gramado-inverno-guia",
    title: "Gramado no Inverno: Guia Completo 2024",
    excerpt: "Descubra quando ir, onde se hospedar e o que fazer na cidade mais charmosa do Sul. Com dicas de restaurantes, fondue e o famoso Natal Luz.",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
    tags: ["Sul", "Frio"],
    tagColor: "bg-blue-100 text-blue-700",
    date: "10 Nov 2024",
    readTime: "10 min",
  },
  {
    slug: "chapada-diamantina-guia",
    title: "Chapada Diamantina: Tudo que você precisa saber",
    excerpt: "Cachoeiras escondidas, grutas iluminadas e trilhas épicas. A Chapada Diamantina é o paraíso do ecoturismo brasileiro — veja como planejar sua visita.",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80",
    tags: ["Bahia", "Natureza"],
    tagColor: "bg-green-100 text-green-700",
    date: "5 Nov 2024",
    readTime: "12 min",
  },
  {
    slug: "fernando-noronha-economize",
    title: "Fernando de Noronha: Como se Hospedar Gastando Menos",
    excerpt: "Fernando de Noronha é um dos destinos mais caros do Brasil, mas existem estratégias para reduzir custos sem abrir mão da experiência única do arquipélago.",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
    tags: ["Nordeste", "Praia"],
    tagColor: "bg-orange-100 text-orange-700",
    date: "1 Nov 2024",
    readTime: "9 min",
  },
  {
    slug: "roteiro-minas-gerais-historico",
    title: "Roteiro de 7 dias em Minas Gerais Histórico",
    excerpt: "Ouro Preto, Tiradentes, Mariana e São João del-Rei formam um circuito histórico único. Veja o roteiro completo com dicas de hospedagem e gastronomia.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    tags: ["Sudeste", "Cultural"],
    tagColor: "bg-purple-100 text-purple-700",
    date: "25 Out 2024",
    readTime: "11 min",
  },
  {
    slug: "sao-thome-das-letras-mistico",
    title: "São Thomé das Letras: O Místico Sul de Minas",
    excerpt: "Construída inteiramente em pedra quartzito e envolta em lendas e energia espiritual, São Thomé das Letras é um destino diferente de qualquer outro no Brasil.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    tags: ["Minas", "Espiritual"],
    tagColor: "bg-indigo-100 text-indigo-700",
    date: "20 Out 2024",
    readTime: "7 min",
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      <Header />
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium px-4 py-2 rounded-full mb-4">
              ✍️ Blog de Viagens
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
              Guias & Dicas de Viagem
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Roteiros, dicas de hospedagem e tudo que você precisa saber para planejar sua próxima aventura pelo Brasil.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map(article => (
              <Link key={article.slug} href={`/blog/${article.slug}`} className="group block">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      {article.tags.map(tag => (
                        <span key={tag} className={`text-xs font-semibold px-2 py-1 rounded-full ${article.tagColor}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                      <span>📅 {article.date}</span>
                      <span>·</span>
                      <span>⏱ {article.readTime} de leitura</span>
                    </div>
                    <h2 className="font-bold text-gray-900 text-lg leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {article.title}
                    </h2>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-4">{article.excerpt}</p>
                    <span className="text-blue-600 text-sm font-semibold group-hover:gap-2 transition-all flex items-center gap-1">
                      Ler mais <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
