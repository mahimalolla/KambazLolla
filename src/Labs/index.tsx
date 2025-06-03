import { Routes, Route, Link, Navigate } from "react-router-dom";
import Lab1 from "./Lab1";
import Lab2 from "./Lab2";
import Lab3 from "./Lab3";
import Lab4 from "./Lab4";
import store from "./store";
import { Provider } from "react-redux";

export default function Labs() {
  return (
    <Provider store={store}>
      <div>
        <h2>Labs</h2>
        <ul>
          <li><Link to="/Labs/Lab1">Lab 1</Link></li>
          <li><Link to="/Labs/Lab2">Lab 2</Link></li>
          <li><Link to="/Labs/Lab3">Lab 3</Link></li>
          <li><Link to="/Labs/Lab4">Lab 4</Link></li>
          <li><Link to="/Kambaz">Kambaz</Link></li>
          <li>
            <a
              id="wd-github"
              href="https://github.com/mahimalolla/kambaz-react-web-app-lolla"
              target="_blank"
              rel="noreferrer"
            >
              GitHub Repository
            </a>
          </li>
        </ul>

        <Routes>
          <Route path="/" element={<Navigate to="Lab1" />} />
          <Route path="Lab1" element={<Lab1 />} />
          <Route path="Lab2" element={<Lab2 />} />
          <Route path="Lab3" element={<Lab3 />} />
          <Route path="Lab4" element={<Lab4 />} />
        </Routes>
      </div>
    </Provider>
  );
}
