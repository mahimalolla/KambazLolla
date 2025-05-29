import Modules from "../Modules";
import Status from "./status";
import Details from "./details";

export default function Home() {
  return (
    <div className="d-flex">
      {/* Middle: Modules */}
      <div style={{ flex: 2, padding: "0 20px" }}>
        <Modules />
      </div>

      {/* Right: Course Status + Details */}
      <div style={{ flex: 1 }}>
        <Status />
        <Details />
      </div>
    </div>
  );
}
