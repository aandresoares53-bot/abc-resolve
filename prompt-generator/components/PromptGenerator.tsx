"use client";

import { useState, useCallback } from "react";
import {
  Copy,
  Shuffle,
  Trash2,
  CheckCheck,
  Sparkles,
  ChevronRight,
  Download,
} from "lucide-react";
import { CATEGORIES, PRESETS } from "@/lib/promptData";
import {
  buildPrompt,
  randomizeSelections,
  countSelections,
  type SelectedOptions,
} from "@/lib/promptBuilder";

export default function PromptGenerator() {
  const [activeTab, setActiveTab] = useState(CATEGORIES[0].id);
  const [selections, setSelections] = useState<SelectedOptions>({});
  const [prompt, setPrompt] = useState("");
  const [copied, setCopied] = useState(false);

  const updateSelections = useCallback((next: SelectedOptions) => {
    setSelections(next);
    setPrompt(buildPrompt(next));
  }, []);

  const toggleOption = useCallback(
    (categoryId: string, optionId: string, multiSelect: boolean) => {
      setSelections((prev) => {
        const current = prev[categoryId] ?? [];
        let updated: string[];
        if (multiSelect) {
          updated = current.includes(optionId)
            ? current.filter((id) => id !== optionId)
            : [...current, optionId];
        } else {
          updated = current.includes(optionId) ? [] : [optionId];
        }
        const next = { ...prev, [categoryId]: updated };
        setPrompt(buildPrompt(next));
        return next;
      });
    },
    []
  );

  const applyPreset = useCallback(
    (presetId: string) => {
      const preset = PRESETS.find((p) => p.id === presetId);
      if (preset) updateSelections(preset.selections as SelectedOptions);
    },
    [updateSelections]
  );

  const handleRandomize = useCallback(() => {
    updateSelections(randomizeSelections());
  }, [updateSelections]);

  const handleClear = useCallback(() => {
    setSelections({});
    setPrompt("");
  }, []);

  const handleCopy = useCallback(async () => {
    if (!prompt) return;
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }, [prompt]);

  const total = countSelections(selections);
  const activeCategory = CATEGORIES.find((c) => c.id === activeTab)!;

  return (
    <div className="space-y-8">
      {/* Presets strip */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={16} className="text-violet-400" />
          <span className="text-sm font-semibold text-slate-300 uppercase tracking-widest">
            Presets rápidos
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset.id)}
              className="preset-card"
            >
              <span className="text-2xl block mb-2">{preset.emoji}</span>
              <p className="text-white text-sm font-semibold leading-tight mb-1">
                {preset.name}
              </p>
              <p className="text-slate-500 text-xs leading-snug">
                {preset.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main generator card */}
      <div className="glass rounded-3xl overflow-hidden">
        {/* Category tabs */}
        <div className="overflow-x-auto">
          <div className="flex border-b border-white/5 min-w-max">
            {CATEGORIES.map((cat) => {
              const count = (selections[cat.id] ?? []).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`px-5 py-4 text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === cat.id ? "tab-active" : "tab-inactive"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                  {count > 0 && (
                    <span className="count-badge">{count}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Options grid */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="text-white font-semibold text-base">
                {activeCategory.name}
              </h3>
              <p className="text-slate-500 text-sm mt-0.5">
                {activeCategory.description}
                {!activeCategory.multiSelect && (
                  <span className="ml-2 text-xs text-violet-400 font-medium">
                    (selecione 1)
                  </span>
                )}
              </p>
            </div>
            {(selections[activeTab] ?? []).length > 0 && (
              <button
                onClick={() => {
                  const next = { ...selections, [activeTab]: [] };
                  updateSelections(next);
                }}
                className="text-xs text-slate-500 hover:text-rose-400 transition-colors flex items-center gap-1"
              >
                <Trash2 size={12} />
                Limpar aba
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {activeCategory.options.map((opt) => {
              const isSelected = (selections[activeTab] ?? []).includes(opt.id);
              return (
                <button
                  key={opt.id}
                  onClick={() =>
                    toggleOption(
                      activeTab,
                      opt.id,
                      activeCategory.multiSelect
                    )
                  }
                  className={`px-3.5 py-2 rounded-full text-sm border font-medium transition-all duration-200 ${
                    isSelected ? "pill-selected" : "pill-unselected"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category nav arrows */}
        <div className="px-6 pb-4 flex justify-between">
          <button
            onClick={() => {
              const idx = CATEGORIES.findIndex((c) => c.id === activeTab);
              if (idx > 0) setActiveTab(CATEGORIES[idx - 1].id);
            }}
            disabled={CATEGORIES[0].id === activeTab}
            className="text-xs text-slate-500 hover:text-slate-300 disabled:opacity-20 flex items-center gap-1 transition-colors"
          >
            ← Anterior
          </button>
          <button
            onClick={() => {
              const idx = CATEGORIES.findIndex((c) => c.id === activeTab);
              if (idx < CATEGORIES.length - 1) setActiveTab(CATEGORIES[idx + 1].id);
            }}
            disabled={CATEGORIES[CATEGORIES.length - 1].id === activeTab}
            className="text-xs text-slate-500 hover:text-violet-400 disabled:opacity-20 flex items-center gap-1 transition-colors"
          >
            Próximo <ChevronRight size={12} />
          </button>
        </div>
      </div>

      {/* Prompt output */}
      <div className="glass rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                prompt ? "bg-green-400 animate-pulse" : "bg-slate-600"
              }`}
            />
            <span className="text-sm font-semibold text-slate-300">
              Prompt Gerado
            </span>
            {total > 0 && (
              <span className="text-xs text-slate-500">
                {total} opções selecionadas
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleRandomize} className="btn-ghost text-xs px-3 py-1.5">
              <Shuffle size={13} />
              Aleatório
            </button>
            <button onClick={handleClear} className="btn-ghost text-xs px-3 py-1.5">
              <Trash2 size={13} />
              Limpar
            </button>
          </div>
        </div>

        <textarea
          className="prompt-textarea"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Selecione opções acima ou clique em 'Aleatório' para gerar um prompt automaticamente..."
          rows={5}
        />

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleCopy}
            disabled={!prompt}
            className={`btn-primary flex-1 justify-center ${
              !prompt ? "opacity-40 cursor-not-allowed" : ""
            }`}
          >
            {copied ? (
              <>
                <CheckCheck size={15} />
                Copiado!
              </>
            ) : (
              <>
                <Copy size={15} />
                Copiar Prompt
              </>
            )}
          </button>

          <button
            onClick={() => {
              if (!prompt) return;
              const blob = new Blob([prompt], { type: "text/plain" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "prompt.txt";
              a.click();
              URL.revokeObjectURL(url);
            }}
            disabled={!prompt}
            className={`btn-ghost ${!prompt ? "opacity-40 cursor-not-allowed" : ""}`}
          >
            <Download size={15} />
            Baixar .txt
          </button>
        </div>

        {prompt && (
          <p className="text-xs text-slate-600 text-center">
            Dica: você pode editar o prompt diretamente no campo acima antes de copiar.
          </p>
        )}
      </div>

      {/* Selection summary */}
      {total > 0 && (
        <div className="glass rounded-2xl p-5">
          <p className="text-sm font-semibold text-slate-400 mb-4">
            Resumo das seleções
          </p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const ids = selections[cat.id] ?? [];
              if (ids.length === 0) return null;
              return ids.map((id) => {
                const opt = cat.options.find((o) => o.id === id);
                if (!opt) return null;
                return (
                  <span
                    key={id}
                    onClick={() =>
                      toggleOption(cat.id, id, cat.multiSelect)
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-violet-600/20 border border-violet-500/30 text-violet-300 cursor-pointer hover:bg-rose-600/20 hover:border-rose-500/30 hover:text-rose-300 transition-colors"
                    title={`Clique para remover: ${opt.label}`}
                  >
                    <span>{cat.icon}</span>
                    {opt.label}
                    <span className="ml-0.5 opacity-60">×</span>
                  </span>
                );
              });
            })}
          </div>
        </div>
      )}
    </div>
  );
}
