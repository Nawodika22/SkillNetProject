```jsx
import { useEffect, useState } from 'react'
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  CircleUserRound,
  Compass,
  LogOut,
  MapPin,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  UsersRound,
  Wrench,
  X,
} from 'lucide-react'

import Login from './pages/Login'
import Register from './pages/Register'
import WorkerProfile from './pages/WorkerProfile'
import HRProfile from './pages/HRProfile'
import WorkerSearch from './pages/WorkerSearch'
import { workerService } from './services/authService'


// ============================================================
// GENERAL API HELPER
// ============================================================

const api = async (path, options = {}) => {
  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(
      data.detail ||
      data.message ||
      data.error ||
      'Something went wrong'
    )
  }

  return data
}


// ============================================================
// VACANCY SERVICE - PORT 8082
// ============================================================

const VACANCY_API_BASE = 'http://localhost:8082/api/vacancies'

const vacancyApi = {
  getAll: async () => {
    const response = await fetch(VACANCY_API_BASE)

    if (!response.ok) {
      throw new Error('Failed to load vacancies')
    }

    return response.json()
  },

  create: async (data) => {
    const response = await fetch(VACANCY_API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))

      throw new Error(
        errorData.message ||
        errorData.error ||
        'Failed to create vacancy'
      )
    }

    return response.json()
  },

  delete: async (id) => {
    const response = await fetch(`${VACANCY_API_BASE}/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('Failed to delete vacancy')
    }

    return response
  },
}


// ============================================================
// DEFAULT PROFILE
// ============================================================

const emptyProfile = {
  name: '',
  profession: '',
  yearsOfExperience: '',
  location: '',
}


// ============================================================
// MAIN APP
// ============================================================

