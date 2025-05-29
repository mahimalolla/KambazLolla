export default function Positions() {
  return (
    <div id="wd-positions" style={{ marginTop: '40px' }}>
      <h3>CSS Positions</h3>
      
      <h4>Relative Positioning</h4>
      <div style={{ position: 'relative', height: '150px', border: '2px solid #333', padding: '10px' }}>
        <div style={{ 
          position: 'relative', 
          top: '20px', 
          left: '30px',
          width: '100px',
          height: '50px',
          backgroundColor: 'lightblue',
          border: '1px solid blue',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          Relative
        </div>
        <p>This box is positioned relative to its normal position.</p>
      </div>

      <h4>Absolute Positioning</h4>
      <div style={{ position: 'relative', height: '150px', border: '2px solid #333', padding: '10px', marginTop: '20px' }}>
        <div style={{ 
          position: 'absolute', 
          top: '30px', 
          right: '20px',
          width: '100px',
          height: '50px',
          backgroundColor: 'lightcoral',
          border: '1px solid red',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          Absolute
        </div>
        <p>This box is positioned absolutely within its relative parent.</p>
      </div>

      <h4>Fixed Positioning</h4>
      <p>Fixed elements stick to the viewport. Check the blue square that appears after the margins section!</p>
    </div>
  );
}