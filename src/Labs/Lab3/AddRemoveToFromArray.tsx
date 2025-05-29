export default function AddRemoveToFromArray() {
  let colors = ["red", "green", "blue"];
  colors.push("purple");
  colors = ["orange", ...colors, "pink"];

  return (
    <div>
      <h2>Add/Remove To/From Array</h2>
      <p>Colors: {colors.join(", ")}</p>
    </div>
  );
}