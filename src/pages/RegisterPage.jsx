import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signUp } from "@/lib/auth";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }
    if (password.length < 6) {
      setError("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password);
    setLoading(false);

    if (error) {
      setError("Não foi possível criar a conta. Tente novamente.");
    } else {
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h1 style={styles.title}>Conta criada!</h1>
          <p style={styles.body}>
            Mandamos um e-mail de confirmação para <strong>{email}</strong>. Confirma lá e depois entra no app.
          </p>
          <Link to="/login">
            <Button style={styles.btnPrimary}>Ir para o login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Criar conta</h1>
        <p style={styles.subtitle}>Acesso grátis às condições do mar</p>

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
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Confirmar senha</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <Button type="submit" disabled={loading} style={styles.btnPrimary}>
            {loading ? "Criando conta…" : "Criar conta"}
          </Button>
        </form>

        <div style={styles.links}>
          <span style={styles.linkLabel}>Já tem conta?</span>
          <Link to="/login" style={styles.link}>Entrar</Link>
        </div>
      </div>
    </div>
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
  body: {
    fontSize: "var(--font-size-body)",
    color: "var(--text-secondary)",
    margin: 0,
    lineHeight: 1.5,
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
  links: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "var(--spacing-xs)",
  },
  linkLabel: {
    fontSize: "var(--font-size-body)",
    color: "var(--text-secondary)",
  },
  link: {
    fontSize: "var(--font-size-body)",
    color: "var(--text-primary)",
    textDecoration: "none",
    fontWeight: "var(--font-weight-bold)",
  },
};
