export default function ForLoops() {
  let numbers = "";
  for (let i = 1; i <= 5; i++) {
    numbers += i + " ";
  }

  return (
    <div>
      <h2>For Loops</h2>
      <p>{numbers.trim()}</p>
    </div>
  );
}