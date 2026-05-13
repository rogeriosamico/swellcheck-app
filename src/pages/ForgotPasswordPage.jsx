import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resetPassword } from "@/lib/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);

    if (error) {
      setError("Não foi possível enviar o e-mail. Tente novamente.");
    } else {
      setSent(true);
    }
  }

  if (sent) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h1 style={styles.title}>E-mail enviado</h1>
          <p style={styles.body}>
            Mandamos um link de recuperação para <strong>{email}</strong>. Confere a caixa de entrada.
          </p>
          <Link to="/login">
            <Button variant="outline" style={styles.btnSecondary}>Voltar pro login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Esqueceu a senha?</h1>
        <p style={styles.subtitle}>
          Manda seu e-mail que a gente te envia um link pra criar uma nova.
        </p>

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

          {error && <p style={styles.error}>{error}</p>}

          <Button type="submit" disabled={loading} style={styles.btnPrimary}>
            {loading ? "Enviando…" : "Enviar link"}
          </Button>
        </form>

        <div style={styles.links}>
          <Link to="/login" style={styles.link}>Voltar pro login</Link>
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
    lineHeight: 1.5,
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
  btnSecondary: {
    width: "100%",
    height: "var(--touch-target)",
    borderRadius: "var(--radius-rounded)",
    fontSize: "var(--font-size-button)",
    fontWeight: "var(--font-weight-bold)",
  },
  links: {
    display: "flex",
    justifyContent: "center",
  },
  link: {
    fontSize: "var(--font-size-body)",
    color: "var(--text-primary)",
    textDecoration: "none",
    fontWeight: "var(--font-weight-bold)",
  },
};
