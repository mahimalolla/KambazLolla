

export default function Flex() {
  return (
    <div id="wd-flex">
      <h3>Flexbox Layout</h3>
      
      <h4>Basic Flex Container</h4>
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        padding: '10px', 
        border: '2px solid #333',
        marginBottom: '20px'
      }}>
        <div style={{ flex: '1', backgroundColor: 'lightcoral', padding: '20px' }}>
          Flex Item 1
        </div>
        <div style={{ flex: '1', backgroundColor: 'lightblue', padding: '20px' }}>
          Flex Item 2
        </div>
        <div style={{ flex: '1', backgroundColor: 'lightgreen', padding: '20px' }}>
          Flex Item 3
        </div>
      </div>

      <h4>Justify Content: Space Between</h4>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        padding: '10px', 
        border: '2px solid #333',
        marginBottom: '20px'
      }}>
        <div style={{ backgroundColor: 'orange', padding: '15px' }}>Left</div>
        <div style={{ backgroundColor: 'purple', color: 'white', padding: '15px' }}>Center</div>
        <div style={{ backgroundColor: 'teal', color: 'white', padding: '15px' }}>Right</div>
      </div>

      <h4>Align Items: Center</h4>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        height: '100px',
        padding: '10px', 
        border: '2px solid #333',
        marginBottom: '20px'
      }}>
        <div style={{ backgroundColor: 'yellow', padding: '10px', height: '30px' }}>Short</div>
        <div style={{ backgroundColor: 'pink', padding: '10px', height: '60px' }}>Medium</div>
        <div style={{ backgroundColor: 'lightgray', padding: '10px', height: '40px' }}>Tall</div>
      </div>
    </div>
  );
}