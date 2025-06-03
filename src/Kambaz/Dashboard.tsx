import { Link } from "react-router-dom";

export default function Dashboard({
  courses,
  course,
  setCourse,
  addNewCourse,
  deleteCourse,
  updateCourse,
}: {
  courses: any[];
  course: any;
  setCourse: (course: any) => void;
  addNewCourse: () => void;
  deleteCourse: (course: any) => void;
  updateCourse: () => void;
}) {
  return (
    <div 
      style={{ 
        marginLeft: '240px', // Account for navigation width
        padding: '30px',
        minHeight: '100vh',
        backgroundColor: '#f8f9fa'
      }}
    >
      <div className="container-fluid">
        <h1 id="wd-dashboard-title" className="mb-4">Dashboard</h1>
        
        {/* Course Editor Form */}
        <div className="row mb-5">
          <div className="col-lg-8">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Course Editor</h5>
                <div>
                  <button
                    className="btn btn-warning me-2"
                    onClick={updateCourse}
                    id="wd-update-course-click"
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-primary"
                    id="wd-add-new-course-click"
                    onClick={addNewCourse}
                  >
                    Add Course
                  </button>
                </div>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Course Name</label>
                      <input
                        value={course.name}
                        className="form-control"
                        onChange={(e) => setCourse({ ...course, name: e.target.value })}
                        placeholder="Course Name"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Course Number</label>
                      <input
                        value={course.number}
                        className="form-control"
                        onChange={(e) => setCourse({ ...course, number: e.target.value })}
                        placeholder="Course Number"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Start Date</label>
                      <input
                        value={course.startDate}
                        className="form-control"
                        type="date"
                        onChange={(e) => setCourse({ ...course, startDate: e.target.value })}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">End Date</label>
                      <input
                        value={course.endDate}
                        className="form-control"
                        type="date"
                        onChange={(e) => setCourse({ ...course, endDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        value={course.description}
                        className="form-control"
                        onChange={(e) => setCourse({ ...course, description: e.target.value })}
                        placeholder="Course Description"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <h2 id="wd-dashboard-published" className="mb-4">
          Published Courses ({courses.length})
        </h2>
        
        <div className="row" id="wd-dashboard-courses">
          {courses.map((courseItem) => (
            <div key={courseItem._id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
              <div className="card h-100 shadow-sm">
                <img
                  src={courseItem.image || "/images/reactjs.jpg"}
                  className="card-img-top"
                  alt="Course"
                  style={{ height: '160px', objectFit: 'cover' }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{courseItem.name}</h5>
                  <p className="card-text flex-grow-1" style={{ fontSize: '0.9rem' }}>
                    {courseItem.description}
                  </p>
                  <div className="mt-auto">
                    <Link
                      to={`/Kambaz/Courses/${courseItem._id}/Home`}
                      className="btn btn-primary btn-sm me-2"
                    >
                      Go
                    </Link>
                    <button
                      onClick={(event) => {
                        event.preventDefault();
                        setCourse(courseItem);
                      }}
                      className="btn btn-warning btn-sm me-2"
                      id="wd-edit-course-click"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(event) => {
                        event.preventDefault();
                        deleteCourse(courseItem._id);
                      }}
                      className="btn btn-danger btn-sm"
                      id="wd-delete-course-click"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
