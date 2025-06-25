import { useState, useEffect } from "react";
import { useParams } from "react-router";
import PeopleTable from "./Table";
import courseClient from "../client";

export default function People() {
  const { cid } = useParams(); // Get course ID from URL
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 6.4.3.5 - Load enrolled users for this course
  useEffect(() => {
    const loadEnrolledUsers = async () => {
      if (!cid) return;
      
      try {
        setLoading(true);
        setError("");
        
        // Call API to get users enrolled in this specific course
        const enrolledUsers = await courseClient.findUsersForCourse(cid);
        console.log('Loaded enrolled users for course:', cid, enrolledUsers);
        
        setUsers(enrolledUsers);
      } catch (err: any) {
        console.error("Error loading enrolled users:", err);
        setError("Failed to load course participants. Please try again.");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    loadEnrolledUsers();
  }, [cid]);

  if (loading) {
    return (
      <div className="container-fluid p-4">
        <h3 className="mb-4">People</h3>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading course participants...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid p-4">
        <h3 className="mb-4">People</h3>
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      <h3 className="mb-4">
        People ({users.length} enrolled)
      </h3>
      <div className="mb-3">
        <small className="text-muted">
          Showing users enrolled in this course • Data from MongoDB
        </small>
      </div>
      <PeopleTable users={users} />
    </div>
  );
}
