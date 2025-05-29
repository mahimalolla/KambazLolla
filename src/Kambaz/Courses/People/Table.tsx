import { Table } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";

export default function PeopleTable() {
  return (
    <div id="wd-people-table">
      <Table 
        striped 
        bordered 
        hover 
        responsive
        style={{ border: '1px solid #dee2e6' }}
      >
        <thead style={{ backgroundColor: '#212529', color: 'white' }}>
          <tr>
            <th style={{ border: '1px solid #dee2e6', padding: '12px' }}>Name</th>
            <th style={{ border: '1px solid #dee2e6', padding: '12px' }}>Login ID</th>
            <th style={{ border: '1px solid #dee2e6', padding: '12px' }}>Section</th>
            <th style={{ border: '1px solid #dee2e6', padding: '12px' }}>Role</th>
            <th style={{ border: '1px solid #dee2e6', padding: '12px' }}>Last Activity</th>
            <th style={{ border: '1px solid #dee2e6', padding: '12px' }}>Total Activity</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ backgroundColor: '#f8f9fa' }}>
            <td className="wd-full-name text-nowrap" style={{ border: '1px solid #dee2e6', padding: '12px' }}>
              <FaUserCircle className="me-2 fs-1 text-secondary" />
              <span className="wd-first-name">Tony</span>{" "}
              <span className="wd-last-name">Stark</span>
            </td>
            <td className="wd-login-id" style={{ border: '1px solid #dee2e6', padding: '12px' }}>001234561S</td>
            <td className="wd-section" style={{ border: '1px solid #dee2e6', padding: '12px' }}>S101</td>
            <td className="wd-role" style={{ border: '1px solid #dee2e6', padding: '12px' }}>STUDENT</td>
            <td className="wd-last-activity" style={{ border: '1px solid #dee2e6', padding: '12px' }}>2020-10-01T00:00:00.000Z</td>
            <td className="wd-total-activity" style={{ border: '1px solid #dee2e6', padding: '12px' }}>10:21:32</td>
          </tr>
          
          <tr>
            <td className="wd-full-name text-nowrap" style={{ border: '1px solid #dee2e6', padding: '12px' }}>
              <FaUserCircle className="me-2 fs-1 text-secondary" />
              <span className="wd-first-name">Bruce</span>{" "}
              <span className="wd-last-name">Wayne</span>
            </td>
            <td className="wd-login-id" style={{ border: '1px solid #dee2e6', padding: '12px' }}>001234562S</td>
            <td className="wd-section" style={{ border: '1px solid #dee2e6', padding: '12px' }}>S101</td>
            <td className="wd-role" style={{ border: '1px solid #dee2e6', padding: '12px' }}>STUDENT</td>
            <td className="wd-last-activity" style={{ border: '1px solid #dee2e6', padding: '12px' }}>2020-11-02T00:00:00.000Z</td>
            <td className="wd-total-activity" style={{ border: '1px solid #dee2e6', padding: '12px' }}>15:32:43</td>
          </tr>
          
          <tr style={{ backgroundColor: '#f8f9fa' }}>
            <td className="wd-full-name text-nowrap" style={{ border: '1px solid #dee2e6', padding: '12px' }}>
              <FaUserCircle className="me-2 fs-1 text-secondary" />
              <span className="wd-first-name">Steve</span>{" "}
              <span className="wd-last-name">Rogers</span>
            </td>
            <td className="wd-login-id" style={{ border: '1px solid #dee2e6', padding: '12px' }}>001234563S</td>
            <td className="wd-section" style={{ border: '1px solid #dee2e6', padding: '12px' }}>S101</td>
            <td className="wd-role" style={{ border: '1px solid #dee2e6', padding: '12px' }}>STUDENT</td>
            <td className="wd-last-activity" style={{ border: '1px solid #dee2e6', padding: '12px' }}>2020-10-02T00:00:00.000Z</td>
            <td className="wd-total-activity" style={{ border: '1px solid #dee2e6', padding: '12px' }}>23:32:43</td>
          </tr>
          
          <tr>
            <td className="wd-full-name text-nowrap" style={{ border: '1px solid #dee2e6', padding: '12px' }}>
              <FaUserCircle className="me-2 fs-1 text-secondary" />
              <span className="wd-first-name">Natasha</span>{" "}
              <span className="wd-last-name">Romanoff</span>
            </td>
            <td className="wd-login-id" style={{ border: '1px solid #dee2e6', padding: '12px' }}>001234564S</td>
            <td className="wd-section" style={{ border: '1px solid #dee2e6', padding: '12px' }}>S101</td>
            <td className="wd-role" style={{ border: '1px solid #dee2e6', padding: '12px' }}>TA</td>
            <td className="wd-last-activity" style={{ border: '1px solid #dee2e6', padding: '12px' }}>2020-11-05T00:00:00.000Z</td>
            <td className="wd-total-activity" style={{ border: '1px solid #dee2e6', padding: '12px' }}>13:23:34</td>
          </tr>
          
          <tr style={{ backgroundColor: '#f8f9fa' }}>
            <td className="wd-full-name text-nowrap" style={{ border: '1px solid #dee2e6', padding: '12px' }}>
              <FaUserCircle className="me-2 fs-1 text-secondary" />
              <span className="wd-first-name">Thor</span>{" "}
              <span className="wd-last-name">Odinson</span>
            </td>
            <td className="wd-login-id" style={{ border: '1px solid #dee2e6', padding: '12px' }}>001234565S</td>
            <td className="wd-section" style={{ border: '1px solid #dee2e6', padding: '12px' }}>S101</td>
            <td className="wd-role" style={{ border: '1px solid #dee2e6', padding: '12px' }}>STUDENT</td>
            <td className="wd-last-activity" style={{ border: '1px solid #dee2e6', padding: '12px' }}>2020-12-01T00:00:00.000Z</td>
            <td className="wd-total-activity" style={{ border: '1px solid #dee2e6', padding: '12px' }}>11:22:33</td>
          </tr>
          
          <tr>
            <td className="wd-full-name text-nowrap" style={{ border: '1px solid #dee2e6', padding: '12px' }}>
              <FaUserCircle className="me-2 fs-1 text-secondary" />
              <span className="wd-first-name">Bruce</span>{" "}
              <span className="wd-last-name">Banner</span>
            </td>
            <td className="wd-login-id" style={{ border: '1px solid #dee2e6', padding: '12px' }}>001234566S</td>
            <td className="wd-section" style={{ border: '1px solid #dee2e6', padding: '12px' }}>S101</td>
            <td className="wd-role" style={{ border: '1px solid #dee2e6', padding: '12px' }}>STUDENT</td>
            <td className="wd-last-activity" style={{ border: '1px solid #dee2e6', padding: '12px' }}>2020-12-01T00:00:00.000Z</td>
            <td className="wd-total-activity" style={{ border: '1px solid #dee2e6', padding: '12px' }}>22:33:44</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}