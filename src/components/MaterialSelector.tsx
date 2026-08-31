import type { Material } from "../types/material";

interface MaterialSelectorProps {
  materials: Material[];
  selectedMaterialId: string;
  onChange: (materialId: string) => void;
}

export function MaterialSelector({ materials, selectedMaterialId, onChange }: MaterialSelectorProps) {
  return (
    <label className="field">
      <span>Material</span>
      <select value={selectedMaterialId} onChange={(event) => onChange(event.target.value)}>
        {materials.map((material) => (
          <option key={material.id} value={material.id}>
            {material.name} - {material.pricePerGram} THB/g
          </option>
        ))}
      </select>
    </label>
  );
}