function App() {
  const [auth, setAuth] = useState(null)
  const [notice, setNotice] = useState(null)

  const [query, setQuery] = useState({
    profession: '',
    location: '',
  })

  const [workers, setWorkers] = useState([])
  const [searching, setSearching] = useState(false)

  const [currentPage, setCurrentPage] = useState('home')


  // ----------------------------------------------------------
  // Load authentication from localStorage
  // ----------------------------------------------------------

  useEffect(() => {
    const storedAuth = localStorage.getItem('auth')

    if (storedAuth) {
      try {
        setAuth(JSON.parse(storedAuth))
      } catch (error) {
        console.error('Invalid auth data:', error)
        localStorage.removeItem('auth')
      }
    }
  }, [])


  // ----------------------------------------------------------
  // Load workers
  // ----------------------------------------------------------

  const searchWorkers = async (event) => {
    event?.preventDefault()

    setSearching(true)

    try {
      const response = await workerService.getAllWorkers()

      if (response.success) {
        setWorkers(response.data)
      } else {
        setWorkers([])
      }
    } catch (error) {
      console.error('Error loading workers:', error)

      setNotice({
        type: 'error',
        text: error.message,
      })
    } finally {
      setSearching(false)
    }
  }


  useEffect(() => {
    searchWorkers()
  }, [])


  // ----------------------------------------------------------
  // Login success
  // ----------------------------------------------------------

  const handleLoginSuccess = (authData) => {
    setAuth(authData)
    setAuthModeSafe(null)

    setNotice({
      type: 'success',
      text: 'Login successful! Welcome to SkillNet',
    })

    if (authData.role === 'WORKER') {
      setCurrentPage('worker-profile')
    } else {
      setCurrentPage('hr-dashboard')
    }
  }


  // ----------------------------------------------------------
  // Register success
  // ----------------------------------------------------------

  const handleRegisterSuccess = (authData) => {
    setAuth(authData)
    setAuthModeSafe(null)

    setNotice({
      type: 'success',
      text: 'Registration successful! Your profile is ready.',
    })

    if (authData.role === 'WORKER') {
      setCurrentPage('worker-profile')
    } else {
      setCurrentPage('hr-dashboard')
    }
  }


  // ----------------------------------------------------------
  // Logout
  // ----------------------------------------------------------

  const logout = () => {
    localStorage.removeItem('auth')

    setAuth(null)
    setCurrentPage('home')

    setNotice({
      type: 'success',
      text: 'You have been signed out.',
    })
  }


  // ----------------------------------------------------------
  // Helper
  // ----------------------------------------------------------
  // Login/Register pages are handled directly through currentPage.
  // This keeps the existing structure without the old duplicate
  // authentication component that caused the syntax error.

  const setAuthModeSafe = () => {
    // Intentionally empty.
    // Login/Register navigation is controlled by currentPage.
  }


  // ==========================================================
  // PUBLIC PAGES
  // ==========================================================

  if (!auth) {
    if (currentPage === 'login') {
      return (
        <Login
          onLoginSuccess={handleLoginSuccess}
        />
      )
    }

    if (currentPage === 'register') {
      return (
        <Register
          onRegisterSuccess={handleRegisterSuccess}
        />
      )
    }

    return (
      <HomePage
        onLoginClick={() => setCurrentPage('login')}
        onRegisterClick={() => setCurrentPage('register')}
        workers={workers}
        searching={searching}
        searchWorkers={searchWorkers}
        query={query}
        setQuery={setQuery}
        notice={notice}
        setNotice={setNotice}
      />
    )
  }


  // ==========================================================
  // WORKER PROFILE
  // ==========================================================

  if (
    currentPage === 'worker-profile' &&
    auth.role === 'WORKER'
  ) {
    return (
      <WorkerProfilePage
        auth={auth}
        onLogout={logout}
        onNavigate={setCurrentPage}
        setNotice={setNotice}
      />
    )
  }


  // ==========================================================
  // HR DASHBOARD
  // ==========================================================

  if (
    currentPage === 'hr-dashboard' &&
    auth.role === 'HR'
  ) {
    return (
      <HRDashboardPage
        auth={auth}
        onLogout={logout}
        onNavigate={setCurrentPage}
        setNotice={setNotice}
        notice={notice}
      />
    )
  }


  // ==========================================================
  // WORKER SEARCH
  // ==========================================================

  if (currentPage === 'worker-search') {
    return (
      <WorkerSearchPage
        auth={auth}
        onLogout={logout}
        onNavigate={setCurrentPage}
      />
    )
  }


  // ==========================================================
  // DEFAULT AUTHENTICATED HOME
  // ==========================================================

  return (
    <HomePage
      auth={auth}
      onLogout={logout}
      onLoginClick={() => setCurrentPage('login')}
      onRegisterClick={() => setCurrentPage('register')}
      onNavigate={setCurrentPage}
      workers={workers}
      searching={searching}
      searchWorkers={searchWorkers}
      query={query}
      setQuery={setQuery}
      notice={notice}
      setNotice={setNotice}
    />
  )
}


// ============================================================
// HOME PAGE
// ============================================================

