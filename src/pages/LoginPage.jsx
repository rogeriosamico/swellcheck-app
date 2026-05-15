import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn, signInWithGoogle } from "@/lib/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const fromLocation = location.state?.from;
  const from = fromLocation ? `${fromLocation.pathname}${fromLocation.search ?? ""}` : "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      setError("E-mail ou senha incorretos.");
    } else {
      const storedFrom = localStorage.getItem('authFrom');
      if (storedFrom) {
        localStorage.removeItem('authFrom');
        navigate(storedFrom, { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  }

  async function handleGoogle() {
    setError("");
    const { error } = await signInWithGoogle();
    if (error) setError("Erro ao entrar com Google. Tente novamente.");
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Swell Check</h1>
        <p style={styles.subtitle}>Previsão de surf para as melhores praias do Brasil.</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>E-mail</label>
            <Input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Senha</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <Button type="submit" disabled={loading} style={styles.btnPrimary}>
            {loading ? "Entrando…" : "Entrar"}
          </Button>
        </form>

        <div style={styles.divider}>
          <span style={styles.dividerLine} />
          <span style={styles.dividerText}>ou</span>
          <span style={styles.dividerLine} />
        </div>

        <Button variant="outline" onClick={handleGoogle} style={styles.btnGoogle}>
          <GoogleIcon />
          Entrar com Google
        </Button>

        <div style={styles.links}>
          <Link to="/forgot-password" style={styles.link}>Esqueci a senha</Link>
          <span style={styles.linkSep}>·</span>
          <Link to="/register" style={styles.link}>Criar conta</Link>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" style={{ flexShrink: 0 }}>
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" />
      <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" />
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" />
    </svg>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "var(--surface-primary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "var(--spacing-md)",
    fontFamily: "var(--font-family)",
  },
  card: {
    width: "100%",
    maxWidth: 360,
    display: "flex",
    flexDirection: "column",
    gap: "var(--spacing-md)",
  },
  title: {
    fontSize: "var(--font-size-title-sm)",
    fontWeight: "var(--font-weight-bold)",
    color: "var(--text-primary)",
    margin: 0,
    textAlign: "center",
  },
  subtitle: {
    fontSize: "var(--font-size-body)",
    color: "var(--text-secondary)",
    margin: 0,
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--spacing-md)",
    marginTop: "var(--spacing-sm)",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--spacing-xs)",
  },
  label: {
    fontSize: "var(--font-size-body)",
    fontWeight: "var(--font-weight-bold)",
    color: "var(--text-primary)",
  },
  input: {
    height: "var(--touch-target)",
  },
  error: {
    fontSize: "var(--font-size-body)",
    color: "var(--text-storm)",
    margin: 0,
  },
  btnPrimary: {
    width: "100%",
    height: "var(--touch-target)",
    borderRadius: "var(--radius-rounded)",
    fontSize: "var(--font-size-button)",
    fontWeight: "var(--font-weight-bold)",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "var(--spacing-sm)",
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: "var(--border-primary)",
    display: "block",
  },
  dividerText: {
    fontSize: "var(--font-size-subtitle)",
    color: "var(--text-secondary)",
  },
  btnGoogle: {
    width: "100%",
    height: "var(--touch-target)",
    borderRadius: "var(--radius-rounded)",
    fontSize: "var(--font-size-button)",
    fontWeight: "var(--font-weight-bold)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "var(--spacing-sm)",
  },
  links: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "var(--spacing-sm)",
    marginTop: "var(--spacing-xs)",
  },
  link: {
    fontSize: "var(--font-size-body)",
    color: "var(--text-primary)",
    textDecoration: "none",
    fontWeight: "var(--font-weight-bold)",
  },
  linkSep: {
    color: "var(--text-secondary)",
    fontSize: "var(--font-size-body)",
  },
};
