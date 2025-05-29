export default function FilterFunction() {
  const numbers = [1, 2, 3, 4, 5, 6];
  const evenNumbers = numbers.filter(n => n % 2 === 0);

  return (
    <div>
      <h2>Filter Function</h2>
      <p>Even numbers: {evenNumbers.join(", ")}</p>
    </div>
  );
}