function HomePage({
  auth,
  onLoginClick,
  onRegisterClick,
  onLogout,
  onNavigate,
  workers,
  searching,
  searchWorkers,
  query,
  setQuery,
  notice,
  setNotice,
}) {
  return (
    <div className="app-shell">

      <header className="topbar">

        <a
          className="brand"
          href="#top"
          aria-label="SkillNet home"
          onClick={() => onNavigate?.('home')}
        >
          <span className="brand-mark">
            <Sparkles size={18} />
          </span>

          <span>
            skill<span>net</span>
          </span>
        </a>


        <nav className="nav-links" aria-label="Main navigation">

          <a href="#discover">
            Discover talent
          </a>

          {auth && (
            <a
              href="#workspace"
              onClick={() =>
                onNavigate?.(
                  auth.role === 'HR'
                    ? 'hr-dashboard'
                    : 'worker-profile'
                )
              }
            >
              My workspace
            </a>
          )}

        </nav>


        <div className="nav-actions">

          {auth ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >

              <button
                className="profile-chip"
                onClick={() =>
                  onNavigate?.(
                    auth.role === 'HR'
                      ? 'hr-dashboard'
                      : 'worker-profile'
                  )
                }
              >
                <CircleUserRound size={17} />

                {auth.role === 'HR'
                  ? 'HR workspace'
                  : 'My profile'}

                <ChevronDown size={15} />
              </button>


              <button
                className="button button-dark button-small"
                onClick={onLogout}
              >
                <LogOut size={15} />
                Logout
              </button>

            </div>
          ) : (

            <button
              className="button button-dark button-small"
              onClick={onLoginClick}
            >
              Sign in
              <ArrowRight size={15} />
            </button>

          )}

        </div>

      </header>


      <main id="top">

        <section className="hero-section">

          <div className="hero-copy">

            <p className="eyebrow">
              <span className="eyebrow-dot" />
              Local work, done well
            </p>

            <h1>
              Good work starts
              <br />
              <em>with the right hands.</em>
            </h1>

            <p className="hero-lede">
              Connect with independent specialists who bring care,
              craft, and real experience to every job.
            </p>

            <a
              className="text-link"
              href="#discover"
            >
              Explore the network
              <ArrowRight size={17} />
            </a>

          </div>


          <div
            className="hero-art"
            aria-label="SkillNet network illustration"
          >

            <div className="sun-disc" />

            <div className="art-card art-card-main">
              <Wrench size={23} />
              <strong>Practical expertise</strong>
              <span>Close to home</span>
            </div>

            <div className="art-card art-card-note">
              <Check size={16} />
              Verified people
            </div>

            <div className="art-orbit orbit-one" />
            <div className="art-orbit orbit-two" />

            <span className="art-label label-one">
              01
            </span>

            <span className="art-label label-two">
              SKILL / TRUST
            </span>

          </div>

        </section>


        <section className="trust-strip">

          <div>
            <ShieldCheck size={18} />
            <span>
              Profiles built on real experience
            </span>
          </div>

          <div>
            <MapPin size={18} />
            <span>
              Find help in your neighbourhood
            </span>
          </div>

          <div>
            <BriefcaseBusiness size={18} />
            <span>
              Independent work, made visible
            </span>
          </div>

        </section>


        <section
          className="discover-section"
          id="discover"
        >

          <div className="section-heading">

            <div>

              <p className="eyebrow">
                The open network
              </p>

              <h2>
                Find someone
                <br />
                <em>who knows how.</em>
              </h2>

            </div>

            <p className="section-note">
              Search the live directory of available workers.
              Every profile is built by the person behind the work.
            </p>

          </div>


          <form
            className="search-panel"
            onSubmit={searchWorkers}
          >

            <div className="search-field">

              <Search size={19} />

              <input
                value={query.profession}
                onChange={(e) =>
                  setQuery({
                    ...query,
                    profession: e.target.value,
                  })
                }
                placeholder="What do you need done?"
              />

            </div>


            <div className="search-field">

              <MapPin size={19} />

              <input
                value={query.location}
                onChange={(e) =>
                  setQuery({
                    ...query,
                    location: e.target.value,
                  })
                }
                placeholder="Where? e.g. Colombo"
              />

            </div>


            <button
              className="button button-coral"
              type="submit"
              disabled={searching}
            >
              {searching
                ? 'Searching...'
                : 'Search workers'}

              <ArrowRight size={16} />

            </button>

          </form>


          <div className="directory-header">

            <span>
              {workers.length} available{' '}
              {workers.length === 1
                ? 'specialist'
                : 'specialists'}
            </span>

            <span className="live-indicator">
              <i />
              Live availability
            </span>

          </div>


          <div className="worker-grid">

            {workers.map((worker) => (
              <WorkerCard
                key={worker.profileId}
                worker={worker}
              />
            ))}


            {!searching &&
              workers.length === 0 && (
                <div className="empty-state">

                  <Compass size={25} />

                  <strong>
                    No workers found yet
                  </strong>

                  <span>
                    Be the first to join the network!
                  </span>

                </div>
              )}

          </div>

        </section>

      </main>


      <footer>

        <div className="brand">

          <span className="brand-mark">
            <Sparkles size={15} />
          </span>

          <span>
            skill<span>net</span>
          </span>

        </div>

        <span>
          Independent work, connected.
        </span>

        <span>
          © 2026 SkillNet
        </span>

      </footer>


      {notice && (
        <div className={`toast ${notice.type}`}>

          <span>
            {notice.type === 'success'
              ? <Check size={16} />
              : <X size={16} />}
          </span>

          {notice.text}

          <button
            onClick={() => setNotice(null)}
          >
            <X size={15} />
          </button>

        </div>
      )}


      {!auth && (
        <button
          className="floating-join"
          onClick={onRegisterClick}
        >
          <Sparkles size={16} />
          Join the network
        </button>
      )}

    </div>
  )
}


