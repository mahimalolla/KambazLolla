
export default function Dimensions() {
  return (
    <div id="wd-dimensions">
      <h3>Dimensions</h3>
      
      <h4>Fixed Dimensions</h4>
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <div style={{ 
          width: '200px', 
          height: '100px', 
          backgroundColor: 'lightblue',
          border: '2px solid blue',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          200px × 100px
        </div>
        <div style={{ 
          width: '150px', 
          height: '150px', 
          backgroundColor: 'lightgreen',
          border: '2px solid green',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          150px × 150px
        </div>
      </div>

      <h4>Percentage Dimensions</h4>
      <div style={{ border: '2px solid #333', padding: '10px', marginBottom: '30px' }}>
        <div style={{ 
          width: '50%', 
          height: '80px', 
          backgroundColor: 'lightyellow',
          border: '2px solid orange',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '10px'
        }}>
          50% width
        </div>
        <div style={{ 
          width: '75%', 
          height: '60px', 
          backgroundColor: 'lightcoral',
          border: '2px solid red',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          75% width
        </div>
      </div>

      <h4>Min/Max Dimensions</h4>
      <div style={{ 
        minWidth: '200px',
        maxWidth: '400px',
        minHeight: '100px',
        backgroundColor: 'lightgray',
        border: '2px solid gray',
        padding: '15px',
        resize: 'both',
        overflow: 'auto'
      }}>
        This box has min-width: 200px, max-width: 400px, min-height: 100px. 
        Try resizing your browser window!
      </div>
    </div>
  );
}