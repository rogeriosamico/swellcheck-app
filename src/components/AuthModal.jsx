import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { signIn, signUp, signInWithGoogle, resetPassword } from "@/lib/auth";

export default function AuthModal() {
  const { user, isAuthModalOpen, authModalView, closeAuthModal } = useAuth();
  const [view, setView] = useState(authModalView);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isAuthModalOpen) {
      setView(authModalView);
      resetForm();
    }
  }, [isAuthModalOpen, authModalView]);

  useEffect(() => {
    if (user && isAuthModalOpen) {
      closeAuthModal();
    }
  }, [user]);

  function resetForm() {
    setEmail("");
    setPassword("");
    setConfirm("");
    setError("");
    setLoading(false);
    setSuccess(false);
  }

  function switchView(newView) {
    setView(newView);
    resetForm();
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) setError("E-mail ou senha incorretos.");
  }

  async function handleGoogle() {
    setError("");
    const { error } = await signInWithGoogle();
    if (error) setError("Erro ao entrar com Google. Tente novamente.");
  }

  async function handleRegister(e) {
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

  async function handleForgot(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);
    if (error) {
      setError("Não foi possível enviar o e-mail. Tente novamente.");
    } else {
      setSuccess(true);
    }
  }

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={(open) => { if (!open) closeAuthModal(); }}>
      <DialogContent className="max-w-[400px] p-6 gap-0">
        {view === "login" && (
          <LoginView
            email={email} setEmail={setEmail}
            password={password} setPassword={setPassword}
            error={error} loading={loading}
            onSubmit={handleLogin}
            onGoogle={handleGoogle}
            onSwitchView={switchView}
          />
        )}
        {view === "register" && (
          success ? (
            <RegisterSuccess email={email} onSwitchView={switchView} />
          ) : (
            <RegisterView
              email={email} setEmail={setEmail}
              password={password} setPassword={setPassword}
              confirm={confirm} setConfirm={setConfirm}
              error={error} loading={loading}
              onSubmit={handleRegister}
              onSwitchView={switchView}
            />
          )
        )}
        {view === "forgot" && (
          success ? (
            <ForgotSuccess email={email} onSwitchView={switchView} />
          ) : (
            <ForgotView
              email={email} setEmail={setEmail}
              error={error} loading={loading}
              onSubmit={handleForgot}
              onSwitchView={switchView}
            />
          )
        )}
      </DialogContent>
    </Dialog>
  );
}

function LoginView({ email, setEmail, password, setPassword, error, loading, onSubmit, onGoogle, onSwitchView }) {
  return (
    <>
      <DialogHeader style={s.header}>
        <DialogTitle style={s.title}>Swell Check</DialogTitle>
        <p style={s.subtitle}>Previsão de surf para as melhores praias do Brasil.</p>
      </DialogHeader>

      <form onSubmit={onSubmit} style={s.form}>
        <div style={s.field}>
          <label style={s.label}>E-mail</label>
          <Input type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} required style={s.input} />
        </div>
        <div style={s.field}>
          <label style={s.label}>Senha</label>
          <Input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required style={s.input} />
        </div>
        {error && <p style={s.error}>{error}</p>}
        <Button type="submit" disabled={loading} style={s.btnPrimary}>
          {loading ? "Entrando…" : "Entrar"}
        </Button>
      </form>

      <div style={s.divider}>
        <span style={s.dividerLine} />
        <span style={s.dividerText}>ou</span>
        <span style={s.dividerLine} />
      </div>

      <Button variant="outline" onClick={onGoogle} style={s.btnGoogle}>
        <GoogleIcon />
        Entrar com Google
      </Button>

      <div style={s.links}>
        <button type="button" onClick={() => onSwitchView("forgot")} style={s.linkBtn}>Esqueci a senha</button>
        <span style={s.linkSep}>·</span>
        <button type="button" onClick={() => onSwitchView("register")} style={s.linkBtn}>Criar conta</button>
      </div>
    </>
  );
}

