import { useParams } from "react-router-dom";

export default function PathParameters() {
  const { id } = useParams();

  return (
    <div>
      <h2>Path Parameters</h2>
      <p>ID from URL: {id}</p>
    </div>
  );
}
