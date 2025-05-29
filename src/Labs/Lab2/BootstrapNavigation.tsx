export default function BootstrapNavigation() {
  return (
    <div id="wd-bootstrap-navigation" className="mt-5">
      <h2>Bootstrap Navigation</h2>
      
      <h3>Basic Navigation</h3>
      <nav className="nav mb-4">
        <a className="nav-link text-primary" href="#home">Home</a>
        <a className="nav-link text-primary" href="#about">About</a>
        <a className="nav-link text-primary" href="#services">Services</a>
        <a className="nav-link text-primary" href="#contact">Contact</a>
      </nav>

      <h3>Pills Navigation</h3>
      <ul className="nav nav-pills mb-4">
        <li className="nav-item">
          <a className="nav-link active" href="#dashboard">Dashboard</a>
        </li>
        <li className="nav-item">
          <a className="nav-link text-primary" href="#profile">Profile</a>
        </li>
        <li className="nav-item">
          <a className="nav-link text-primary" href="#messages">Messages</a>
        </li>
        <li className="nav-item">
          <a className="nav-link disabled text-muted" href="#disabled">Disabled</a>
        </li>
      </ul>

      <h3>Tabs Navigation</h3>
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <a className="nav-link active" href="#tab1">Active Tab</a>
        </li>
        <li className="nav-item">
          <a className="nav-link text-primary" href="#tab2">Link</a>
        </li>
        <li className="nav-item">
          <a className="nav-link text-primary" href="#tab3">Another Link</a>
        </li>
        <li className="nav-item">
          <a className="nav-link disabled text-muted" href="#tab4">Disabled</a>
        </li>
      </ul>

      <h3>Navbar</h3>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div className="container-fluid">
          <a className="navbar-brand" href="#brand">Brand</a>
          <button className="navbar-toggler" type="button">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="navbar-nav ms-auto">
            <a className="nav-link text-white" href="#nav-home">Home</a>
            <a className="nav-link text-muted" href="#nav-features">Features</a>
            <a className="nav-link text-muted" href="#nav-pricing">Pricing</a>
          </div>
        </div>
      </nav>

    </div>
  );
}