import { useEffect, useMemo, useState } from "react";
import { listOrders, orderStatuses, signOutAdmin } from "../services/admin";
import type { AdminOrder, OrderStatus } from "../types/order";
import { formatCurrency, formatFileSize, formatNumber } from "../utils/format";

interface AdminDashboardProps {
  adminEmail: string | null;
  onRequireLogin: () => void;
  onOpenOrder: (orderNumber: string) => void;
  onSignedOut: () => void;
  onToast: (message: string) => void;
}

export function AdminDashboard({
  adminEmail,
  onRequireLogin,
  onOpenOrder,
  onSignedOut,
  onToast,
}: AdminDashboardProps) {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!adminEmail) {
      onRequireLogin();
      return;
    }

    listOrders()
      .then(setOrders)
      .catch((error: Error) => onToast(error.message))
      .finally(() => setIsLoading(false));
  }, [adminEmail, onRequireLogin, onToast]);

  const filteredOrders = useMemo(() => {
    const query = search.toLowerCase().trim();
    return orders.filter((order) => {
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      const matchesSearch =
        !query ||
        order.order_number.toLowerCase().includes(query) ||
        order.customer_name.toLowerCase().includes(query) ||
        order.customer_email.toLowerCase().includes(query) ||
        order.customer_phone.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [orders, search, statusFilter]);

  const stats = useMemo(() => {
    const revenue = orders.reduce((total, order) => total + (order.final_price ?? order.estimated_price), 0);
    return {
      total: orders.length,
      newOrders: orders.filter((order) => order.status === "new").length,
      printing: orders.filter((order) => order.status === "printing").length,
      finished: orders.filter((order) => order.status === "finished").length,
      revenue,
    };
  }, [orders]);

  const handleSignOut = async () => {
    await signOutAdmin();
    onSignedOut();
  };

  return (
    <main className="admin-page">
      <section className="admin-header">
        <div>
          <span className="eyebrow">Admin Dashboard</span>
          <h1>Orders</h1>
          <p>{adminEmail}</p>
        </div>
        <button type="button" onClick={handleSignOut}>
          Sign out
        </button>
      </section>

      <section className="stats-grid">
        <Stat label="Total Orders" value={formatNumber(stats.total, 0)} />
        <Stat label="New Orders" value={formatNumber(stats.newOrders, 0)} />
        <Stat label="Printing" value={formatNumber(stats.printing, 0)} />
        <Stat label="Finished" value={formatNumber(stats.finished, 0)} />
        <Stat label="Revenue Estimate" value={formatCurrency(stats.revenue)} />
      </section>

      <section className="admin-card">
        <div className="admin-filters">
          <label className="field">
            <span>Status</span>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as OrderStatus | "all")}>
              <option value="all">All</option>
              {orderStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Search</span>
            <input
              placeholder="Order, customer, phone, email"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
        </div>

        {isLoading ? (
          <p className="admin-empty">Loading orders...</p>
        ) : filteredOrders.length === 0 ? (
          <p className="admin-empty">No orders found</p>
        ) : (
          <div className="orders-table">
            <div className="orders-head">
              <span>Order</span>
              <span>Customer</span>
              <span>File</span>
              <span>Material</span>
              <span>Price</span>
              <span>Status</span>
            </div>
            {filteredOrders.map((order) => (
              <button
                key={order.id}
                type="button"
                className="orders-row"
                onClick={() => onOpenOrder(order.order_number)}
              >
                <span>{order.order_number}</span>
                <span>{order.customer_name}</span>
                <span>
                  {order.file_name}
                  <small>{formatFileSize(order.file_size)}</small>
                </span>
                <span>
                  {order.material_name}
                  <small>
                    {order.quantity} pcs, {order.infill_percent}%
                  </small>
                </span>
                <span>{formatCurrency(order.final_price ?? order.estimated_price)}</span>
                <span>{order.status}</span>
              </button>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