// ============================================================
// WORKER PROFILE PAGE
// ============================================================

function WorkerProfilePage({
  auth,
  onLogout,
  onNavigate,
}) {
  return (
    <div className="app-shell">

      <header className="topbar">

        <a
          className="brand"
          href="#top"
          onClick={() => onNavigate('home')}
        >
          <span className="brand-mark">
            <Sparkles size={18} />
          </span>

          <span>
            skill<span>net</span>
          </span>
        </a>


        <nav className="nav-links">

          <a
            href="#"
            onClick={() => onNavigate('home')}
          >
            Home
          </a>

          <a
            href="#"
            onClick={() => onNavigate('worker-search')}
          >
            Find Work
          </a>

        </nav>


        <div className="nav-actions">

          <button
            className="profile-chip"
            onClick={() => onNavigate('worker-profile')}
          >
            <CircleUserRound size={17} />
            My Profile
            <ChevronDown size={15} />
          </button>

          <button
            className="button button-small"
            onClick={onLogout}
          >
            <LogOut size={15} />
            Logout
          </button>

        </div>

      </header>


      <main id="top">

        <div
          className="workspace-section"
          id="workspace"
        >
          <WorkerProfile userId={auth.userId} />
        </div>

      </main>


      <footer>

        <div className="brand">

          <span className="brand-mark">
            <Sparkles size={15} />
          </span>

          <span>
            skill<span>net</span>
          </span>

        </div>

        <span>
          Independent work, connected.
        </span>

        <span>
          © 2026 SkillNet
        </span>

      </footer>

    </div>
  )
}


// ============================================================
// HR DASHBOARD
// ============================================================