function RegisterView({ email, setEmail, password, setPassword, confirm, setConfirm, error, loading, onSubmit, onSwitchView }) {
  return (
    <>
      <DialogHeader style={s.header}>
        <DialogTitle style={s.title}>Criar conta</DialogTitle>
        <p style={s.subtitle}>Acesso grátis às condições do mar</p>
      </DialogHeader>

      <form onSubmit={onSubmit} style={s.form}>
        <div style={s.field}>
          <label style={s.label}>E-mail</label>
          <Input type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} required style={s.input} />
        </div>
        <div style={s.field}>
          <label style={s.label}>Senha</label>
          <Input type="password" placeholder="Mínimo 6 caracteres" value={password} onChange={e => setPassword(e.target.value)} required style={s.input} />
        </div>
        <div style={s.field}>
          <label style={s.label}>Confirmar senha</label>
          <Input type="password" placeholder="••••••••" value={confirm} onChange={e => setConfirm(e.target.value)} required style={s.input} />
        </div>
        {error && <p style={s.error}>{error}</p>}
        <Button type="submit" disabled={loading} style={s.btnPrimary}>
          {loading ? "Criando conta…" : "Criar conta"}
        </Button>
      </form>

      <div style={s.links}>
        <span style={s.linkLabel}>Já tem conta?</span>
        <button type="button" onClick={() => onSwitchView("login")} style={s.linkBtn}>Entrar</button>
      </div>
    </>
  );
}

function RegisterSuccess({ email, onSwitchView }) {
  return (
    <>
      <DialogHeader style={s.header}>
        <DialogTitle style={s.title}>Conta criada!</DialogTitle>
      </DialogHeader>
      <p style={{ ...s.subtitle, marginBottom: "var(--spacing-md)" }}>
        Mandamos um e-mail de confirmação para <strong>{email}</strong>. Confirma lá e depois entra no app.
      </p>
      <Button variant="outline" onClick={() => onSwitchView("login")} style={s.btnPrimary}>
        Ir para o login
      </Button>
    </>
  );
}

function ForgotView({ email, setEmail, error, loading, onSubmit, onSwitchView }) {
  return (
    <>
      <DialogHeader style={s.header}>
        <DialogTitle style={s.title}>Esqueceu a senha?</DialogTitle>
        <p style={s.subtitle}>Manda seu e-mail que a gente te envia um link pra criar uma nova.</p>
      </DialogHeader>

      <form onSubmit={onSubmit} style={s.form}>
        <div style={s.field}>
          <label style={s.label}>E-mail</label>
          <Input type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} required style={s.input} />
        </div>
        {error && <p style={s.error}>{error}</p>}
        <Button type="submit" disabled={loading} style={s.btnPrimary}>
          {loading ? "Enviando…" : "Enviar link"}
        </Button>
      </form>

      <div style={s.links}>
        <button type="button" onClick={() => onSwitchView("login")} style={s.linkBtn}>Voltar pro login</button>
      </div>
    </>
  );
}

function ForgotSuccess({ email, onSwitchView }) {
  return (
    <>
      <DialogHeader style={s.header}>
        <DialogTitle style={s.title}>E-mail enviado</DialogTitle>
      </DialogHeader>
      <p style={{ ...s.subtitle, marginBottom: "var(--spacing-md)" }}>
        Mandamos um link de recuperação para <strong>{email}</strong>. Confere a caixa de entrada.
      </p>
      <Button variant="outline" onClick={() => onSwitchView("login")} style={s.btnPrimary}>
        Voltar pro login
      </Button>
    </>
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

const s = {
  header: {
    marginBottom: "var(--spacing-md)",
  },
  title: {
    fontSize: "var(--font-size-title-sm)",
    fontWeight: "var(--font-weight-bold)",
    color: "var(--text-primary)",
    textAlign: "center",
  },
  subtitle: {
    fontSize: "var(--font-size-body)",
    color: "var(--text-secondary)",
    margin: "4px 0 0",
    textAlign: "center",
    lineHeight: 1.5,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--spacing-md)",
    marginBottom: "var(--spacing-md)",
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
    margin: "var(--spacing-md) 0",
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
    marginTop: "var(--spacing-md)",
  },
  linkBtn: {
    fontSize: "var(--font-size-body)",
    color: "var(--text-primary)",
    fontWeight: "var(--font-weight-bold)",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
  },
  linkLabel: {
    fontSize: "var(--font-size-body)",
    color: "var(--text-secondary)",
  },
  linkSep: {
    color: "var(--text-secondary)",
    fontSize: "var(--font-size-body)",
  },
};
