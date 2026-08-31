import type { ModelAnalysis } from "../types/model";
import { formatFileSize, formatHours, formatNumber } from "../utils/format";

interface ModelInformationProps {
  model?: ModelAnalysis;
  estimatedWeight: number;
  printTimeHours: number;
}

export function ModelInformation({ model, estimatedWeight, printTimeHours }: ModelInformationProps) {
  const dimensions = model
    ? `${formatNumber(model.dimensions.x)} x ${formatNumber(model.dimensions.y)} x ${formatNumber(
        model.dimensions.z,
      )} mm`
    : "-";

  return (
    <section className="info-grid" aria-label="Model information">
      <InfoItem label="File" value={model?.fileName ?? "No STL loaded"} />
      <InfoItem label="File Size" value={model ? formatFileSize(model.fileSize) : "-"} />
      <InfoItem label="Size" value={dimensions} />
      <InfoItem label="Volume" value={model ? `${formatNumber(model.volumeCm3, 2)} cm3` : "-"} />
      <InfoItem label="Weight" value={model ? `~${formatNumber(estimatedWeight, 1)} g` : "-"} />
      <InfoItem label="Time" value={model ? `~${formatHours(printTimeHours)}` : "-"} />
      <InfoItem label="Triangles" value={model ? formatNumber(model.triangleCount, 0) : "-"} />
      <InfoItem label="Build Check" value={model?.tooLarge ? "MODEL TOO LARGE" : model ? "Ready" : "-"} />
    </section>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="info-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