function HRDashboardPage({
  auth,
  onLogout,
  onNavigate,
  setNotice,
  notice,
}) {

  const [vacancies, setVacancies] = useState([])

  const [vacancyForm, setVacancyForm] = useState({
    jobTitle: '',
    requiredSkills: '',
    minExperience: '',
    targetLocation: '',
  })

  const [postingVacancy, setPostingVacancy] =
    useState(false)

  const [roster, setRoster] = useState([])


  // ----------------------------------------------------------
  // Load worker roster
  // ----------------------------------------------------------

  const loadRoster = async () => {
    try {
      const data = await api(
        '/api/hr/workers',
        {}
      )

      setRoster(data)
    } catch (error) {
      console.error(
        'Error loading roster:',
        error
      )
    }
  }


  // ----------------------------------------------------------
  // Load vacancies
  // ----------------------------------------------------------

  const loadVacancies = async () => {
    try {
      const data = await vacancyApi.getAll()

      setVacancies(data)
    } catch (error) {
      console.error(
        'Failed to load vacancies:',
        error
      )
    }
  }


  // ----------------------------------------------------------
  // Create vacancy
  // ----------------------------------------------------------

  const handleCreateVacancy = async (e) => {
    e.preventDefault()

    setPostingVacancy(true)

    try {

      await vacancyApi.create({
        companyId: auth.userId || 1,
        jobTitle: vacancyForm.jobTitle,
        requiredSkills: vacancyForm.requiredSkills,
        minExperience: Number(
          vacancyForm.minExperience
        ),
        targetLocation:
          vacancyForm.targetLocation,
      })


      setVacancyForm({
        jobTitle: '',
        requiredSkills: '',
        minExperience: '',
        targetLocation: '',
      })


      setNotice({
        type: 'success',
        text: 'Job vacancy published successfully.',
      })


      await loadVacancies()

    } catch (error) {

      console.error(
        'Create vacancy error:',
        error
      )

      setNotice({
        type: 'error',
        text:
          'Could not create vacancy. Make sure vacancy-service is running on port 8082.',
      })

    } finally {

      setPostingVacancy(false)

    }
  }


  // ----------------------------------------------------------
  // Delete vacancy
  // ----------------------------------------------------------

  const handleDeleteVacancy = async (id) => {

    try {

      await vacancyApi.delete(id)

      setNotice({
        type: 'success',
        text: 'Vacancy deleted.',
      })

      await loadVacancies()

    } catch (error) {

      console.error(
        'Delete vacancy error:',
        error
      )

      setNotice({
        type: 'error',
        text: 'Failed to delete vacancy.',
      })

    }
  }


  // ----------------------------------------------------------
  // Load dashboard data
  // ----------------------------------------------------------

  useEffect(() => {
    loadRoster()
    loadVacancies()
  }, [])


  return (
    <div className="app-shell">

      <header className="topbar">

        <a
          className="brand"
          href="#top"
          onClick={() => onNavigate('home')}
        >

          <span className="brand-mark">
            <Sparkles size={18} />
          </span>

          <span>
            skill<span>net</span>
          </span>

        </a>


        <nav className="nav-links">

          <a
            href="#"
            onClick={() => onNavigate('home')}
          >
            Home
          </a>

          <a
            href="#"
            onClick={() =>
              onNavigate('worker-search')
            }
          >
            Find Workers
          </a>

        </nav>


        <div className="nav-actions">

          <button
            className="profile-chip"
            onClick={() =>
              onNavigate('hr-dashboard')
            }
          >
            <CircleUserRound size={17} />
            HR Dashboard
            <ChevronDown size={15} />
          </button>


          <button
            className="button button-small"
            onClick={onLogout}
          >
            <LogOut size={15} />
            Logout
          </button>

        </div>

      </header>


      <main id="top">

        <section
          className="workspace-section"
          id="workspace"
        >

          <div className="workspace-heading">

            <div>

              <p className="eyebrow">
                Private workspace
              </p>

              <h2>
                Corporate HR,{' '}
                <em>hiring hub.</em>
              </h2>

            </div>


            <button
              className="button button-quiet"
              onClick={onLogout}
            >
              <LogOut size={16} />
              Sign out
            </button>

          </div>


          <div
            className="hr-workspace"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem',
            }}
          >

            {/* HR PROFILE */}

            <HRProfile
              userId={auth.userId}
            />


            {/* JOB VACANCY MANAGEMENT */}

            <div
              className="profile-form"
              style={{
                maxWidth: '100%',
              }}
            >

              <div className="form-heading">

                <div>

                  <span className="number-label">
                    01 / RECRUITMENT
                  </span>

                  <h3>
                    Post a corporate vacancy
                  </h3>

                </div>


                <span className="saved-note">

                  <BriefcaseBusiness size={14} />

                  Microservice 2

                </span>

              </div>


              <form
                onSubmit={handleCreateVacancy}
              >

                <div className="form-grid">

                  <label>
                    Job title

                    <input
                      required
                      value={
                        vacancyForm.jobTitle
                      }
                      onChange={(e) =>
                        setVacancyForm({
                          ...vacancyForm,
                          jobTitle:
                            e.target.value,
                        })
                      }
                      placeholder="e.g. Senior Electrician"
                    />

                  </label>


                  <label>
                    Target location

                    <input
                      required
                      value={
                        vacancyForm.targetLocation
                      }
                      onChange={(e) =>
                        setVacancyForm({
                          ...vacancyForm,
                          targetLocation:
                            e.target.value,
                        })
                      }
                      placeholder="e.g. Colombo"
                    />

                  </label>


                  <label>
                    Minimum experience (Years)

                    <input
                      type="number"
                      min="0"
                      required
                      value={
                        vacancyForm.minExperience
                      }
                      onChange={(e) =>
                        setVacancyForm({
                          ...vacancyForm,
                          minExperience:
                            e.target.value,
                        })
                      }
                      placeholder="e.g. 2"
                    />

                  </label>


                  <label>
                    Required skills

                    <input
                      required
                      value={
                        vacancyForm.requiredSkills
                      }
                      onChange={(e) =>
                        setVacancyForm({
                          ...vacancyForm,
                          requiredSkills:
                            e.target.value,
                        })
                      }
                      placeholder="e.g. Wiring, Maintenance"
                    />

                  </label>

                </div>


                <button
                  className="button button-dark"
                  style={{
                    marginTop: '1rem',
                  }}
                  disabled={postingVacancy}
                >

                  {postingVacancy
                    ? 'Posting...'
                    : 'Create vacancy'}

                  <Plus size={16} />

                </button>

              </form>

            </div>


            {/* VACANCIES LIST */}

            <div className="roster-panel">

              <div className="roster-title">

                <div>

                  <span className="number-label">
                    ACTIVE VACANCIES
                  </span>

                  <h3>
                    Posted job openings
                  </h3>

                </div>


                <span className="roster-count">
                  {vacancies.length} active
                </span>

              </div>


              <div className="roster-list">

                {vacancies.map((v) => (

                  <div
                    className="roster-row"
                    key={v.vacancyId}
                    style={{
                      display: 'flex',
                      justifyContent:
                        'space-between',
                      alignItems: 'center',
                    }}
                  >

                    <div
                      style={{
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'center',
                      }}
                    >

                      <div className="avatar avatar-small">
                        <BriefcaseBusiness size={16} />
                      </div>


                      <div>

                        <strong>
                          {v.jobTitle}
                        </strong>

                        <span>
                          {v.targetLocation}
                          {' · '}
                          Min {v.minExperience} yrs exp
                          {' · '}
                          Skills: {v.requiredSkills}
                        </span>

                      </div>

                    </div>


                    <div
                      style={{
                        display: 'flex',
                        gap: '0.5rem',
                        alignItems: 'center',
                      }}
                    >

                      <button
                        className="button button-small button-quiet"
                        onClick={() =>
                          alert(
                            `Member 3 matching engine will load matches for Vacancy #${v.vacancyId}`
                          )
                        }
                      >
                        Find matches
                      </button>


                      <button
                        className="button button-small button-quiet"
                        style={{
                          color: '#ef4444',
                        }}
                        onClick={() =>
                          handleDeleteVacancy(
                            v.vacancyId
                          )
                        }
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>

                  </div>

                ))}


                {vacancies.length === 0 && (

                  <div className="empty-state">

                    <BriefcaseBusiness size={25} />

                    <strong>
                      No vacancies posted yet
                    </strong>

                    <span>
                      Create your first job vacancy
                      using the form above.
                    </span>

                  </div>

                )}

              </div>

            </div>


            {/* WORKER ROSTER */}

            <div className="roster-panel">

              <div className="roster-title">

                <div>

                  <span className="number-label">
                    REGISTERED WORKERS
                  </span>

                  <h3>
                    Member 1 directory
                  </h3>

                </div>


                <span className="roster-count">
                  {roster.length} profiles
                </span>

              </div>


              <div className="roster-list">

                {roster.map((worker) => (

                  <div
                    className="roster-row"
                    key={worker.id}
                  >

                    <div className="avatar avatar-small">

                      {worker.name
                        ?.split(' ')
                        .map(
                          (part) => part[0]
                        )
                        .slice(0, 2)
                        .join('')}

                    </div>


                    <div>

                      <strong>
                        {worker.name}
                      </strong>

                      <span>
                        {worker.profession ||
                          'Specialist'}

                        {' · '}

                        {worker.location ||
                          'No location'}
                      </span>

                    </div>


                    <span
                      className={`roster-status ${
                        worker.available
                          ? 'on'
                          : ''
                      }`}
                    >

                      <i />

                      {worker.available
                        ? 'Available'
                        : 'Offline'}

                    </span>

                  </div>

                ))}


                {roster.length === 0 && (

                  <div className="empty-state">

                    <UsersRound size={25} />

                    <strong>
                      No worker profiles yet
                    </strong>

                    <span>
                      Profiles will appear here
                      as workers join.
                    </span>

                  </div>

                )}

              </div>

            </div>

          </div>

        </section>

      </main>


      <footer>

        <div className="brand">

          <span className="brand-mark">
            <Sparkles size={15} />
          </span>

          <span>
            skill<span>net</span>
          </span>

        </div>

        <span>
          Independent work, connected.
        </span>

        <span>
          © 2026 SkillNet
        </span>

      </footer>


      {notice && (

        <div
          className={`toast ${notice.type}`}
        >

          <span>

            {notice.type === 'success'
              ? <Check size={16} />
              : <X size={16} />}

          </span>

          {notice.text}

          <button
            onClick={() => setNotice(null)}
          >
            <X size={15} />
          </button>

        </div>

      )}

    </div>
  )
}


