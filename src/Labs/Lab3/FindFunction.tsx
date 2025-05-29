export default function FindFunction() {
  const numbers = [1, 3, 5, 7, 9];
  const found = numbers.find(n => n > 4);

  return (
    <div>
      <h2>Find Function</h2>
      <p>First number greater than 4: {found}</p>
    </div>
  );
}
