import { Wand2, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
              <Wand2 size={14} className="text-white" />
            </div>
            <span className="text-white font-bold">PromptVision</span>
          </div>

          <p className="text-slate-500 text-sm text-center">
            Gere prompts profissionais para qualquer gerador de imagens com IA.
            <br className="sm:hidden" /> Compatível com Midjourney, Stable Diffusion, DALL-E 3 e mais.
          </p>

          <p className="text-slate-600 text-sm flex items-center gap-1">
            Feito com <Heart size={12} className="text-pink-500 fill-pink-500" /> no Brasil
          </p>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
          <p>© {new Date().getFullYear()} PromptVision. Todos os direitos reservados.</p>
          <p>Para uso com geradores de imagens IA — use com responsabilidade.</p>
        </div>
      </div>
    </footer>
  );
}
