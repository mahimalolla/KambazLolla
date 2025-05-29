export default function RenderingArray() {
  const colors = ["Red", "Green", "Blue"];

  return (
    <div>
      <h2>Rendering Array</h2>
      <ul>
        {colors.map((color, i) => <li key={i}>{color}</li>)}
      </ul>
    </div>
  );
}