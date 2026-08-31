import { useState, type FormEvent } from "react";
import type { CustomerDetails } from "../types/order";

interface QuoteFormProps {
  disabled: boolean;
  isConfigured: boolean;
  isSubmitting: boolean;
  onSubmit: (customer: CustomerDetails) => Promise<void>;
}

export function QuoteForm({ disabled, isConfigured, isSubmitting, onSubmit }: QuoteFormProps) {
  const [customer, setCustomer] = useState<CustomerDetails>({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    customerNote: "",
    privacyAccepted: false,
  });

  const update = (key: keyof CustomerDetails, value: string | boolean) => {
    setCustomer((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit(customer);
  };

  return (
    <form className="quote-form" onSubmit={handleSubmit}>
      <div className="section-heading">
        <span className="eyebrow">Request Quote</span>
        <h2>ส่งข้อมูลเพื่อขอใบเสนอราคา</h2>
      </div>
      {!isConfigured ? (
        <p className="warning-text">
          ยังไม่ได้ตั้งค่า Supabase ระบบคำนวณใช้งานได้ แต่การส่งใบเสนอราคาจะพร้อมหลังเพิ่มค่า env
        </p>
      ) : null}
      <div className="quote-fields">
        <label className="field">
          <span>ชื่อผู้ติดต่อ</span>
          <input
            required
            value={customer.customerName}
            onChange={(event) => update("customerName", event.target.value)}
            disabled={disabled || isSubmitting}
          />
        </label>
        <label className="field">
          <span>เบอร์โทร</span>
          <input
            required
            inputMode="tel"
            value={customer.customerPhone}
            onChange={(event) => update("customerPhone", event.target.value)}
            disabled={disabled || isSubmitting}
          />
        </label>
        <label className="field">
          <span>อีเมล</span>
          <input
            required
            type="email"
            value={customer.customerEmail}
            onChange={(event) => update("customerEmail", event.target.value)}
            disabled={disabled || isSubmitting}
          />
        </label>
        <label className="field">
          <span>รายละเอียดเพิ่มเติม</span>
          <textarea
            value={customer.customerNote}
            onChange={(event) => update("customerNote", event.target.value)}
            disabled={disabled || isSubmitting}
            rows={4}
          />
        </label>
      </div>
      <label className="privacy-check">
        <input
          type="checkbox"
          checked={customer.privacyAccepted}
          onChange={(event) => update("privacyAccepted", event.target.checked)}
          disabled={disabled || isSubmitting}
        />
        <span>Your 3D model will be stored privately and used only for quotation and printing purposes.</span>
      </label>
      <button
        type="submit"
        disabled={disabled || !isConfigured || !customer.privacyAccepted || isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit Quote Request"}
      </button>
    </form>
  );
}
