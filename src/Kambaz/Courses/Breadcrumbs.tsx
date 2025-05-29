import { useLocation } from "react-router-dom";

export default function Breadcrumbs() {
  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean).slice(1); // skip 'Kambaz'

  return (
    <div className="p-2 bg-light border-bottom mb-3">
      <small>
        <strong>Kambaz</strong>
        {pathParts.map((part, index) => (
          <span key={index}> &gt; {part}</span>
        ))}
      </small>
    </div>
  );
}
