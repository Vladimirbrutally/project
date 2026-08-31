export function Navbar() {
  return (
    <nav className="navbar" aria-label="Main navigation">
      <a className="brand" href="#top" aria-label="3D Print Calculator home">
        <span className="brand-mark">3D</span>
        <span>Print Calculator</span>
      </a>
      <div className="nav-links">
        <a href="#calculator">Price Calculator</a>
        <a href="#/admin">Admin</a>
      </div>
    </nav>
  );
}
