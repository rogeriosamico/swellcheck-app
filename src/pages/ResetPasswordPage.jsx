import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updatePassword } from "@/lib/auth";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
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
    const { error } = await updatePassword(password);
    setLoading(false);

    if (error) {
      setError("Não foi possível atualizar a senha. O link pode ter expirado.");
    } else {
      navigate("/");
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Nova senha</h1>
        <p style={styles.subtitle}>Escolhe uma senha nova pra sua conta.</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Nova senha</label>
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
            {loading ? "Salvando…" : "Salvar nova senha"}
          </Button>
        </form>
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
};
