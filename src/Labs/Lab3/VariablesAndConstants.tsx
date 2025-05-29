export default function VariablesAndConstants() {
  let variable1 = 100;
  const constant1 = 200;
  variable1 = 300;

  return (
    <div>
      <h2>Variables and Constants</h2>
      <p>variable1: {variable1}</p>
      <p>constant1: {constant1}</p>
    </div>
  );
}