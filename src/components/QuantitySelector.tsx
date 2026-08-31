interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
}

export function QuantitySelector({ value, onChange }: QuantitySelectorProps) {
  return (
    <div className="field">
      <span>Quantity</span>
      <div className="stepper">
        <button type="button" onClick={() => onChange(Math.max(1, value - 1))} aria-label="Decrease quantity">
          -
        </button>
        <input
          aria-label="Quantity"
          type="number"
          min="1"
          value={value}
          onChange={(event) => onChange(Math.max(1, Number(event.target.value) || 1))}
        />
        <button type="button" onClick={() => onChange(value + 1)} aria-label="Increase quantity">
          +
        </button>
      </div>
    </div>
  );
}
