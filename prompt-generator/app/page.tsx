import PromptGenerator from "@/components/PromptGenerator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="hero-bg relative overflow-hidden pt-24 pb-16 px-4">
          <div
            className="orb w-96 h-96 bg-violet-600 top-0 left-1/4"
            style={{ animation: "float 8s ease-in-out infinite" }}
          />
          <div
            className="orb w-72 h-72 bg-pink-600 bottom-0 right-1/4"
            style={{ animation: "float 10s ease-in-out infinite reverse" }}
          />

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-slate-400 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Compatível com Midjourney · Stable Diffusion · DALL-E · Flux
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
              <span className="text-white">Gere Prompts</span>
              <br />
              <span className="gradient-text">Ultra-Realistas</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
              Construa prompts profissionais e detalhados para criar fotos RAW de
              altíssimo realismo com qualquer gerador de IA. Escolha aparência,
              roupa, pose, cenário e muito mais.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <span className="text-violet-400 font-bold text-2xl">7</span>
                <span>categorias</span>
              </div>
              <div className="w-px h-5 bg-slate-700" />
              <div className="flex items-center gap-2">
                <span className="text-violet-400 font-bold text-2xl">100+</span>
                <span>opções</span>
              </div>
              <div className="w-px h-5 bg-slate-700" />
              <div className="flex items-center gap-2">
                <span className="text-violet-400 font-bold text-2xl">6</span>
                <span>presets prontos</span>
              </div>
            </div>
          </div>
        </section>

        {/* Generator */}
        <section id="generator" className="px-4 py-12 max-w-6xl mx-auto">
          <PromptGenerator />
        </section>

        {/* Tips */}
        <section className="px-4 py-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-10">
            Como usar seus prompts
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                emoji: "🎛️",
                title: "Personalize",
                text: "Selecione as opções desejadas em cada categoria ou escolha um preset pronto para começar rapidamente.",
              },
              {
                step: "2",
                emoji: "📋",
                title: "Copie o Prompt",
                text: "Clique em 'Copiar Prompt' para copiar o texto gerado para sua área de transferência.",
              },
              {
                step: "3",
                emoji: "🚀",
                title: "Cole no Gerador",
                text: "Cole no Midjourney (/imagine), Stable Diffusion, DALL-E 3 ou qualquer outro gerador de IA.",
              },
            ].map((tip) => (
              <div
                key={tip.step}
                className="glass rounded-2xl p-6 text-center"
              >
                <div className="text-3xl mb-3">{tip.emoji}</div>
                <div className="count-badge inline-block mb-3">Passo {tip.step}</div>
                <h3 className="text-white font-semibold mb-2">{tip.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{tip.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Compatible tools */}
        <section className="px-4 pb-16 max-w-4xl mx-auto">
          <p className="text-center text-slate-600 text-sm mb-6 uppercase tracking-widest font-medium">
            Compatível com
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {[
              { name: "Midjourney", color: "from-blue-500 to-indigo-600" },
              { name: "Stable Diffusion", color: "from-orange-500 to-red-600" },
              { name: "DALL-E 3", color: "from-green-500 to-teal-600" },
              { name: "Flux", color: "from-purple-500 to-pink-600" },
              { name: "Adobe Firefly", color: "from-red-500 to-pink-600" },
              { name: "Leonardo AI", color: "from-yellow-500 to-orange-600" },
            ].map((tool) => (
              <span
                key={tool.name}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-slate-300 font-medium"
              >
                {tool.name}
              </span>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
