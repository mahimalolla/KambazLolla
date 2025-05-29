
export default function MapFunction() {
  const numbers = [1, 2, 3, 4, 5];
  const squares = numbers.map(n => n * n);

  return (
    <div>
      <h2>Map Function</h2>
      <p>{squares.join(", ")}</p>
    </div>
  );
}