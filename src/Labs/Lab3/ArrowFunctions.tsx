export default function ArrowFunctions() {
  const subtract = (a: number, b: number) => a - b;
  const multiply = (a: number, b: number) => {
    return a * b;
  };

  return (
    <div>
      <h2>Arrow Functions</h2>
      <p>subtract(5, 3) = {subtract(5, 3)}</p>
      <p>multiply(4, 2) = {multiply(4, 2)}</p>
    </div>
  );
}
