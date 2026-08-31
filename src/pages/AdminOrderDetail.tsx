import { useEffect, useState } from "react";
import {
  createStlDownloadUrl,
  getOrder,
  orderStatuses,
  updateOrder,
} from "../services/admin";
import type { AdminOrder, OrderStatus } from "../types/order";
import { formatCurrency, formatFileSize, formatHours, formatNumber } from "../utils/format";

interface AdminOrderDetailProps {
  orderNumber: string;
  adminEmail: string | null;
  onRequireLogin: () => void;
  onBack: () => void;
  onToast: (message: string) => void;
}

export function AdminOrderDetail({
  orderNumber,
  adminEmail,
  onRequireLogin,
  onBack,
  onToast,
}: AdminOrderDetailProps) {
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [status, setStatus] = useState<OrderStatus>("new");
  const [finalPrice, setFinalPrice] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!adminEmail) {
      onRequireLogin();
      return;
    }

    getOrder(orderNumber)
      .then((loadedOrder) => {
        setOrder(loadedOrder);
        setStatus(loadedOrder.status);
        setFinalPrice(loadedOrder.final_price ? String(loadedOrder.final_price) : "");
        setAdminNote(loadedOrder.admin_note ?? "");
      })
      .catch((error: Error) => onToast(error.message));
  }, [adminEmail, onRequireLogin, onToast, orderNumber]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateOrder(orderNumber, {
        status,
        final_price: finalPrice ? Number(finalPrice) : null,
        admin_note: adminNote || null,
      });
      onToast("Order updated");
      const loadedOrder = await getOrder(orderNumber);
      setOrder(loadedOrder);
    } catch (error) {
      onToast(error instanceof Error ? error.message : "Unable to update order");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = async () => {
    if (!order) {
      return;
    }

    try {
      const url = await createStlDownloadUrl(order.file_path);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (error) {
      onToast(error instanceof Error ? error.message : "Unable to download STL");
    }
  };

  if (!order) {
    return (
      <main className="admin-page">
        <section className="admin-card">
          <p className="admin-empty">Loading order...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <section className="admin-header">
        <div>
          <span className="eyebrow">Order Detail</span>
          <h1>{order.order_number}</h1>
          <p>{new Date(order.created_at).toLocaleString("th-TH")}</p>
        </div>
        <button type="button" onClick={onBack}>
          Back
        </button>
      </section>

      <section className="detail-grid">
        <div className="admin-card detail-list">
          <h2>Customer Information</h2>
          <Detail label="Name" value={order.customer_name} />
          <Detail label="Phone" value={order.customer_phone} />
          <Detail label="Email" value={order.customer_email} />
          <Detail label="Note" value={order.customer_note ?? "-"} />
        </div>

        <div className="admin-card detail-list">
          <h2>File Information</h2>
          <Detail label="File" value={order.file_name} />
          <Detail label="Size" value={formatFileSize(order.file_size)} />
          <Detail label="Dimensions" value={`${formatNumber(order.dimension_x)} x ${formatNumber(order.dimension_y)} x ${formatNumber(order.dimension_z)} mm`} />
          <Detail label="Volume" value={`${formatNumber(order.volume_cm3, 2)} cm3`} />
          <Detail label="Triangles" value={formatNumber(order.triangle_count, 0)} />
          <button type="button" onClick={handleDownload}>
            Download STL
          </button>
        </div>

        <div className="admin-card detail-list">
          <h2>Print Settings</h2>
          <Detail label="Material" value={order.material_name} />
          <Detail label="Layer Height" value={`${order.layer_height} mm`} />
          <Detail label="Infill" value={`${order.infill_percent}%`} />
          <Detail label="Quantity" value={formatNumber(order.quantity, 0)} />
          <Detail label="Weight" value={`${formatNumber(order.estimated_weight, 1)} g`} />
          <Detail label="Print Time" value={formatHours(order.estimated_print_time_hours)} />
          <Detail label="Estimated Price" value={formatCurrency(order.estimated_price)} />
        </div>

        <form className="admin-card admin-edit" onSubmit={(event) => event.preventDefault()}>
          <h2>Admin Controls</h2>
          <label className="field">
            <span>Status</span>
            <select value={status} onChange={(event) => setStatus(event.target.value as OrderStatus)}>
              {orderStatuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Final Price</span>
            <input
              type="number"
              min="0"
              value={finalPrice}
              onChange={(event) => setFinalPrice(event.target.value)}
            />
          </label>
          <label className="field">
            <span>Admin Note</span>
            <textarea rows={5} value={adminNote} onChange={(event) => setAdminNote(event.target.value)} />
          </label>
          <button type="button" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </section>
    </main>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="detail-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