// ============================================================
// WORKER SEARCH PAGE
// ============================================================

function WorkerSearchPage({
  auth,
  onLogout,
  onNavigate,
}) {
  return (
    <div className="app-shell">

      <header className="topbar">

        <a
          className="brand"
          href="#top"
          onClick={() => onNavigate('home')}
        >

          <span className="brand-mark">
            <Sparkles size={18} />
          </span>

          <span>
            skill<span>net</span>
          </span>

        </a>


        <nav className="nav-links">

          <a
            href="#"
            onClick={() => onNavigate('home')}
          >
            Home
          </a>


          {auth && (
            <a
              href="#"
              onClick={() =>
                onNavigate(
                  auth.role === 'HR'
                    ? 'hr-dashboard'
                    : 'worker-profile'
                )
              }
            >
              My Dashboard
            </a>
          )}

        </nav>


        <div className="nav-actions">

          <button
            className="button button-small"
            onClick={onLogout}
          >
            <LogOut size={15} />
            Logout
          </button>

        </div>

      </header>


      <main id="top">

        <WorkerSearch />

      </main>


      <footer>

        <div className="brand">

          <span className="brand-mark">
            <Sparkles size={15} />
          </span>

          <span>
            skill<span>net</span>
          </span>

        </div>

        <span>
          Independent work, connected.
        </span>

        <span>
          © 2026 SkillNet
        </span>

      </footer>

    </div>
  )
}


// ============================================================
// WORKER CARD
// ============================================================

function WorkerCard({ worker }) {

  const initials =
    `${worker.firstName?.charAt(0) || ''}${worker.lastName?.charAt(0) || ''}`
      .trim() || 'SN'


  return (
    <article className="worker-card">

      <div className="card-top">

        <div className="avatar">
          {initials}
        </div>


        {worker.isAvailable && (
          <span className="available-pill">
            <i />
            Available
          </span>
        )}

      </div>


      <h3>
        {worker.firstName} {worker.lastName}
      </h3>


      <p className="worker-role">
        {worker.profession ||
          'Independent specialist'}
      </p>


      <div className="worker-meta">

        <span>
          <MapPin size={14} />
          {worker.location ||
            'Location not listed'}
        </span>


        <span>
          <BriefcaseBusiness size={14} />
          {worker.yearsOfExperience ?? 0}
          {' '}
          years exp.
        </span>

      </div>


      <div className="card-footer">

        <span>
          Verified profile
        </span>

        <ShieldCheck size={16} />

      </div>

    </article>
  )
}


// ============================================================
// EXPORT
// ============================================================

export default App

