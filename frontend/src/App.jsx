import { useEffect, useState } from 'react'
import {
  ArrowRight, BriefcaseBusiness, Check, ChevronDown, CircleUserRound,
  Compass, KeyRound, LogOut, MapPin, Search, ShieldCheck, Sparkles,
  ToggleLeft, ToggleRight, UsersRound, Wrench, X,
} from 'lucide-react'

const api = async (path, options = {}) => {
  const response = await fetch(path, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.detail || data.message || data.error || 'Something went wrong')
  return data
}

const emptyProfile = { name: '', profession: '', yearsOfExperience: '', location: '' }
const storedAuth = JSON.parse(sessionStorage.getItem('skillnet-auth') || 'null')

function App() {
  const [auth, setAuth] = useState(storedAuth)
  const [authMode, setAuthMode] = useState(null)
  const [notice, setNotice] = useState(null)
  const [query, setQuery] = useState({ profession: '', location: '' })
  const [workers, setWorkers] = useState([])
  const [searching, setSearching] = useState(false)

  const searchWorkers = async (event) => {
    event?.preventDefault()
    setSearching(true)
    try {
      const params = new URLSearchParams()
      if (query.profession) params.set('profession', query.profession)
      if (query.location) params.set('location', query.location)
      setWorkers(await api(`/api/workers/search?${params}`))
    } catch (error) {
      setNotice({ type: 'error', text: error.message })
    } finally {
      setSearching(false)
    }
  }

  useEffect(() => { searchWorkers() }, [])

  const completeAuth = (result) => {
    sessionStorage.setItem('skillnet-auth', JSON.stringify(result))
    setAuth(result)
    setAuthMode(null)
    setNotice({ type: 'success', text: result.role === 'WORKER' ? 'Your workspace is ready.' : 'HR workspace unlocked.' })
  }

  const logout = () => {
    sessionStorage.removeItem('skillnet-auth')
    setAuth(null)
    setNotice({ type: 'success', text: 'You have been signed out.' })
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="SkillNet home">
          <span className="brand-mark"><Sparkles size={18} /></span>
          <span>skill<span>net</span></span>
        </a>
        <nav className="nav-links" aria-label="Main navigation">
          <a href="#discover">Discover talent</a>
          {auth && <a href="#workspace">My workspace</a>}
        </nav>
        <div className="nav-actions">
          {auth ? (
            <button className="profile-chip" onClick={() => document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' })}>
              <CircleUserRound size={17} /> {auth.role === 'HR' ? 'HR workspace' : 'My profile'}
              <ChevronDown size={15} />
            </button>
          ) : (
            <button className="button button-dark button-small" onClick={() => setAuthMode('login')}>Sign in <ArrowRight size={15} /></button>
          )}
        </div>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-dot" /> Local work, done well</p>
            <h1>Good work starts<br /><em>with the right hands.</em></h1>
            <p className="hero-lede">Connect with independent specialists who bring care, craft, and real experience to every job.</p>
            <a className="text-link" href="#discover">Explore the network <ArrowRight size={17} /></a>
          </div>
          <div className="hero-art" aria-label="SkillNet network illustration">
            <div className="sun-disc" />
            <div className="art-card art-card-main"><Wrench size={23} /><strong>Practical expertise</strong><span>Close to home</span></div>
            <div className="art-card art-card-note"><Check size={16} /> Verified people</div>
            <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
            <span className="art-label label-one">01</span><span className="art-label label-two">SKILL / TRUST</span>
          </div>
        </section>

        <section className="trust-strip">
          <div><ShieldCheck size={18} /> <span>Profiles built on real experience</span></div>
          <div><MapPin size={18} /> <span>Find help in your neighbourhood</span></div>
          <div><BriefcaseBusiness size={18} /> <span>Independent work, made visible</span></div>
        </section>

        <section className="discover-section" id="discover">
          <div className="section-heading">
            <div><p className="eyebrow">The open network</p><h2>Find someone<br /><em>who knows how.</em></h2></div>
            <p className="section-note">Search the live directory of available workers. Every profile is built by the person behind the work.</p>
          </div>
          <form className="search-panel" onSubmit={searchWorkers}>
            <div className="search-field"><Search size={19} /><input value={query.profession} onChange={(e) => setQuery({ ...query, profession: e.target.value })} placeholder="What do you need done?" /></div>
            <div className="search-field"><MapPin size={19} /><input value={query.location} onChange={(e) => setQuery({ ...query, location: e.target.value })} placeholder="Where? e.g. Colombo" /></div>
            <button className="button button-coral" type="submit" disabled={searching}>{searching ? 'Searching...' : 'Search workers'} <ArrowRight size={16} /></button>
          </form>
          <div className="directory-header"><span>{workers.length} available {workers.length === 1 ? 'specialist' : 'specialists'}</span><span className="live-indicator"><i /> Live availability</span></div>
          <div className="worker-grid">
            {workers.map((worker) => <WorkerCard key={worker.id} worker={worker} />)}
            {!searching && workers.length === 0 && <div className="empty-state"><Compass size={25} /><strong>No matching workers yet</strong><span>Try a broader profession or location.</span></div>}
          </div>
        </section>

        {auth && <Workspace auth={auth} setNotice={setNotice} onLogout={logout} />}
      </main>

      <footer><div className="brand"><span className="brand-mark"><Sparkles size={15} /></span><span>skill<span>net</span></span></div><span>Independent work, connected.</span><span>© 2026 SkillNet</span></footer>
      {notice && <div className={`toast ${notice.type}`}><span>{notice.type === 'success' ? <Check size={16} /> : <X size={16} />}</span>{notice.text}<button onClick={() => setNotice(null)}><X size={15} /></button></div>}
      {authMode && <AuthModal mode={authMode} onClose={() => setAuthMode(null)} onComplete={completeAuth} setNotice={setNotice} />}
      {!auth && <button className="floating-join" onClick={() => setAuthMode('register')}><Sparkles size={16} /> Join the network</button>}
    </div>
  )
}

function WorkerCard({ worker }) {
  const initials = worker.name?.split(' ').map((part) => part[0]).slice(0, 2).join('') || 'SN'
  return <article className="worker-card"><div className="card-top"><div className="avatar">{initials}</div><span className="available-pill"><i /> Available</span></div><h3>{worker.name}</h3><p className="worker-role">{worker.profession || 'Independent specialist'}</p><div className="worker-meta"><span><MapPin size={14} /> {worker.location || 'Location not listed'}</span><span><BriefcaseBusiness size={14} /> {worker.yearsOfExperience ?? 0} years exp.</span></div><div className="card-footer"><span>Verified profile</span><ShieldCheck size={16} /></div></article>
}

function AuthModal({ mode, onClose, onComplete, setNotice }) {
  const [isLogin, setIsLogin] = useState(mode === 'login')
  const [role, setRole] = useState('WORKER')
  const [form, setForm] = useState({ email: '', password: '', name: '', profession: '', yearsOfExperience: '', location: '', registrationKey: '' })
  const [loading, setLoading] = useState(false)
  const update = (key) => (event) => setForm({ ...form, [key]: event.target.value })
  const submit = async (event) => {
    event.preventDefault(); setLoading(true)
    try {
      const path = isLogin ? '/api/auth/login' : `/api/auth/register/${role.toLowerCase()}`
      const body = isLogin ? { email: form.email, password: form.password } : {
        email: form.email, password: form.password, name: form.name,
        profession: role === 'WORKER' ? form.profession : undefined,
        yearsOfExperience: role === 'WORKER' && form.yearsOfExperience ? Number(form.yearsOfExperience) : undefined,
        location: role === 'WORKER' ? form.location : undefined,
      }
      const headers = !isLogin && role === 'HR' ? { 'X-HR-Registration-Key': form.registrationKey } : {}
      onComplete(await api(path, { method: 'POST', body: JSON.stringify(body), headers }))
    } catch (error) { setNotice({ type: 'error', text: error.message }) } finally { setLoading(false) }
  }
  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><div className="auth-modal"><button className="close-button" onClick={onClose} aria-label="Close"><X size={19} /></button><div className="modal-kicker"><span className="brand-mark"><Sparkles size={16} /></span> SkillNet network</div><h2>{isLogin ? 'Welcome back.' : 'Make your work visible.'}</h2><p className="modal-subtitle">{isLogin ? 'Sign in to continue to your workspace.' : 'Create a profile and let the right work find you.'}</p>{!isLogin && <div className="role-switch"><button className={role === 'WORKER' ? 'active' : ''} onClick={() => setRole('WORKER')}><Wrench size={16} /> Independent worker</button><button className={role === 'HR' ? 'active' : ''} onClick={() => setRole('HR')}><UsersRound size={16} /> Corporate HR</button></div>}<form onSubmit={submit}><label>Email address<input type="email" required value={form.email} onChange={update('email')} placeholder="you@example.com" /></label><label>Password<input type="password" minLength="8" required value={form.password} onChange={update('password')} placeholder="At least 8 characters" /></label>{!isLogin && <><label>Full name<input required value={form.name} onChange={update('name')} placeholder="Your name" /></label>{role === 'WORKER' ? <div className="form-row"><label>Profession<input value={form.profession} onChange={update('profession')} placeholder="e.g. Electrician" /></label><label>Experience<input type="number" min="0" value={form.yearsOfExperience} onChange={update('yearsOfExperience')} placeholder="Years" /></label></div> : <label>HR registration key<input required value={form.registrationKey} onChange={update('registrationKey')} placeholder="Provided by your administrator" /></label>}{role === 'WORKER' && <label>Location<input value={form.location} onChange={update('location')} placeholder="City or neighbourhood" /></label>}</>}<button className="button button-dark submit-button" disabled={loading}>{loading ? 'Please wait...' : isLogin ? 'Sign in' : 'Create account'} <ArrowRight size={16} /></button></form><p className="auth-switch">{isLogin ? 'New to SkillNet?' : 'Already have an account?'} <button onClick={() => setIsLogin(!isLogin)}>{isLogin ? 'Create an account' : 'Sign in'}</button></p></div></div>
}

function Workspace({ auth, setNotice, onLogout }) {
  const [profile, setProfile] = useState(emptyProfile)
  const [available, setAvailable] = useState(false)
  const [roster, setRoster] = useState([])
  const [loading, setLoading] = useState(false)
  const tokenHeaders = { Authorization: `Bearer ${auth.token}` }
  const saveProfile = async (event) => { event.preventDefault(); setLoading(true); try { const data = await api('/api/workers/me/profile', { method: 'PUT', headers: tokenHeaders, body: JSON.stringify({ ...profile, yearsOfExperience: profile.yearsOfExperience ? Number(profile.yearsOfExperience) : null }) }); setProfile({ name: data.name || '', profession: data.profession || '', yearsOfExperience: data.yearsOfExperience || '', location: data.location || '' }); setAvailable(data.available); setNotice({ type: 'success', text: 'Profile updated.' }) } catch (error) { setNotice({ type: 'error', text: error.message }) } finally { setLoading(false) } }
  const toggleAvailability = async () => { try { const data = await api('/api/workers/me/availability', { method: 'PATCH', headers: tokenHeaders, body: JSON.stringify({ available: !available }) }); setAvailable(data.available); setNotice({ type: 'success', text: data.available ? 'You are now visible in search.' : 'You are now hidden from search.' }) } catch (error) { setNotice({ type: 'error', text: error.message }) } }
  const loadRoster = async () => { try { setRoster(await api('/api/hr/workers', { headers: tokenHeaders })) } catch (error) { setNotice({ type: 'error', text: error.message }) } }
  useEffect(() => { if (auth.role === 'HR') loadRoster() }, [auth.role])
  return <section className="workspace-section" id="workspace"><div className="workspace-heading"><div><p className="eyebrow">Private workspace</p><h2>{auth.role === 'HR' ? 'Your people, <em>in one view.</em>' : 'Put your best work <em>forward.</em>'}</h2></div><button className="button button-quiet" onClick={onLogout}><LogOut size={16} /> Sign out</button></div>{auth.role === 'WORKER' ? <div className="worker-workspace"><div className={`availability-banner ${available ? 'is-available' : ''}`}><div><span className="status-orb" /><div><strong>{available ? 'You are visible to local searches' : 'You are currently hidden'}</strong><span>{available ? 'People looking for your skills can find you now.' : 'Turn on availability when you are ready for new work.'}</span></div></div><button className="icon-toggle" onClick={toggleAvailability} aria-label="Toggle availability">{available ? <ToggleRight size={39} /> : <ToggleLeft size={39} />}</button></div><form className="profile-form" onSubmit={saveProfile}><div className="form-heading"><div><span className="number-label">01 / PROFILE</span><h3>Your professional profile</h3></div><span className="saved-note"><KeyRound size={14} /> Secured account</span></div><div className="form-grid"><label>Full name<input required value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} placeholder="Your name" /></label><label>Profession<input value={profile.profession} onChange={(e) => setProfile({ ...profile, profession: e.target.value })} placeholder="e.g. Painter" /></label><label>Years of experience<input type="number" min="0" value={profile.yearsOfExperience} onChange={(e) => setProfile({ ...profile, yearsOfExperience: e.target.value })} placeholder="0" /></label><label>Location<input value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} placeholder="City or neighbourhood" /></label></div><button className="button button-coral" disabled={loading}>{loading ? 'Saving...' : 'Save profile'} <Check size={16} /></button></form></div> : <div className="roster-panel"><div className="roster-title"><div><span className="number-label">LIVE DIRECTORY</span><h3>Worker profiles</h3></div><span className="roster-count">{roster.length} profiles</span></div><div className="roster-list">{roster.map((worker) => <div className="roster-row" key={worker.id}><div className="avatar avatar-small">{worker.name?.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div><div><strong>{worker.name}</strong><span>{worker.profession || 'Specialist'} · {worker.location || 'No location'}</span></div><span className={`roster-status ${worker.available ? 'on' : ''}`}><i /> {worker.available ? 'Available' : 'Offline'}</span></div>)}{roster.length === 0 && <div className="empty-state"><UsersRound size={25} /><strong>No worker profiles yet</strong><span>Profiles will appear here as workers join.</span></div>}</div></div>}</section>
}

export default App
