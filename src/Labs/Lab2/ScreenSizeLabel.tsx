import { useState, useEffect } from 'react';

export default function ScreenSizeLabel() {
  const [screenSize, setScreenSize] = useState('');

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      if (width < 576) {
        setScreenSize('XS');
      } else if (width < 768) {
        setScreenSize('SM');
      } else if (width < 992) {
        setScreenSize('MD');
      } else if (width < 1200) {
        setScreenSize('LG');
      } else {
        setScreenSize('XL+');
      }
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  return (
    <div id="wd-screen-size-label">
      <h3>Screen Size Detection</h3>
      <div style={{
        display: 'inline-block',
        backgroundColor: '#343a40',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '4px',
        fontWeight: 'bold',
        marginBottom: '10px'
      }}>
        Current Screen Size: {screenSize}
      </div>
      <p>Resize your browser window to see the screen size change!</p>
      <ul>
        <li><strong>XS:</strong> Extra Small (&lt; 576px)</li>
        <li><strong>SM:</strong> Small (≥ 576px)</li>
        <li><strong>MD:</strong> Medium (≥ 768px)</li>
        <li><strong>LG:</strong> Large (≥ 992px)</li>
        <li><strong>XL+:</strong> Extra Large (≥ 1200px)</li>
      </ul>
    </div>
  );
}