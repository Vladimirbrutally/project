interface LayerHeightSelectorProps {
  options: number[];
  value: number;
  onChange: (value: number) => void;
}

export function LayerHeightSelector({ options, value, onChange }: LayerHeightSelectorProps) {
  return (
    <label className="field">
      <span>Layer Height</span>
      <select value={value} onChange={(event) => onChange(Number(event.target.value))}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option.toFixed(2)} mm
          </option>
        ))}
      </select>
    </label>
  );
}
