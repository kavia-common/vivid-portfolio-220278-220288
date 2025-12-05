import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import './App.css';

/**
 * Simple localStorage token utilities
 */
const TOKEN_KEY = 'auth_token';

// PUBLIC_INTERFACE
export function getToken() {
  /** Returns the current auth token from localStorage (if any). */
  return localStorage.getItem(TOKEN_KEY);
}

// PUBLIC_INTERFACE
export function setToken(token) {
  /** Sets the auth token in localStorage. */
  localStorage.setItem(TOKEN_KEY, token);
}

// PUBLIC_INTERFACE
export function clearToken() {
  /** Clears the auth token from localStorage. */
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * API client with Bearer token using fetch
 */
// PUBLIC_INTERFACE
export async function apiRequest(path, options = {}) {
  /**
   * Makes a request to the backend API using REACT_APP_API_BASE_URL
   * Adds Authorization: Bearer <token> header if available.
   */
  const base = process.env.REACT_APP_API_BASE_URL || '';
  const token = getToken();

  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(`${base}${path}`, {
    ...options,
    headers,
  });
  const contentType = res.headers.get('content-type') || '';
  let data = null;
  if (contentType.includes('application/json')) {
    data = await res.json();
  } else {
    data = await res.text();
  }
  if (!res.ok) {
    const error = new Error((data && data.message) || `Request failed ${res.status}`);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

/**
 * IntersectionObserver hook for reveal-on-scroll animations
 */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      node.classList.add('visible');
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/** Layout components */
function Header({ theme, onToggleTheme }) {
  return (
    <header className="header" role="banner">
      <nav className="nav" aria-label="Primary">
        <span className="brand" aria-label="Brand: Vivid Portfolio">
          <span className="brand-badge" aria-hidden="true" />
          Vivid Portfolio
        </span>
        <div className="nav-links">
          <a className="nav-link" href="#hero">Home</a>
          <a className="nav-link" href="#projects">Projects</a>
          <a className="nav-link" href="#about">About</a>
          <a className="nav-link" href="#skills">Skills</a>
          <a className="nav-link" href="#contact">Contact</a>
          <Link className="nav-link" to="/admin">Admin</Link>
          <button
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-pressed={theme === 'dark'}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title="Toggle theme"
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      © {new Date().getFullYear()} Vivid Portfolio · Built with React
    </footer>
  );
}

/** Sections */
function HeroSection() {
  const ref = useReveal();
  return (
    <section id="hero" className="section card reveal" ref={ref} aria-labelledby="hero-title">
      <div className="hero">
        <div className="hero-left">
          <h1 className="hero-title" id="hero-title">Designing delightful, performant web experiences.</h1>
          <p className="hero-sub">
            A modern portfolio with subtle motion, clean aesthetics, and a focus on accessibility and responsiveness.
          </p>
          <div className="hero-actions">
            <a href="#projects" className="btn btn-primary">View Projects</a>
            <a href="#contact" className="btn btn-outline">Contact Me</a>
          </div>
        </div>
        <div aria-hidden="true" className="card" style={{ minHeight: 260, background: 'radial-gradient(1200px 300px at 20% 0%, rgba(37,99,235,.12), transparent), radial-gradient(900px 200px at 80% 0%, rgba(245,158,11,.12), transparent)' }} />
      </div>
    </section>
  );
}

function ProjectsSection() {
  const ref = useReveal();
  const projects = useMemo(() => ([
    { id: 1, title: 'Interactive Gallery', desc: 'A smooth, canvas-accelerated gallery.' },
    { id: 2, title: 'Realtime Dashboard', desc: 'Live metrics with WebSocket updates.' },
    { id: 3, title: 'API-first Blog', desc: 'Headless CMS powering a sleek blog.' },
    { id: 4, title: '3D Landing', desc: 'Three.js enhanced landing experience.' },
    { id: 5, title: 'E-commerce UI', desc: 'Accessible, fast storefront.' },
    { id: 6, title: 'Portfolio Kit', desc: 'Reusable components for portfolios.' },
  ]), []);
  return (
    <section id="projects" className="section reveal" ref={ref} aria-labelledby="projects-title">
      <h2 className="hero-title" id="projects-title" style={{ fontSize: '28px', marginBottom: 16 }}>Projects</h2>
      <div className="grid">
        {projects.map((p) => (
          <article key={p.id} className="card project col-4 reveal" aria-labelledby={`proj-${p.id}-title`}>
            <div className="project-cover" />
            <div className="project-body">
              <h3 className="project-title" id={`proj-${p.id}-title`}>{p.title}</h3>
              <p className="project-desc">{p.desc}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function AboutSkillsSection() {
  const ref = useReveal();
  return (
    <section id="about" className="section reveal" ref={ref} aria-labelledby="about-title">
      <h2 className="hero-title" id="about-title" style={{ fontSize: '28px', marginBottom: 16 }}>About & Skills</h2>
      <div className="split">
        <div className="card" id="about-card">
          <div style={{ padding: 20 }}>
            <h3 style={{ marginTop: 0 }}>About</h3>
            <p className="hero-sub" style={{ marginBottom: 0 }}>
              I craft performant, accessible web apps with a keen eye for interaction, animation, and clean architecture.
            </p>
          </div>
        </div>
        <div className="card" id="skills">
          <div style={{ padding: 20 }}>
            <h3 style={{ marginTop: 0 }}>Skills</h3>
            <div className="list" role="list">
              <div className="list-item" role="listitem">React, TypeScript, Accessibility</div>
              <div className="list-item" role="listitem">Node.js, REST APIs</div>
              <div className="list-item" role="listitem">CSS Architecture, Animations</div>
              <div className="list-item" role="listitem">Testing Library / Jest</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const ref = useReveal();
  const [status, setStatus] = useState('idle');
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      // Integration with backend contact endpoint (assumed path)
      await apiRequest('/contact', { method: 'POST', body: JSON.stringify(form) });
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="section reveal" ref={ref} aria-labelledby="contact-title">
      <h2 className="hero-title" id="contact-title" style={{ fontSize: '28px', marginBottom: 16 }}>Contact</h2>
      <form className="card form" onSubmit={onSubmit} noValidate>
        <label htmlFor="name">Name</label>
        <input className="input" id="name" name="name" type="text" autoComplete="name" required value={form.name} onChange={onChange} />
        <label htmlFor="email">Email</label>
        <input className="input" id="email" name="email" type="email" autoComplete="email" required value={form.email} onChange={onChange} />
        <label htmlFor="message">Message</label>
        <textarea className="textarea" id="message" name="message" required value={form.message} onChange={onChange} />
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button className="btn btn-primary" type="submit" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Sending…' : 'Send'}
          </button>
          {status === 'success' && <span role="status" aria-live="polite" style={{ color: 'green' }}>Message sent!</span>}
          {status === 'error' && <span role="alert" style={{ color: 'var(--error)' }}>Failed to send. Try again.</span>}
        </div>
      </form>
    </section>
  );
}

/** Auth and protected routes */
function useAuth() {
  const [token, setTok] = useState(getToken());
  const login = useCallback(async (email, password) => {
    // Example login call
    const data = await apiRequest('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    if (data && data.token) {
      setToken(data.token);
      setTok(data.token);
      return true;
    }
    return false;
  }, []);
  const logout = useCallback(() => {
    clearToken();
    setTok(null);
  }, []);
  return { token, login, logout };
}

function RequireAuth({ children }) {
  const token = getToken();
  const location = useLocation();
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}

function LoginPage() {
  const ref = useReveal();
  const auth = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin';
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting'); setError('');
    try {
      const ok = await auth.login(form.email, form.password);
      if (ok) {
        window.location.replace(from);
      } else {
        setError('Invalid credentials');
        setStatus('idle');
      }
    } catch (err) {
      setError('Login failed');
      setStatus('idle');
    }
  };

  return (
    <main className="section reveal" ref={ref} aria-labelledby="login-title">
      <div className="card" style={{ maxWidth: 420, margin: '0 auto' }}>
        <form className="form" onSubmit={onSubmit}>
          <h1 id="login-title" style={{ margin: 0 }}>Login</h1>
          <label htmlFor="email">Email</label>
          <input className="input" id="email" name="email" type="email" required value={form.email} onChange={onChange} />
          <label htmlFor="password">Password</label>
          <input className="input" id="password" name="password" type="password" required value={form.password} onChange={onChange} />
          {error && <div role="alert" style={{ color: 'var(--error)' }}>{error}</div>}
          <button className="btn btn-primary" disabled={status === 'submitting'}>{status === 'submitting' ? 'Signing in…' : 'Sign in'}</button>
        </form>
      </div>
    </main>
  );
}

function AdminPage() {
  const ref = useReveal();
  const { logout } = useAuth();
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');

  const save = async () => {
    setSaving(true); setStatus('');
    try {
      // Example protected call
      const res = await apiRequest('/admin/notice', { method: 'POST', body: JSON.stringify({ message }) });
      setStatus(res?.status || 'Saved!');
    } catch (e) {
      setStatus('Failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="section reveal" ref={ref} aria-labelledby="admin-title">
      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10 }}>
          <h1 id="admin-title" style={{ margin: 0 }}>Admin Panel</h1>
          <button className="btn btn-outline" onClick={logout}>Logout</button>
        </div>
        <p className="hero-sub">Update portfolio content (example protected area).</p>
        <label htmlFor="notice">Site notice</label>
        <textarea id="notice" className="textarea" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a notice to save…" />
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
          {!!status && <span role="status" aria-live="polite">{status}</span>}
        </div>
      </div>
    </main>
  );
}

/** Landing page composed of sections */
function Landing() {
  return (
    <main>
      <HeroSection />
      <ProjectsSection />
      <AboutSkillsSection />
      <ContactSection />
    </main>
  );
}

// PUBLIC_INTERFACE
function App() {
  /** Root app with routes and theme toggling */
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  return (
    <Router>
      <div className="app">
        <Header theme={theme} onToggleTheme={toggleTheme} />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <RequireAuth>
                <AdminPage />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
