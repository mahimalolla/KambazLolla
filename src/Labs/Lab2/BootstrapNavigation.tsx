import { Nav, Navbar, Container } from "react-bootstrap";
import { useState } from "react";

export default function BootstrapNavigation() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div id="wd-bootstrap-navigation" className="mt-5">
      <h2>Bootstrap Navigation</h2>
      
      {/* Basic Navigation - Responsive */}
      <h3>Basic Navigation (Responsive)</h3>
      <Nav className="mb-4 flex-column flex-sm-row">
        <Nav.Link href="#home" className="text-primary me-sm-3 mb-2 mb-sm-0">Home</Nav.Link>
        <Nav.Link href="#about" className="text-primary me-sm-3 mb-2 mb-sm-0">About</Nav.Link>
        <Nav.Link href="#services" className="text-primary me-sm-3 mb-2 mb-sm-0">Services</Nav.Link>
        <Nav.Link href="#contact" className="text-primary">Contact</Nav.Link>
      </Nav>

      {/* Pills Navigation - Responsive */}
      <h3>Pills Navigation (Adaptive Layout)</h3>
      <Nav variant="pills" className="mb-4 flex-column flex-md-row">
        <Nav.Item className="mb-2 mb-md-0 me-md-2">
          <Nav.Link active>Dashboard</Nav.Link>
        </Nav.Item>
        <Nav.Item className="mb-2 mb-md-0 me-md-2">
          <Nav.Link href="#profile" className="text-primary">Profile</Nav.Link>
        </Nav.Item>
        <Nav.Item className="mb-2 mb-md-0 me-md-2">
          <Nav.Link href="#messages" className="text-primary">Messages</Nav.Link>
        </Nav.Item>
        <Nav.Item className="mb-2 mb-md-0">
          <Nav.Link disabled className="text-muted">Disabled</Nav.Link>
        </Nav.Item>
      </Nav>

      {/* Tabs Navigation - Responsive */}
      <h3>Tabs Navigation (Wrapping)</h3>
      <Nav variant="tabs" className="mb-4 flex-wrap">
        <Nav.Item>
          <Nav.Link active>Active Tab</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="#tab2" className="text-primary">Link</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="#tab3" className="text-primary">Another Link</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link disabled className="text-muted">Disabled</Nav.Link>
        </Nav.Item>
      </Nav>

      {/* Fully Responsive Navbar with Collapse */}
      <h3>Responsive Navbar (Collapsible)</h3>
      <Navbar 
        bg="dark" 
        variant="dark" 
        expand="lg" 
        expanded={expanded}
        onToggle={setExpanded}
        className="mb-4"
      >
        <Container fluid>
          <Navbar.Brand href="#brand">Brand</Navbar.Brand>
          <Navbar.Toggle 
            aria-controls="basic-navbar-nav"
            onClick={() => setExpanded(!expanded)}
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="#nav-home" className="text-white">Home</Nav.Link>
              <Nav.Link href="#nav-features" className="text-muted">Features</Nav.Link>
              <Nav.Link href="#nav-pricing" className="text-muted">Pricing</Nav.Link>
              <Nav.Link href="#nav-about" className="text-muted">About</Nav.Link>
              <Nav.Link href="#nav-contact" className="text-muted">Contact</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Screen Size Dependent Navigation */}
      <h3>Screen Size Dependent Navigation</h3>
      <div className="mb-4">
        {/* Show different navigation based on screen size */}
        <div className="d-block d-md-none">
          {/* Mobile Navigation - Vertical Stack */}
          <div className="bg-light p-3 rounded">
            <h6>Mobile Navigation (Vertical)</h6>
            <Nav className="flex-column">
              <Nav.Link href="#m-home" className="text-primary py-2 border-bottom">🏠 Home</Nav.Link>
              <Nav.Link href="#m-menu" className="text-primary py-2 border-bottom">📱 Menu</Nav.Link>
              <Nav.Link href="#m-search" className="text-primary py-2 border-bottom">🔍 Search</Nav.Link>
              <Nav.Link href="#m-profile" className="text-primary py-2">👤 Profile</Nav.Link>
            </Nav>
          </div>
        </div>

        <div className="d-none d-md-block d-xl-none">
          {/* Tablet Navigation - Horizontal with wrapping */}
          <div className="bg-info p-3 rounded text-white">
            <h6>Tablet Navigation (Medium Screens)</h6>
            <Nav className="flex-row flex-wrap">
              <Nav.Link href="#t-home" className="text-white me-3 mb-2">Home</Nav.Link>
              <Nav.Link href="#t-products" className="text-white me-3 mb-2">Products</Nav.Link>
              <Nav.Link href="#t-services" className="text-white me-3 mb-2">Services</Nav.Link>
              <Nav.Link href="#t-about" className="text-white me-3 mb-2">About</Nav.Link>
              <Nav.Link href="#t-contact" className="text-white mb-2">Contact</Nav.Link>
            </Nav>
          </div>
        </div>

        <div className="d-none d-xl-block">
          {/* Desktop Navigation - Full horizontal */}
          <div className="bg-success p-3 rounded text-white">
            <h6>Desktop Navigation (Large Screens)</h6>
            <Nav className="justify-content-between">
              <div className="d-flex">
                <Nav.Link href="#d-home" className="text-white me-4">🏠 Home</Nav.Link>
                <Nav.Link href="#d-products" className="text-white me-4">📦 Products</Nav.Link>
                <Nav.Link href="#d-services" className="text-white me-4">🛠️ Services</Nav.Link>
                <Nav.Link href="#d-about" className="text-white me-4">ℹ️ About</Nav.Link>
              </div>
              <div className="d-flex">
                <Nav.Link href="#d-search" className="text-white me-3">🔍 Search</Nav.Link>
                <Nav.Link href="#d-login" className="text-white me-3">🔐 Login</Nav.Link>
                <Nav.Link href="#d-cart" className="text-white">🛒 Cart</Nav.Link>
              </div>
            </Nav>
          </div>
        </div>
      </div>

      {/* Justified Navigation that adapts */}
      <h3>Justified Responsive Navigation</h3>
      <Nav variant="pills" className="nav-justified mb-4 flex-column flex-lg-row">
        <Nav.Item className="mb-2 mb-lg-0">
          <Nav.Link href="#j-dashboard" className="text-primary">Dashboard</Nav.Link>
        </Nav.Item>
        <Nav.Item className="mb-2 mb-lg-0">
          <Nav.Link href="#j-analytics" className="text-primary">Analytics</Nav.Link>
        </Nav.Item>
        <Nav.Item className="mb-2 mb-lg-0">
          <Nav.Link href="#j-reports" className="text-primary">Reports</Nav.Link>
        </Nav.Item>
        <Nav.Item className="mb-2 mb-lg-0">
          <Nav.Link href="#j-settings" className="text-primary">Settings</Nav.Link>
        </Nav.Item>
      </Nav>

      {/* Instructions */}
      <div className="alert alert-info">
        <h6>🔄 Dynamic Behavior:</h6>
        <ul className="mb-0">
          <li><strong>Resize your browser</strong> to see navigation layouts change</li>
          <li><strong>Mobile (&lt;768px):</strong> Vertical stacking, hamburger menus</li>
          <li><strong>Tablet (768px-1200px):</strong> Horizontal with wrapping</li>
          <li><strong>Desktop (&gt;1200px):</strong> Full horizontal layouts</li>
          <li><strong>Navbar:</strong> Click hamburger menu on small screens</li>
        </ul>
      </div>
    </div>
  );
}
