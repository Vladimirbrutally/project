import type { PriceBreakdown as PriceBreakdownType } from "../utils/calculatePrice";
import { formatCurrency } from "../utils/format";

interface PriceSummaryProps {
  breakdown: PriceBreakdownType;
  hasModel: boolean;
  onRequestQuote: () => void;
}

export function PriceSummary({ breakdown, hasModel, onRequestQuote }: PriceSummaryProps) {
  return (
    <section className="price-panel">
      <span className="eyebrow">Estimated Price</span>
      <strong className="price">{hasModel ? formatCurrency(breakdown.totalPrice) : "-"}</strong>
      <button type="button" disabled={!hasModel} onClick={onRequestQuote}>
        Request Quote
      </button>
      <div className="breakdown">
        <BreakdownRow label="Material" value={breakdown.materialCost} />
        <BreakdownRow label="Machine" value={breakdown.machineCost} />
        <BreakdownRow label="Setup" value={breakdown.setupCost} />
        <BreakdownRow label="Electricity" value={breakdown.electricityCost} />
        <BreakdownRow label="Post Processing" value={breakdown.postProcessing} />
        <BreakdownRow label="Margin" value={breakdown.margin} />
        <BreakdownRow label="Unit Price" value={breakdown.unitPrice} />
      </div>
    </section>
  );
}

function BreakdownRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="breakdown-row">
      <span>{label}</span>
      <strong>{formatCurrency(value)}</strong>
    </div>
  );
}
