interface QuoteSuccessProps {
  orderNumber: string;
  onBack: () => void;
}

export function QuoteSuccess({ orderNumber, onBack }: QuoteSuccessProps) {
  return (
    <main className="success-page">
      <section className="success-card">
        <span className="eyebrow">Quote submitted successfully</span>
        <h1>รับคำขอใบเสนอราคาแล้ว</h1>
        <p>หมายเลขออเดอร์ของคุณคือ</p>
        <strong>{orderNumber}</strong>
        <button type="button" onClick={onBack}>
          Back to calculator
        </button>
      </section>
    </main>
  );
}
