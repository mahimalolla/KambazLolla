import { useState, useEffect } from 'react';

export default function ScreenSizeLabel() {
  const [screenSize, setScreenSize] = useState('');
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      setScreenWidth(width);
      
      if (width < 576) {
        setScreenSize('XS - Extra Small');
      } else if (width < 768) {
        setScreenSize('SM - Small');
      } else if (width < 992) {
        setScreenSize('MD - Medium');
      } else if (width < 1200) {
        setScreenSize('LG - Large');
      } else if (width < 1400) {
        setScreenSize('XL - Extra Large');
      } else {
        setScreenSize('XXL - Extra Extra Large');
      }
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  return (
    <>
      {/* Fixed top-left indicator */}
      <div id="wd-screen-size-label">
        <div style={{ fontSize: '11px', fontWeight: 'bold' }}>
          {screenSize}
        </div>
        <div style={{ fontSize: '10px', opacity: 0.8 }}>
          {screenWidth}px
        </div>
      </div>

      {/* Detailed explanation section for the lab */}
      <div className="mt-4 p-3 bg-light border rounded">
        <h4>🔍 Screen Size Detection (Dynamic)</h4>
        <div className="alert alert-info d-flex align-items-center">
          <div className="me-3">
            <strong>Current:</strong> {screenSize} ({screenWidth}px)
          </div>
          <div className="ms-auto">
            <small>👆 Check top-left corner for live indicator</small>
          </div>
        </div>
        
        <p><strong>📏 Bootstrap Breakpoints:</strong></p>
        <div className="row">
          <div className="col-md-6">
            <ul className="list-unstyled">
              <li className={`p-2 rounded mb-1 ${screenWidth < 576 ? 'bg-primary text-white' : 'bg-light'}`}>
                <strong>XS:</strong> &lt; 576px (phones)
              </li>
              <li className={`p-2 rounded mb-1 ${screenWidth >= 576 && screenWidth < 768 ? 'bg-primary text-white' : 'bg-light'}`}>
                <strong>SM:</strong> ≥ 576px (large phones)
              </li>
              <li className={`p-2 rounded mb-1 ${screenWidth >= 768 && screenWidth < 992 ? 'bg-primary text-white' : 'bg-light'}`}>
                <strong>MD:</strong> ≥ 768px (tablets)
              </li>
            </ul>
          </div>
          <div className="col-md-6">
            <ul className="list-unstyled">
              <li className={`p-2 rounded mb-1 ${screenWidth >= 992 && screenWidth < 1200 ? 'bg-primary text-white' : 'bg-light'}`}>
                <strong>LG:</strong> ≥ 992px (desktops)
              </li>
              <li className={`p-2 rounded mb-1 ${screenWidth >= 1200 && screenWidth < 1400 ? 'bg-primary text-white' : 'bg-light'}`}>
                <strong>XL:</strong> ≥ 1200px (large desktops)
              </li>
              <li className={`p-2 rounded mb-1 ${screenWidth >= 1400 ? 'bg-primary text-white' : 'bg-light'}`}>
                <strong>XXL:</strong> ≥ 1400px (extra large)
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-3 p-2 bg-warning text-dark rounded">
          <strong>🔄 Try This:</strong> Resize your browser window and watch the navigation components change layout!
        </div>
      </div>
    </>
  );
}
