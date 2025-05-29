export default function ArrayIndexAndLength() {
  const colors = ["red", "green", "blue"];

  return (
    <div>
      <h2>Array Index and Length</h2>
      <p>First color: {colors[0]}</p>
      <p>Second color: {colors[1]}</p>
      <p>Number of colors: {colors.length}</p>
    </div>
  );
}