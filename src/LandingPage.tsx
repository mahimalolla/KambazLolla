import { useState, useEffect } from 'react';

// Hook for scroll animations
function useScrollAnimations() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}

// Testimonials Component
function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Product Manager",
      company: "Tech Solutions Inc.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      feedback: "Outstanding work! The website exceeded our expectations. Professional, responsive, and delivered on time. Highly recommend for any web development project."
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "CEO",
      company: "StartupXYZ",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      feedback: "Incredible attention to detail and technical expertise. The React application is fast, user-friendly, and exactly what we needed. Great communication throughout."
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Marketing Director", 
      company: "Digital Agency",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      feedback: "Professional service from start to finish. The website is beautiful, functional, and has significantly improved our online presence. Thank you!"
    }
  ];

  return (
    <section className="py-5 bg-light animate-on-scroll" id="testimonials">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold text-primary">What Clients Say</h2>
          <p className="lead text-muted">Trusted by businesses worldwide</p>
        </div>
        
        <div className="row g-4">
          {testimonials.map((testimonial, index) => (
            <div key={testimonial.id} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm border-0 testimonial-card">
                <div className="card-body p-4 text-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="rounded-circle mb-3"
                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                  />
                  
                  <div className="text-warning mb-3">
                    {'★'.repeat(5)}
                  </div>
                  
                  <blockquote className="blockquote mb-3">
                    <p className="text-muted">"{testimonial.feedback}"</p>
                  </blockquote>
                  
                  <div>
                    <h5 className="fw-bold text-primary mb-1">{testimonial.name}</h5>
                    <p className="text-muted small mb-0">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Blog Component  
function BlogSection() {
  const [selectedPost, setSelectedPost] = useState(null);
  
  const blogPosts = [
    {
      id: 1,
      title: "Building Modern React Applications",
      summary: "Learn the latest techniques for creating scalable and maintainable React applications with hooks, context, and modern patterns.",
      date: "March 15, 2024",
      category: "React",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
      content: "React has evolved significantly over the years. In this comprehensive guide, we'll explore modern React development practices including hooks, context API, and performance optimization techniques..."
    },
    {
      id: 2,
      title: "CSS Grid vs Flexbox: When to Use What",
      summary: "Understanding the differences between CSS Grid and Flexbox, and knowing when to use each layout system for optimal results.",
      date: "March 10, 2024", 
      category: "CSS",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
      content: "CSS Grid and Flexbox are both powerful layout systems, but they serve different purposes. Let's explore when and how to use each one effectively..."
    },
    {
      id: 3,
      title: "Node.js Best Practices for 2024",
      summary: "Essential Node.js practices for building robust backend applications, including security, performance, and code organization tips.",
      date: "March 5, 2024",
      category: "Node.js", 
      image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop",
      content: "Node.js continues to be a popular choice for backend development. Here are the most important best practices you should follow in 2024..."
    }
  ];

  if (selectedPost) {
    return (
      <section className="py-5">
        <div className="container">
          <button 
            className="btn btn-outline-primary mb-4"
            onClick={() => setSelectedPost(null)}
          >
            ← Back to Blog
          </button>
          
          <article className="row justify-content-center">
            <div className="col-lg-8">
              <img
                src={selectedPost.image}
                alt={selectedPost.title}
                className="img-fluid rounded mb-4"
              />
              
              <div className="mb-3">
                <span className="badge bg-primary me-2">{selectedPost.category}</span>
                <span className="text-muted">{selectedPost.date}</span>
              </div>
              
              <h1 className="display-5 fw-bold mb-4">{selectedPost.title}</h1>
              <p className="lead mb-4">{selectedPost.summary}</p>
              <p>{selectedPost.content}</p>
            </div>
          </article>
        </div>
      </section>
    );
  }

  return (
    <section className="py-5 animate-on-scroll" id="blog">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold text-primary">Latest Blog Posts</h2>
          <p className="lead text-muted">Insights and tutorials on web development</p>
        </div>
        
        <div className="row g-4">
          {blogPosts.map((post, index) => (
            <div key={post.id} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm border-0 blog-card">
                <img
                  src={post.image}
                  alt={post.title}
                  className="card-img-top"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="card-body d-flex flex-column">
                  <div className="mb-2">
                    <span className="badge bg-primary">{post.category}</span>
                  </div>
                  
                  <h5 className="card-title fw-bold">{post.title}</h5>
                  <p className="card-text text-muted flex-grow-1">{post.summary}</p>
                  
                  <div className="mt-auto">
                    <small className="text-muted d-block mb-2">{post.date}</small>
                    <button 
                      className="btn btn-outline-primary"
                      onClick={() => setSelectedPost(post)}
                    >
                      Read More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Portfolio Component
function PortfolioGallery() {
  const [selectedProject, setSelectedProject] = useState(null);
  
  const projects = [
    {
      id: 1,
      title: "Kambaz Learning Management System",
      description: "Full-stack LMS built with React, Redux, and Node.js. Features include user authentication, course management, assignments, and role-based access control.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&h=300&fit=crop",
      technologies: ["React", "Redux", "Node.js", "MongoDB"],
      liveUrl: "/Kambaz",
      category: "Full Stack"
    },
    {
      id: 2,
      title: "Weather Dashboard", 
      description: "Interactive weather application with location-based forecasts, charts, and responsive design using React and OpenWeather API.",
      image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=500&h=300&fit=crop",
      technologies: ["React", "Chart.js", "API Integration"],
      liveUrl: "#",
      category: "Frontend"
    },
    {
      id: 3,
      title: "Lab Exercises Platform",
      description: "Interactive learning platform with hands-on coding exercises, state management examples, and Redux implementations.",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500&h=300&fit=crop", 
      technologies: ["React", "JavaScript", "Bootstrap"],
      liveUrl: "/Labs",
      category: "Frontend"
    },
    {
      id: 4,
      title: "Portfolio Website",
      description: "Responsive portfolio website with modern design, smooth animations, and optimized performance.",
      image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=500&h=300&fit=crop",
      technologies: ["React", "CSS3", "Responsive Design"],
      liveUrl: "#", 
      category: "Frontend"
    },
    {
      id: 5,
      title: "E-Commerce Platform",
      description: "Complete e-commerce solution with product management, shopping cart, and secure payment processing.",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=300&fit=crop",
      technologies: ["React", "Node.js", "Stripe", "MongoDB"],
      liveUrl: "#",
      category: "Full Stack"
    }
  ];

  if (selectedProject) {
    return (
      <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{selectedProject.title}</h5>
              <button 
                className="btn-close"
                onClick={() => setSelectedProject(null)}
              ></button>
            </div>
            <div className="modal-body">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="img-fluid rounded mb-3"
              />
              <p>{selectedProject.description}</p>
              <div className="mb-3">
                <strong>Technologies:</strong>
                <div className="mt-2">
                  {selectedProject.technologies.map(tech => (
                    <span key={tech} className="badge bg-primary me-1">{tech}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setSelectedProject(null)}
              >
                Close
              </button>
              <a href="/Kambaz" className="btn btn-primary">
                View Project
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-5 bg-light animate-on-scroll" id="portfolio">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold text-primary">My Portfolio</h2>
          <p className="lead text-muted">Recent projects and work</p>
        </div>
        
        <div className="row g-4">
          {projects.map((project, index) => (
            <div key={project.id} className="col-md-6 col-lg-4">
              <div 
                className="card h-100 border-0 shadow-sm portfolio-card"
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedProject(project)}
              >
                <div className="position-relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="card-img-top portfolio-image"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <div className="portfolio-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                    <button className="btn btn-light">View Details</button>
                  </div>
                </div>
                <div className="card-body">
                  <h5 className="card-title fw-bold">{project.title}</h5>
                  <p className="card-text text-muted" style={{ fontSize: '0.9rem' }}>
                    {project.description.substring(0, 100)}...
                  </p>
                  <div>
                    {project.technologies.slice(0, 2).map(tech => (
                      <span key={tech} className="badge bg-light text-dark me-1 small">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Main Landing Page Component
export default function LandingPage() {
  useScrollAnimations();
  
  return (
    <div>
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
        <div className="container">
          <a className="navbar-brand fw-bold" href="/">
            Mahima Lolla
          </a>
          
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="#about">About</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#portfolio">Portfolio</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#services">Services</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#testimonials">Testimonials</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#blog">Blog</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#contact">Contact</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/Labs">Labs</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/Kambaz">Kambaz</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-5 bg-primary text-white min-vh-100 d-flex align-items-center animate-on-scroll" id="hero">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">
                Hi, I'm <span className="text-warning">Mahima Lolla</span>
              </h1>
              <p className="lead mb-4">
                Full Stack Web Developer specializing in React, Node.js, and modern web technologies. 
                Creating amazing digital experiences with clean code and innovative solutions.
              </p>
              <div className="d-flex gap-3">
                <a href="#portfolio" className="btn btn-warning btn-lg">View My Work</a>
                <a href="#contact" className="btn btn-outline-light btn-lg">Get In Touch</a>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="text-center">
                <div className="bg-warning rounded-circle d-inline-flex align-items-center justify-content-center" 
                     style={{ width: '200px', height: '200px' }}>
                  <span className="text-primary" style={{ fontSize: '4rem' }}>👩‍💻</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-5 animate-on-scroll" id="about">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <h2 className="display-5 fw-bold text-primary mb-4">About Me</h2>
              <p className="lead text-muted mb-4">
                I'm a passionate web developer with expertise in modern technologies like React, Redux, Node.js, and MongoDB. 
                I love creating user-friendly applications that solve real-world problems.
              </p>
              <div className="row g-4 mt-4">
                <div className="col-md-4">
                  <div className="text-center">
                    <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                         style={{ width: '60px', height: '60px' }}>
                      <span style={{ fontSize: '1.5rem' }}>🚀</span>
                    </div>
                    <h5>Frontend Expert</h5>
                    <p className="text-muted">React, TypeScript, Modern CSS</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="text-center">
                    <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                         style={{ width: '60px', height: '60px' }}>
                      <span style={{ fontSize: '1.5rem' }}>⚡</span>
                    </div>
                    <h5>Backend Power</h5>
                    <p className="text-muted">Node.js, Express, MongoDB</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="text-center">
                    <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                         style={{ width: '60px', height: '60px' }}>
                      <span style={{ fontSize: '1.5rem' }}>🛠️</span>
                    </div>
                    <h5>Full Stack</h5>
                    <p className="text-muted">Complete web solutions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section - Between About and Services */}
      <PortfolioGallery />

      {/* Services Section */}
      <section className="py-5 animate-on-scroll" id="services">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-primary">My Services</h2>
            <p className="lead text-muted">What I can do for you</p>
          </div>
          
          <div className="row g-4">
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm border-0 service-card">
                <div className="card-body text-center p-4">
                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{ width: '60px', height: '60px' }}>
                    <span style={{ fontSize: '1.5rem' }}>🌐</span>
                  </div>
                  <h5 className="fw-bold">Web Development</h5>
                  <p className="text-muted">Custom websites and web applications built with modern technologies</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm border-0 service-card">
                <div className="card-body text-center p-4">
                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{ width: '60px', height: '60px' }}>
                    <span style={{ fontSize: '1.5rem' }}>📱</span>
                  </div>
                  <h5 className="fw-bold">Responsive Design</h5>
                  <p className="text-muted">Mobile-first designs that work perfectly on all devices</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm border-0 service-card">
                <div className="card-body text-center p-4">
                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{ width: '60px', height: '60px' }}>
                    <span style={{ fontSize: '1.5rem' }}>⚙️</span>
                  </div>
                  <h5 className="fw-bold">API Integration</h5>
                  <p className="text-muted">Seamless integration with third-party services and APIs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - After Services */}
      <TestimonialsSection />

      {/* Blog Section - After Testimonials */}
      <BlogSection />

      {/* Contact Section */}
      <section className="py-5 bg-primary text-white animate-on-scroll" id="contact">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h2 className="display-5 fw-bold mb-4">Let's Work Together</h2>
              <p className="lead mb-4">
                Ready to bring your ideas to life? Let's discuss your project and create something amazing.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <button className="btn btn-warning btn-lg">Get In Touch</button>
                <a href="/Labs" className="btn btn-outline-light btn-lg">View Labs</a>
                <a href="/Kambaz" className="btn btn-outline-light btn-lg">Try Kambaz</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Styles */}
      <style jsx global>{`
        /* Navbar Hover Effects */
        .navbar-nav .nav-link {
          transition: all 0.3s ease;
          position: relative;
        }
        
        .navbar-nav .nav-link:hover {
          color: #ffc107 !important;
          transform: translateY(-2px);
        }
        
        .navbar-nav .nav-link::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: 0;
          left: 0;
          background-color: #ffc107;
          transition: width 0.3s ease;
        }
        
        .navbar-nav .nav-link:hover::after {
          width: 100%;
        }
        
        /* Button Animations */
        .btn {
          transition: all 0.3s ease;
        }
        
        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .btn:active {
          transform: translateY(0);
        }
        
        /* Scroll Animations */
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.6s ease;
        }
        
        .animate-on-scroll.animate-in {
          opacity: 1;
          transform: translateY(0);
        }
        
        /* Card Hover Effects */
        .card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        
        /* Portfolio Specific */
        .portfolio-card:hover .portfolio-image {
          transform: scale(1.05);
        }
        
        .portfolio-image {
          transition: transform 0.3s ease;
        }
        
        .portfolio-overlay {
          background: rgba(0,0,0,0.7);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .portfolio-card:hover .portfolio-overlay {
          opacity: 1;
        }
        
        /* Smooth Scrolling */
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}
