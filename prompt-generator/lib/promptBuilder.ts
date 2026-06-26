import { CATEGORIES } from "./promptData";

export type SelectedOptions = Record<string, string[]>;

export function buildPrompt(selections: SelectedOptions): string {
  const parts: string[] = ["beautiful woman"];

  for (const category of CATEGORIES) {
    const selectedIds = selections[category.id] ?? [];
    if (selectedIds.length === 0) continue;
    const values = category.options
      .filter((opt) => selectedIds.includes(opt.id))
      .map((opt) => opt.value);
    parts.push(...values);
  }

  const cameraIds = selections["camera"] ?? [];
  if (!cameraIds.includes("cam1")) parts.push("RAW photo");
  if (!cameraIds.includes("cam7")) parts.push("8K resolution");
  if (!cameraIds.includes("cam8") && !cameraIds.includes("cam12"))
    parts.push("photorealistic");

  parts.push("masterpiece", "best quality", "ultra detailed", "award winning photography");

  return parts.join(", ");
}

export function randomizeSelections(): SelectedOptions {
  const selections: SelectedOptions = {};
  for (const category of CATEGORIES) {
    if (category.multiSelect) {
      const count = Math.floor(Math.random() * 3) + 1;
      const shuffled = [...category.options].sort(() => Math.random() - 0.5);
      selections[category.id] = shuffled.slice(0, count).map((o) => o.id);
    } else {
      const random = category.options[Math.floor(Math.random() * category.options.length)];
      selections[category.id] = [random.id];
    }
  }
  return selections;
}

export function countSelections(selections: SelectedOptions): number {
  return Object.values(selections).flat().length;
}
