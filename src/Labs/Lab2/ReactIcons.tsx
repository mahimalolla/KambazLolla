import { FaCalendar, FaEnvelopeOpenText, FaRegClock } from "react-icons/fa";
import { AiOutlineDashboard } from "react-icons/ai";
import { FaBookBible } from "react-icons/fa6";
import { VscAccount } from "react-icons/vsc";

export default function ReactIcons() {
  return (
    <div id="wd-react-icons">
      <h3>React Icons</h3>
      <p>React Icons library provides popular icon packs as React components.</p>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center', margin: '20px 0' }}>
        <div>📱 Phone</div>
        <div>🏠 Home</div>
        <div>⭐ Star</div>
        <div>💡 Idea</div>
        <div>🔥 Fire</div>
        <div>❤️ Heart</div>
      </div>
      
      <p>
        Head over to{' '}
        <a 
          href="https://react-icons.github.io/react-icons" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          https://react-icons.github.io/react-icons
        </a>{' '}
        to search for icons of interest. Search for icons by typing a topic in the search box. 
        Here are a few example searches found from several icon sources. Copyright
      </p>

      <div id="wd-react-icons-sampler" className="mb-4">
        <h3>React Icons Sampler</h3>
        <div className="d-flex">
          <VscAccount className="fs-3 text" />
          <AiOutlineDashboard className="fs-3 text" />
          <FaBookBible className="fs-3 text" />
          <FaCalendar className="fs-3 text" />
          <FaEnvelopeOpenText className="fs-3 text" />
          <FaRegClock className="fs-3 text" />
        </div>
      </div>
    </div>
  );
}