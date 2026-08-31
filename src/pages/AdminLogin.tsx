import { useState, type FormEvent } from "react";

interface AdminLoginProps {
  isConfigured: boolean;
  onLogin: (email: string, password: string) => Promise<void>;
}

export function AdminLogin({ isConfigured, onLogin }: AdminLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await onLogin(email, password);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="admin-page">
      <form className="admin-card admin-login" onSubmit={handleSubmit}>
        <span className="eyebrow">Admin Login</span>
        <h1>เข้าสู่ระบบหลังบ้าน</h1>
        {!isConfigured ? (
          <p className="warning-text">ยังไม่ได้ตั้งค่า Supabase env จึงยัง login ไม่ได้</p>
        ) : null}
        <label className="field">
          <span>Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={!isConfigured || isSubmitting}
          />
        </label>
        <label className="field">
          <span>Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={!isConfigured || isSubmitting}
          />
        </label>
        <button type="submit" disabled={!isConfigured || isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}
