export default function FixedPosition() {
  return (
    <div id="wd-css-position-fixed" style={{ position: 'relative' }}>
      <h2>Fixed position</h2>
      <div style={{
        position: 'absolute',
        right: '0px',
        top: '50px',
        width: '100px',
        height: '100px',
        backgroundColor: 'blue',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px'
      }}>
        Fixed position
      </div>
    </div>
  );
}