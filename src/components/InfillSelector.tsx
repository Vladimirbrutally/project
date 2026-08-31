interface InfillSelectorProps {
  options: number[];
  value: number;
  onChange: (value: number) => void;
}

export function InfillSelector({ options, value, onChange }: InfillSelectorProps) {
  return (
    <label className="field">
      <span>Infill</span>
      <select value={value} onChange={(event) => onChange(Number(event.target.value))}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}%
          </option>
        ))}
      </select>
    </label>
  );
}
