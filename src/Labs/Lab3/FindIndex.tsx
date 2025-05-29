export default function FindIndex() {
  const numbers = [10, 20, 30, 40];
  const index = numbers.findIndex(n => n === 30);

  return (
    <div>
      <h2>Find Index</h2>
      <p>Index of 30: {index}</p>
    </div>
  );
}