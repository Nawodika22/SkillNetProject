import React, { useEffect, useState } from 'react'
import MatchingDashboard from './pages/MatchingDashboard'
import {
  ArrowRight, BriefcaseBusiness, Check, ChevronDown, CircleUserRound,
  Compass, KeyRound, LogOut, MapPin, Plus, Search, ShieldCheck, Sparkles,
  ToggleLeft, ToggleRight, Trash2, UsersRound, Wrench, X,
} from 'lucide-react'

const api = async (path, options = {}) => {
  const { headers = {}, ...rest } = options
  const response = await fetch(path, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.detail || data.message || data.error || 'Something went wrong')
  return data
}

// Vacancy Service (Port 8082 - Member 2) API Calls
const VACANCY_API_BASE = 'http://localhost:8082/api/vacancies'
const vacancyApi = {
  getAll: () => fetch(VACANCY_API_BASE).then((r) => r.json()),
  create: (data) =>
    fetch(VACANCY_API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((r) => r.json()),
  delete: (id) => fetch(`${VACANCY_API_BASE}/${id}`, { method: 'DELETE' }),
}

// Matching & Notification Service (Port 8083 - Member 3)
const NOTIFICATION_API_BASE = 'http://localhost:8083/api/notifications'

const getInitialAuth = () => {
  try {
    const raw = sessionStorage.getItem('skillnet-auth')
    return raw ? JSON.parse(raw) : null
  } catch (e) {
    return null
  }
}

function App() {
  const [auth, setAuth] = useState(getInitialAuth)
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
    searchWorkers()
  }

  const logout = () => {
    sessionStorage.removeItem('skillnet-auth')
    setAuth(null)
    setNotice({ type: 'success', text: 'You have been signed out.' })
  }

  const handleContactWorker = async (worker) => {
    const contactInfo = prompt(
      `Request hire / service from ${worker.name} (${worker.profession}):\n\nEnter your Phone Number & job requirements:`
    )
    if (!contactInfo || !contactInfo.trim()) return

    const workerId = worker.id || worker.workerId || 1

    try {
      const response = await fetch(NOTIFICATION_API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientWorkerId: workerId,
          workerName: worker.name,
          message: `Hire Inquiry: ${contactInfo.trim()}`,
          status: 'SENT',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save notification to database')
      }

      setNotice({
        type: 'success',
        text: `Hire inquiry sent to ${worker.name}! Saved in notifications database.`,
      })
    } catch (error) {
      console.error(error)
      setNotice({
        type: 'error',
        text: 'Notification service (Port 8083) not reachable. Please ensure matching-service is running.',
      })
    }
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button className="profile-chip" onClick={() => document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' })}>
                <CircleUserRound size={17} /> {auth.role === 'HR' ? (auth.companyName || 'HR workspace') : (auth.name || 'My profile')}
                <ChevronDown size={15} />
              </button>
              <button className="button button-quiet button-small" onClick={logout} title="Sign out">
                <LogOut size={15} /> Sign out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="button button-quiet button-small" onClick={() => setAuthMode('login')}>Sign in</button>
              <button className="button button-coral button-small" onClick={() => setAuthMode('register')}>Join network <ArrowRight size={14} /></button>
            </div>
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
            {workers.map((worker) => (
              <WorkerCard key={worker.id || worker.workerId} worker={worker} onContact={handleContactWorker} />
            ))}
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

function WorkerCard({ worker, onContact }) {
  const initials = worker.name?.split(' ').map((part) => part[0]).slice(0, 2).join('') || 'SN'
  return (
    <article className="worker-card">
      <div className="card-top">
        <div className="avatar">{initials}</div>
        <span className="available-pill"><i /> Available</span>
      </div>
      <h3>{worker.name}</h3>
      <p className="worker-role">{worker.profession || 'Independent specialist'}</p>
      <div className="worker-meta">
        <span><MapPin size={14} /> {worker.location || 'Location not listed'}</span>
        <span><BriefcaseBusiness size={14} /> {worker.yearsOfExperience ?? 0} years exp.</span>
      </div>
      <div className="card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          Verified profile <ShieldCheck size={16} />
        </span>
        <button 
          type="button" 
          className="button button-coral button-small" 
          onClick={() => onContact(worker)}
        >
          Request Hire
        </button>
      </div>
    </article>
  )
}

function AuthModal({ mode, onClose, onComplete, setNotice }) {
  const [isLogin, setIsLogin] = useState(mode === 'login')
  const [role, setRole] = useState('WORKER')
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    profession: '',
    yearsOfExperience: '',
    location: '',
    companyName: '',
  })
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const update = (key) => (event) => {
    setErrorMsg('')
    setForm({ ...form, [key]: event.target.value })
  }

  const switchMode = (loginState) => {
    setIsLogin(loginState)
    setErrorMsg('')
  }

  const submit = async (event) => {
    event.preventDefault()
    setErrorMsg('')
    setLoading(true)
    try {
      const path = isLogin ? '/api/auth/login' : `/api/auth/register/${role.toLowerCase()}`
      const body = isLogin
        ? { email: form.email.trim(), password: form.password }
        : role === 'WORKER'
          ? {
              name: form.name.trim(),
              email: form.email.trim(),
              password: form.password,
              profession: form.profession ? form.profession.trim() : '',
              yearsOfExperience: form.yearsOfExperience ? Number(form.yearsOfExperience) : 0,
              location: form.location ? form.location.trim() : '',
            }
          : {
              name: form.name.trim(),
              email: form.email.trim(),
              password: form.password,
              companyName: form.companyName ? form.companyName.trim() : form.name.trim() + ' Enterprise',
              location: form.location ? form.location.trim() : 'Sri Lanka',
            }

      const result = await api(path, { method: 'POST', body: JSON.stringify(body) })
      onComplete(result)
    } catch (error) {
      setErrorMsg(error.message)
      setNotice({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="auth-modal">
        <button className="close-button" onClick={onClose} aria-label="Close"><X size={19} /></button>
        <div className="modal-kicker"><span className="brand-mark"><Sparkles size={16} /></span> SkillNet network</div>
        <h2>{isLogin ? 'Welcome back.' : 'Make your work visible.'}</h2>
        <p className="modal-subtitle">
          {isLogin ? 'Sign in to continue to your workspace.' : 'Create a profile and let the right work find you.'}
        </p>

        {errorMsg && (
          <div className="modal-error-box">
            <X size={16} /> <span>{errorMsg}</span>
          </div>
        )}

        {!isLogin && (
          <div className="role-switch">
            <button
              type="button"
              className={role === 'WORKER' ? 'active' : ''}
              onClick={() => { setRole('WORKER'); setErrorMsg('') }}
            >
              <Wrench size={16} /> Independent worker
            </button>
            <button
              type="button"
              className={role === 'HR' ? 'active' : ''}
              onClick={() => { setRole('HR'); setErrorMsg('') }}
            >
              <UsersRound size={16} /> Corporate HR
            </button>
          </div>
        )}

        <form onSubmit={submit}>
          <label>
            Email address
            <input
              type="email"
              required
              value={form.email}
              onChange={update('email')}
              placeholder="you@example.com"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              minLength="6"
              required
              value={form.password}
              onChange={update('password')}
              placeholder="At least 6 characters"
            />
          </label>

          {!isLogin && (
            <>
              <label>
                {role === 'WORKER' ? 'Full name' : 'HR Representative Name'}
                <input
                  required
                  value={form.name}
                  onChange={update('name')}
                  placeholder={role === 'WORKER' ? 'e.g. Kamal Perera' : 'e.g. Samantha Smith'}
                />
              </label>

              {role === 'WORKER' ? (
                <>
                  <div className="form-row">
                    <label>
                      Profession
                      <input
                        value={form.profession}
                        onChange={update('profession')}
                        placeholder="e.g. Electrician, Plumber"
                      />
                    </label>
                    <label>
                      Experience (Years)
                      <input
                        type="number"
                        min="0"
                        value={form.yearsOfExperience}
                        onChange={update('yearsOfExperience')}
                        placeholder="0"
                      />
                    </label>
                  </div>
                  <label>
                    Location
                    <input
                      value={form.location}
                      onChange={update('location')}
                      placeholder="City or neighbourhood (e.g. Colombo)"
                    />
                  </label>
                </>
              ) : (
                <>
                  <label>
                    Company Name
                    <input
                      required
                      value={form.companyName}
                      onChange={update('companyName')}
                      placeholder="e.g. Colombo Logistics Ltd"
                    />
                  </label>
                  <label>
                    Company Location
                    <input
                      value={form.location}
                      onChange={update('location')}
                      placeholder="e.g. Colombo 03"
                    />
                  </label>
                </>
              )}
            </>
          )}

          <button className="button button-dark submit-button" disabled={loading}>
            {loading ? 'Please wait...' : isLogin ? 'Sign in' : 'Create account'} <ArrowRight size={16} />
          </button>
        </form>

        <p className="auth-switch">
          {isLogin ? 'New to SkillNet?' : 'Already have an account?'}
          <button type="button" onClick={() => switchMode(!isLogin)}>
            {isLogin ? 'Create an account' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}

function Workspace({ auth, setNotice, onLogout }) {
  const [profile, setProfile] = useState({
    name: auth?.name || '',
    profession: auth?.profession || '',
    yearsOfExperience: auth?.yearsOfExperience ?? '',
    location: auth?.location || '',
  })
  const [available, setAvailable] = useState(auth?.available ?? true)
  const [roster, setRoster] = useState([])
  const [loading, setLoading] = useState(false)
  const [workerNotifications, setWorkerNotifications] = useState([])

  // Member 3 State: Selected Vacancy to match
  const [selectedVacancyId, setSelectedVacancyId] = useState(null)

  // Member 2 States: Vacancy Management
  const [vacancies, setVacancies] = useState([])
  const [vacancyForm, setVacancyForm] = useState({
    jobTitle: '',
    requiredSkills: '',
    minExperience: '',
    targetLocation: '',
  })
  const [postingVacancy, setPostingVacancy] = useState(false)

  const tokenHeaders = { Authorization: `Bearer ${auth?.token}` }

  const loadWorkerNotifications = async () => {
    const workerId = auth?.id || auth?.workerId
    if (!workerId) return
    try {
      const res = await fetch(`${NOTIFICATION_API_BASE}/worker/${workerId}`)
      if (res.ok) {
        const data = await res.json()
        setWorkerNotifications(data)
      }
    } catch (e) {
      console.error('Failed to load worker notifications:', e)
    }
  }

  const saveProfile = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      const data = await api('/api/workers/me/profile', {
        method: 'PUT',
        headers: tokenHeaders,
        body: JSON.stringify({ ...profile, yearsOfExperience: profile.yearsOfExperience ? Number(profile.yearsOfExperience) : null }),
      })
      setProfile({ name: data.name || '', profession: data.profession || '', yearsOfExperience: data.yearsOfExperience || '', location: data.location || '' })
      setAvailable(data.available)
      setNotice({ type: 'success', text: 'Profile updated.' })
    } catch (error) {
      setNotice({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  const toggleAvailability = async () => {
    try {
      const data = await api('/api/workers/me/availability', { method: 'PATCH', headers: tokenHeaders, body: JSON.stringify({ available: !available }) })
      setAvailable(data.available)
      setNotice({ type: 'success', text: data.available ? 'You are now visible in search.' : 'You are now hidden from search.' })
    } catch (error) {
      setNotice({ type: 'error', text: error.message })
    }
  }

  const loadRoster = async () => {
    try {
      setRoster(await api('/api/hr/workers', { headers: tokenHeaders }))
    } catch (error) {
      setNotice({ type: 'error', text: error.message })
    }
  }

  // Member 2 Functions: Load, Create, and Delete Vacancies
  const loadVacancies = async () => {
    try {
      const data = await vacancyApi.getAll()
      setVacancies(data)
    } catch (error) {
      console.error('Failed to load vacancies:', error)
    }
  }

  const handleCreateVacancy = async (e) => {
    e.preventDefault()
    setPostingVacancy(true)
    try {
      await vacancyApi.create({
        companyId: auth.id || 1,
        jobTitle: vacancyForm.jobTitle,
        requiredSkills: vacancyForm.requiredSkills,
        minExperience: Number(vacancyForm.minExperience),
        targetLocation: vacancyForm.targetLocation,
      })
      setVacancyForm({ jobTitle: '', requiredSkills: '', minExperience: '', targetLocation: '' })
      setNotice({ type: 'success', text: 'Job vacancy published successfully.' })
      loadVacancies()
    } catch (error) {
      setNotice({ type: 'error', text: 'Could not create vacancy. Make sure vacancy-service is running on port 8082.' })
    } finally {
      setPostingVacancy(false)
    }
  }

  const handleDeleteVacancy = async (id) => {
    try {
      await vacancyApi.delete(id)
      if (selectedVacancyId === id) setSelectedVacancyId(null)
      setNotice({ type: 'success', text: 'Vacancy deleted.' })
      loadVacancies()
    } catch (error) {
      setNotice({ type: 'error', text: 'Failed to delete vacancy.' })
    }
  }

  useEffect(() => {
    if (!auth) return
    if (auth.role === 'WORKER') {
      loadWorkerNotifications()
      setProfile({
        name: auth.name || '',
        profession: auth.profession || '',
        yearsOfExperience: auth.yearsOfExperience ?? '',
        location: auth.location || '',
      })
      setAvailable(auth.available ?? true)

      api('/api/workers/me/profile', { headers: tokenHeaders })
        .then((data) => {
          if (data) {
            setProfile({
              name: data.name || '',
              profession: data.profession || '',
              yearsOfExperience: data.yearsOfExperience ?? '',
              location: data.location || '',
            })
            if (data.available !== undefined) setAvailable(data.available)
          }
        })
        .catch(() => {})
    } else if (auth.role === 'HR') {
      loadRoster()
      loadVacancies()
    }
  }, [auth?.id, auth?.role])

  return (
    <section className="workspace-section" id="workspace">
      <div className="workspace-heading">
        <div>
          <p className="eyebrow">Private workspace</p>
          <h2>
            {auth.role === 'HR' ? (
              <>Corporate HR, <em>hiring hub.</em></>
            ) : (
              <>Put your best work <em>forward.</em></>
            )}
          </h2>
        </div>
        <button className="button button-quiet" onClick={onLogout}><LogOut size={16} /> Sign out</button>
      </div>

      {auth.role === 'WORKER' ? (
        <div className="worker-workspace">
          <div className={`availability-banner ${available ? 'is-available' : ''}`}>
            <div>
              <span className="status-orb" />
              <div>
                <strong>{available ? 'You are visible to local searches' : 'You are currently hidden'}</strong>
                <span>{available ? 'People looking for your skills can find you now.' : 'Turn on availability when you are ready for new work.'}</span>
              </div>
            </div>
            <button className="icon-toggle" onClick={toggleAvailability} aria-label="Toggle availability">
              {available ? <ToggleRight size={39} /> : <ToggleLeft size={39} />}
            </button>
          </div>
          <form className="profile-form" onSubmit={saveProfile}>
            <div className="form-heading">
              <div><span className="number-label">01 / PROFILE</span><h3>Your professional profile</h3></div>
              <span className="saved-note"><KeyRound size={14} /> Secured account</span>
            </div>
            <div className="form-grid">
              <label>Full name<input required value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} placeholder="Your name" /></label>
              <label>Profession<input value={profile.profession} onChange={(e) => setProfile({ ...profile, profession: e.target.value })} placeholder="e.g. Painter" /></label>
              <label>Years of experience<input type="number" min="0" value={profile.yearsOfExperience} onChange={(e) => setProfile({ ...profile, yearsOfExperience: e.target.value })} placeholder="0" /></label>
              <label>Location<input value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} placeholder="City or neighbourhood" /></label>
            </div>
            <button className="button button-coral" disabled={loading}>{loading ? 'Saving...' : 'Save profile'} <Check size={16} /></button>
          </form>

          {/* Worker Notifications Section */}
          <div className="roster-panel" style={{ marginTop: '1.5rem', width: '100%', maxWidth: '640px' }}>
            <div className="roster-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div><span className="number-label">02 / NOTIFICATIONS</span><h3>Job Matches & Inquiries</h3></div>
              <button 
                type="button"
                className="button button-quiet button-small" 
                onClick={loadWorkerNotifications} 
                style={{ marginLeft: 'auto' }}
              >
                Refresh
              </button>
            </div>
            <div className="roster-list">
              {workerNotifications.map((notif) => (
                <div className="roster-row" key={notif.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '6px', padding: '14px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontWeight: '600',
                      fontSize: '0.82rem',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      background: notif.message?.toLowerCase().includes('hire') ? '#ffedd5' : '#e0f2fe',
                      color: notif.message?.toLowerCase().includes('hire') ? '#c2410c' : '#0369a1',
                    }}>
                      {notif.message?.toLowerCase().includes('hire') ? '💼 Hire Request' : '⚡ Job Match'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      {notif.createdAt ? new Date(notif.createdAt).toLocaleString() : 'Recent'}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: '#334155', lineHeight: 1.4 }}>{notif.message}</p>
                </div>
              ))}
              {workerNotifications.length === 0 && (
                <div className="empty-state">
                  <Sparkles size={24} />
                  <strong>No notifications yet</strong>
                  <span>When employers match or request to hire you, notifications will appear here.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="hr-workspace" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Member 2: Corporate Job Vacancy Management */}
          <div className="profile-form" style={{ maxWidth: '100%' }}>
            <div className="form-heading">
              <div><span className="number-label">01 / RECRUITMENT</span><h3>Post a corporate vacancy</h3></div>
              <span className="saved-note"><BriefcaseBusiness size={14} /> Microservice 2</span>
            </div>
            <form onSubmit={handleCreateVacancy}>
              <div className="form-grid">
                <label>Job title<input required value={vacancyForm.jobTitle} onChange={(e) => setVacancyForm({ ...vacancyForm, jobTitle: e.target.value })} placeholder="e.g. Senior Electrician" /></label>
                <label>Target location<input required value={vacancyForm.targetLocation} onChange={(e) => setVacancyForm({ ...vacancyForm, targetLocation: e.target.value })} placeholder="e.g. Colombo" /></label>
                <label>Minimum experience (Years)<input type="number" min="0" required value={vacancyForm.minExperience} onChange={(e) => setVacancyForm({ ...vacancyForm, minExperience: e.target.value })} placeholder="e.g. 2" /></label>
                <label>Required skills<input required value={vacancyForm.requiredSkills} onChange={(e) => setVacancyForm({ ...vacancyForm, requiredSkills: e.target.value })} placeholder="e.g. Wiring, Maintenance" /></label>
              </div>
              <button className="button button-dark" style={{ marginTop: '1rem' }} disabled={postingVacancy}>
                {postingVacancy ? 'Posting...' : 'Create vacancy'} <Plus size={16} />
              </button>
            </form>
          </div>

          {/* Member 2: Active Vacancies List */}
          <div className="roster-panel">
            <div className="roster-title">
              <div><span className="number-label">ACTIVE VACANCIES</span><h3>Posted job openings</h3></div>
              <span className="roster-count">{vacancies.length} active</span>
            </div>
            <div className="roster-list">
              {vacancies.map((v) => (
                <div className="roster-row" key={v.vacancyId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div className="avatar avatar-small"><BriefcaseBusiness size={16} /></div>
                    <div>
                      <strong>{v.jobTitle}</strong>
                      <span>{v.targetLocation} · Min {v.minExperience} yrs exp · Skills: {v.requiredSkills}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button
                      className="button button-small button-quiet"
                      style={{ 
                        background: selectedVacancyId === v.vacancyId ? '#0284c7' : undefined,
                        color: selectedVacancyId === v.vacancyId ? '#fff' : undefined
                      }}
                      onClick={() => setSelectedVacancyId(selectedVacancyId === v.vacancyId ? null : v.vacancyId)}
                    >
                      {selectedVacancyId === v.vacancyId ? 'Close matches' : 'Find matches'}
                    </button>
                    <button
                      className="button button-small button-quiet"
                      style={{ color: '#ef4444' }}
                      onClick={() => handleDeleteVacancy(v.vacancyId)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {vacancies.length === 0 && (
                <div className="empty-state">
                  <BriefcaseBusiness size={25} />
                  <strong>No vacancies posted yet</strong>
                  <span>Create your first job vacancy using the form above.</span>
                </div>
              )}
            </div>
          </div>

          {/* Member 3: Matching & Notification Section */}
          {selectedVacancyId && (
            <MatchingDashboard vacancyId={selectedVacancyId} />
          )}

          {/* Member 1: Worker Roster */}
          <div className="roster-panel">
            <div className="roster-title">
              <div><span className="number-label">REGISTERED WORKERS</span><h3>Member 1 directory</h3></div>
              <span className="roster-count">{roster.length} profiles</span>
            </div>
            <div className="roster-list">
              {roster.map((worker) => (
                <div className="roster-row" key={worker.id}>
                  <div className="avatar avatar-small">{worker.name?.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div>
                  <div>
                    <strong>{worker.name}</strong>
                    <span>{worker.profession || 'Specialist'} · {worker.location || 'No location'}</span>
                  </div>
                  <span className={`roster-status ${worker.available ? 'on' : ''}`}>
                    <i /> {worker.available ? 'Available' : 'Offline'}
                  </span>
                </div>
              ))}
              {roster.length === 0 && (
                <div className="empty-state">
                  <UsersRound size={25} />
                  <strong>No worker profiles yet</strong>
                  <span>Profiles will appear here as workers join.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default App