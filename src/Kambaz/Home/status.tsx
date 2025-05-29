export default function Status() {
  return (
    <div id="wd-course-status" className="p-2 border rounded">
      <h6>Course Status</h6>
      <div className="d-flex gap-2 mb-2">
        <button className="btn btn-light border">
          <i className="bi bi-x-circle me-1"></i>
          Unpublish
        </button>
        <button className="btn btn-success text-white">
          <i className="bi bi-check-circle me-1"></i>
          Published
        </button>
      </div>

      <ul className="list-group">
        <li className="list-group-item">
          <i className="bi bi-upload me-2"></i>
          Import Existing Content
        </li>
        <li className="list-group-item">
          <i className="bi bi-box-arrow-in-down me-2"></i>
          Import from Commons
        </li>
        <li className="list-group-item">
          <i className="bi bi-building me-2"></i>
          Choose Home Page
        </li>
        <li className="list-group-item">
          <i className="bi bi-bar-chart-line me-2"></i>
          View Course Stream
        </li>
        <li className="list-group-item">
          <i className="bi bi-bell me-2"></i>
          Course Notifications
        </li>
      </ul>
    </div>
  );
}
