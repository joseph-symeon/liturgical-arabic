import React, { useState } from "react";

function getFriendlyAuthMessage(message) {
  const normalized = String(message || "").toLowerCase();
  if (!message) return "";
  if (normalized.includes("invalid login credentials")) return "That email and password did not match.";
  if (normalized.includes("rate limit")) return "Too many email requests. Use password sign-in or wait a few minutes.";
  if (normalized.includes("password should be at least")) return "Use a password with at least 6 characters.";
  if (normalized.includes("already registered") || normalized.includes("already been registered")) {
    return "That email already has an account. Try signing in.";
  }
  return message;
}

export default function SyncAccountPanel({
  session,
  syncStatus,
  syncMessage,
  onSignIn,
  onCreateAccount,
  onMagicLink,
  onResetPassword,
  onUpdatePassword,
  onSignOut,
  onResetProgress,
  onClose
}) {
  const [mode, setMode] = useState("sign-in");
  const [email, setEmail] = useState(session?.user?.email || "");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [localMessage, setLocalMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const isSignedIn = Boolean(session?.user);
  const message = localMessage || syncMessage;
  const friendlyMessage = getFriendlyAuthMessage(message);
  const needsAttention = syncStatus === "error" || syncStatus === "disabled";
  const attentionLabel = syncStatus === "disabled" ? "Sync unavailable" : "Needs attention";

  async function runAction(action, successMessage = "") {
    setBusy(true);
    setLocalMessage("");
    try {
      await action();
      if (successMessage) setLocalMessage(successMessage);
      setPassword("");
      setNewPassword("");
    } catch (error) {
      setLocalMessage(error.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  function renderModeButton(value, label) {
    return (
      <button
        type="button"
        className={`app-account-tab${mode === value ? " active" : ""}`}
        onClick={() => {
          setMode(value);
          setLocalMessage("");
        }}
      >
        {label}
      </button>
    );
  }

  if (isSignedIn) {
    return (
      <div className="app-account-panel app-account-panel-signed-in" dir="ltr">
        {friendlyMessage && <div className="app-account-message">{friendlyMessage}</div>}

        <div className="app-account-actions">
          <button
            type="button"
            className="app-account-button"
            onClick={() => {
              setChangingPassword(value => !value);
              setLocalMessage("");
            }}
            disabled={busy}
          >
            {changingPassword ? "Cancel" : "Change password"}
          </button>
          <button type="button" className="app-account-button" onClick={onSignOut} disabled={busy}>
            Sign out
          </button>
        </div>

        {changingPassword && (
          <form
            className="app-account-form"
            onSubmit={event => {
              event.preventDefault();
              if (!newPassword) return;
              runAction(() => onUpdatePassword(newPassword), "Password updated.");
            }}
          >
            <label className="app-account-field">
              <span>New password</span>
              <input
                type="password"
                value={newPassword}
                onChange={event => setNewPassword(event.target.value)}
                autoComplete="new-password"
                minLength={6}
              />
            </label>
            <button type="submit" className="app-account-button primary" disabled={busy || newPassword.length < 6}>
              Save password
            </button>
          </form>
        )}

        <div className="app-account-danger">
          <button
            type="button"
            className="app-reset-control"
            onClick={() => runAction(onResetProgress)}
            disabled={busy}
          >
            Reset progress
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-account-panel" dir="ltr">
      <div className="app-account-header">
        <div className="app-account-heading">
          <h2>Sign In</h2>
        </div>
        {needsAttention && (
          <div className="app-account-header-actions">
            <span className={`app-account-status ${syncStatus}`}>{attentionLabel}</span>
          </div>
        )}
      </div>

      <div className="app-account-tabs" role="tablist" aria-label="Profile action">
        {renderModeButton("sign-in", "Sign in")}
        {renderModeButton("create", "Create")}
      </div>

      <form
        className="app-account-form"
        onSubmit={event => {
          event.preventDefault();
          if (!email || !password) return;
          if (mode === "create") {
            runAction(() => onCreateAccount({ email, password }), "Account created. If confirmation is required, check your email.");
            return;
          }
          runAction(() => onSignIn({ email, password }));
        }}
      >
        <label className="app-account-field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={event => setEmail(event.target.value)}
            autoComplete="email"
            required
          />
        </label>
        <label className="app-account-field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            autoComplete={mode === "create" ? "new-password" : "current-password"}
            minLength={6}
            required
          />
        </label>
        <button type="submit" className="app-account-button primary" disabled={busy || !email || password.length < 6}>
          {mode === "create" ? "Create account" : "Sign in"}
        </button>
      </form>

      <div className="app-account-secondary-actions">
        <button
          type="button"
          onClick={() => runAction(() => onMagicLink(email), "Check your email for the sign-in link.")}
          disabled={busy || !email}
        >
          Send magic link
        </button>
        <button
          type="button"
          onClick={() => runAction(() => onResetPassword(email), "Check your email for the password reset link.")}
          disabled={busy || !email}
        >
          Reset password
        </button>
      </div>

      {friendlyMessage && <div className="app-account-message">{friendlyMessage}</div>}
    </div>
  );
}
