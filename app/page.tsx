import ShipmentsTable from "./shipments-table";


export default function Home() {
 
  return (
    <main className="dashboard">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">P</div>
          <div>
            <h2>pulse</h2>
            <p>OPERATIONS</p>
          </div>
        </div>

        <p className="nav-label">WORKSPACE</p>

      <nav className="navigation">
  <a className="nav-item active" href="/">
    <span>▦</span> Overview
  </a>

  <a className="nav-item" href="#shipments">
    <span>⇄</span> Shipments
  </a>

  <a className="nav-item" href="/exceptions">
    <span>⚠</span> Exception Queue
    <span className="nav-count">8</span>
  </a>

  <a className="nav-item" href="/carriers">
    <span>▤</span> Carriers
  </a>

  <a className="nav-item" href="/analytics">
    <span>▥</span> Analytics
  </a>
</nav>

        <div className="sidebar-bottom">
          <div className="profile-avatar">FH</div>
          <div className="profile-info">
            <strong>Operations Team</strong>
            <span>Administrator</span>
          </div>
          <span className="profile-menu">···</span>
        </div>
      </aside>

      <section className="main-content" id="overview">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span>/</span> Overview
          </div>

          <div className="topbar-right">
            <span className="live-indicator">
              <span></span> System operational
            </span>
            <button className="icon-button" aria-label="Notifications">
              ♧
            </button>
            <div className="top-avatar">FH</div>
          </div>
        </header>

        <div className="page-content">
          <div className="page-heading">
            <div>
              <p className="eyebrow">SATURDAY, OCTOBER 17, 2026</p>
              <h1>Operations overview</h1>
              <p className="subtitle">
                Here&apos;s what&apos;s happening across your supply chain today.
              </p>
            </div>

            <button className="primary-button" type="button">
              + Create shipment
            </button>
          </div>

          <div className="stats-grid">
            <article className="stat-card">
              <div className="stat-top">
                <span>Total shipments</span>
                <span className="stat-icon purple">⇄</span>
              </div>
              <h2>1,284</h2>
              <p className="stat-note">
                <span className="positive">↗ 12.8%</span> vs. last week
              </p>
              <div className="mini-bars">
                {[30, 45, 36, 60, 43, 70, 53, 85, 60, 74, 90, 66].map(
                  (height, index) => (
                    <span key={index} style={{ height: `${height}%` }} />
                  ),
                )}
              </div>
            </article>

            <article className="stat-card">
              <div className="stat-top">
                <span>In transit</span>
                <span className="stat-icon blue">↗</span>
              </div>
              <h2>486</h2>
              <p className="stat-note">
                <span className="positive">↗ 8.2%</span> vs. last week
              </p>
              <div className="progress-track">
                <div className="progress-fill blue-fill" style={{ width: "68%" }} />
              </div>
              <p className="progress-caption">68% of active shipments</p>
            </article>

            <article className="stat-card">
              <div className="stat-top">
                <span>Delivered on time</span>
                <span className="stat-icon green">✓</span>
              </div>
              <h2>96.8%</h2>
              <p className="stat-note">
                <span className="positive">↗ 2.4%</span> vs. last week
              </p>
              <div className="progress-track">
                <div className="progress-fill green-fill" style={{ width: "96.8%" }} />
              </div>
              <p className="progress-caption">Target: 95%</p>
            </article>

            <article className="stat-card">
              <div className="stat-top">
                <span>Open exceptions</span>
                <span className="stat-icon orange">!</span>
              </div>
              <h2>08</h2>
              <p className="stat-note">
                <span className="negative">3 critical</span> need attention
              </p>
              <div className="exception-summary">
                <span className="exception-dot"></span>
                <span>2 delayed</span>
                <span className="exception-dot second"></span>
                <span>3 damaged</span>
              </div>
            </article>
          </div>

         <ShipmentsTable />

          <footer className="page-footer">
            <span>Pulse Operations Dashboard</span>
            <span>Last synced just now · All systems normal</span>
          </footer>
        </div>
      </section>
    </main>
  );
}
