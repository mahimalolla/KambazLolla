export default function Details() {
  return (
    <div id="wd-course-details" className="mt-4">
      <h6>To Do</h6>
      <ul className="list-group mb-4">
        <li className="list-group-item">
          <i className="bi bi-exclamation-circle me-2"></i>
          Finish Lab 1 by Friday
        </li>
        <li className="list-group-item">
          <i className="bi bi-exclamation-circle me-2"></i>
          Submit Assignment 2
        </li>
      </ul>

      <h6>Course Resources</h6>
      <ul className="list-group">
        <li className="list-group-item">
          <i className="bi bi-camera-video me-2"></i>
          <a href="https://zoom.us/" target="_blank" rel="noreferrer">Zoom Meetings</a>
        </li>
        <li className="list-group-item">
          <i className="bi bi-chat-left-text me-2"></i>
          <a href="https://piazza.com" target="_blank" rel="noreferrer">Piazza Discussions</a>
        </li>
        <li className="list-group-item">
          <i className="bi bi-journal-check me-2"></i>
          <a href="#">View Grades</a>
        </li>
      </ul>
    </div>
  );
}
