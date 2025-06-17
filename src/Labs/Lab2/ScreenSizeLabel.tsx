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
    // Only the fixed top-left indicator - no explanation boxes
    <div id="wd-screen-size-label">
      <div style={{ fontSize: '11px', fontWeight: 'bold' }}>
        {screenSize}
      </div>
      <div style={{ fontSize: '10px', opacity: 0.8 }}>
        {screenWidth}px
      </div>
    </div>
  );
}
