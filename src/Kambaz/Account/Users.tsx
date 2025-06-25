import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaUserCircle, FaEdit, FaTrash, FaPlus, FaSearch, FaTimes, FaCheck } from "react-icons/fa";
import { useAuth } from "../../AuthContext";
import * as userClient from "./client";

export default function Users() {
  const { state } = useAuth();
  const { uid } = useParams();
  const navigate = useNavigate();
  
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [roleFilter, setRoleFilter] = useState("");
  const [nameSearch, setNameSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  const [newUser, setNewUser] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "password123",
    role: "STUDENT"
  });

  // Redirect non-admin users
  useEffect(() => {
    if (!state.isAuthenticated || !state.user) {
      navigate("/Kambaz/Account/Signin");
      return;
    }
    
    if (state.user.role !== "ADMIN") {
      navigate("/Kambaz/Dashboard");
      return;
    }
  }, [state.isAuthenticated, state.user, navigate]);

  // Load all users
  useEffect(() => {
    loadUsers();
  }, []);

  // Load specific user if uid is provided
  useEffect(() => {
    if (uid && users.length > 0) {
      const user = users.find(u => u._id === uid);
      if (user) {
        setSelectedUser(user);
      }
    } else {
      setSelectedUser(null);
    }
  }, [uid, users]);

  // Apply filters
  useEffect(() => {
    let filtered = users;

    // Filter by role
    if (roleFilter) {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Filter by name search
    if (nameSearch) {
      const searchLower = nameSearch.toLowerCase();
      filtered = filtered.filter(user => 
        (user.firstName || "").toLowerCase().includes(searchLower) ||
        (user.lastName || "").toLowerCase().includes(searchLower) ||
        (user.username || "").toLowerCase().includes(searchLower) ||
        (user.email || "").toLowerCase().includes(searchLower)
      );
    }

    setFilteredUsers(filtered);
  }, [users, roleFilter, nameSearch]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersData = await userClient.findAllUsers();
      setUsers(usersData || []);
      console.log("Loaded users:", usersData?.length || 0);
    } catch (error: any) {
      console.error("Error loading users:", error);
      setMessage("❌ Failed to load users: " + error.message);
      setTimeout(() => setMessage(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!newUser.username.trim() || !newUser.firstName.trim() || !newUser.lastName.trim()) {
      setMessage("❌ Please fill in all required fields");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    try {
      setLoading(true);
      const createdUser = await userClient.signup(newUser);
      setUsers([...users, createdUser]);
      setNewUser({
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "password123",
        role: "STUDENT"
      });
      setShowCreateModal(false);
      setMessage("✅ User created successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error: any) {
      console.error("Error creating user:", error);
      setMessage("❌ Failed to create user: " + error.message);
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (userId: string, updates: any) => {
    try {
      setLoading(true);
      await userClient.updateProfile(userId, updates);
      
      // Update local state
      setUsers(users.map(user => 
        user._id === userId ? { ...user, ...updates } : user
      ));
      
      // Update selected user if it's the one being edited
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser({ ...selectedUser, ...updates });
      }
      
      setEditing(null);
      setMessage("✅ User updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error: any) {
      console.error("Error updating user:", error);
      setMessage("❌ Failed to update user: " + error.message);
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setLoading(true);
      await userClient.deleteUser(userId);
      setUsers(users.filter(user => user._id !== userId));
      
      // Clear selected user if it was deleted
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser(null);
        navigate("/Kambaz/Account/Users");
      }
      
      setMessage("✅ User deleted successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error: any) {
      console.error("Error deleting user:", error);
      setMessage("❌ Failed to delete user: " + error.message);
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setRoleFilter("");
    setNameSearch("");
  };

  if (!state.user || state.user.role !== "ADMIN") {
    return null;
  }

  return (
    <div style={{
      marginLeft: '240px',
      padding: '20px',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          padding: '30px',
          marginBottom: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#1a202c',
              marginBottom: '8px'
            }}>
              👥 User Management
            </h1>
            <p style={{
              color: '#718096',
              fontSize: '1.1rem',
              margin: 0
            }}>
              Manage all users in the system ({filteredUsers.length} {roleFilter ? `${roleFilter.toLowerCase()}s` : 'users'})
            </p>
          </div>
          
          <button
            onClick={() => setShowCreateModal(true)}
            disabled={loading}
            style={{
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FaPlus />
            Add User
          </button>
        </div>

        {/* Message Display */}
        {message && (
          <div style={{
            backgroundColor: message.includes('✅') ? '#f0fff4' : '#fef2f2',
            border: `1px solid ${message.includes('✅') ? '#9ae6b4' : '#fca5a5'}`,
            color: message.includes('✅') ? '#2f855a' : '#e53e3e',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center',
            fontWeight: '500'
          }}>
            {message}
          </div>
        )}

        <div style={{ display: 'flex', gap: '20px' }}>
          
          {/* Users List */}
          <div style={{ flex: selectedUser ? '0 0 400px' : '1' }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden'
            }}>
              
              {/* Filters */}
              <div style={{
                padding: '20px',
                borderBottom: '1px solid #e5e7eb',
                backgroundColor: '#f9fafb'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr auto',
                  gap: '12px',
                  alignItems: 'end'
                }}>
                  
                  {/* Role Filter */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '4px'
                    }}>
                      Filter by Role
                    </label>
                    <select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '0.9rem'
                      }}
                    >
                      <option value="">All Roles</option>
                      <option value="STUDENT">Students</option>
                      <option value="FACULTY">Faculty</option>
                      <option value="ADMIN">Administrators</option>
                    </select>
                  </div>

                  {/* Name Search */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '4px'
                    }}>
                      Search by Name
                    </label>
                    <div style={{ position: 'relative' }}>
                      <FaSearch style={{
                        position: 'absolute',
                        left: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#9ca3af',
                        fontSize: '0.8rem'
                      }} />
                      <input
                        type="text"
                        value={nameSearch}
                        onChange={(e) => setNameSearch(e.target.value)}
                        placeholder="Search users..."
                        style={{
                          width: '100%',
                          padding: '8px 12px 8px 32px',
                          border: '2px solid #e5e7eb',
                          borderRadius: '6px',
                          fontSize: '0.9rem'
                        }}
                      />
                    </div>
                  </div>

                  {/* Clear Filters */}
                  {(roleFilter || nameSearch) && (
                    <button
                      onClick={clearFilters}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#6b7280',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Users List */}
              <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {loading && filteredUsers.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center' }}>
                    <div style={{ marginBottom: '10px' }}>Loading users...</div>
                    <div className="spinner-border text-primary" role="status"></div>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                    <FaUserCircle style={{ fontSize: '3rem', marginBottom: '10px', opacity: 0.5 }} />
                    <div>No users found</div>
                    {(roleFilter || nameSearch) && (
                      <button onClick={clearFilters} style={{
                        marginTop: '10px',
                        color: '#4f46e5',
                        background: 'none',
                        border: 'none',
                        textDecoration: 'underline',
                        cursor: 'pointer'
                      }}>
                        Clear filters to see all users
                      </button>
                    )}
                  </div>
                ) : (
                  filteredUsers.map((user) => (
                    <div
                      key={user._id}
                      onClick={() => navigate(`/Kambaz/Account/Users/${user._id}`)}
                      style={{
                        padding: '16px 20px',
                        borderBottom: '1px solid #f3f4f6',
                        cursor: 'pointer',
                        backgroundColor: selectedUser && selectedUser._id === user._id ? '#eff6ff' : 'white',
                        borderLeft: selectedUser && selectedUser._id === user._id ? '4px solid #4f46e5' : '4px solid transparent',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!selectedUser || selectedUser._id !== user._id) {
                          e.currentTarget.style.backgroundColor = '#f9fafb';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!selectedUser || selectedUser._id !== user._id) {
                          e.currentTarget.style.backgroundColor = 'white';
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <FaUserCircle style={{ 
                          fontSize: '2rem', 
                          color: user.role === 'ADMIN' ? '#f59e0b' : user.role === 'FACULTY' ? '#10b981' : '#6366f1'
                        }} />
                        <div style={{ flex: 1 }}>
                          <div style={{
                            fontWeight: '600',
                            color: '#1a202c',
                            fontSize: '1rem'
                          }}>
                            {user.firstName} {user.lastName}
                          </div>
                          <div style={{
                            color: '#6b7280',
                            fontSize: '0.9rem'
                          }}>
                            @{user.username} • {user.email}
                          </div>
                          <div style={{
                            marginTop: '4px'
                          }}>
                            <span style={{
                              backgroundColor: user.role === 'ADMIN' ? '#fef3c7' : user.role === 'FACULTY' ? '#d1fae5' : '#dbeafe',
                              color: user.role === 'ADMIN' ? '#d97706' : user.role === 'FACULTY' ? '#059669' : '#2563eb',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: '500'
                            }}>
                              {user.role}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* User Details Panel */}
          {selectedUser && (
            <div style={{ flex: '0 0 500px' }}>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden'
              }}>
                
                {/* Header */}
                <div style={{
                  padding: '20px',
                  borderBottom: '1px solid #e5e7eb',
                  backgroundColor: '#f9fafb',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <h3 style={{
                    margin: 0,
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    color: '#1a202c'
                  }}>
                    User Details
                  </h3>
                  <button
                    onClick={() => navigate("/Kambaz/Account/Users")}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#6b7280',
                      cursor: 'pointer',
                      fontSize: '1.2rem'
                    }}
                  >
                    <FaTimes />
                  </button>
                </div>

                {/* User Info */}
                <div style={{ padding: '30px' }}>
                  
                  {/* Avatar and basic info */}
                  <div style={{
                    textAlign: 'center',
                    marginBottom: '30px'
                  }}>
                    <div style={{
                      width: '80px',
                      height: '80px',
                      backgroundColor: selectedUser.role === 'ADMIN' ? '#f59e0b' : selectedUser.role === 'FACULTY' ? '#10b981' : '#6366f1',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 15px',
                      fontSize: '2rem',
                      color: 'white',
                      fontWeight: 'bold'
                    }}>
                      {selectedUser.firstName?.charAt(0)}{selectedUser.lastName?.charAt(0)}
                    </div>
                    
                    {editing === selectedUser._id ? (
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
                        <input
                          type="text"
                          defaultValue={`${selectedUser.firstName} ${selectedUser.lastName}`}
                          style={{
                            padding: '6px 12px',
                            border: '2px solid #e5e7eb',
                            borderRadius: '6px',
                            fontSize: '1.1rem',
                            fontWeight: '600'
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const [firstName, lastName] = e.currentTarget.value.split(' ');
                              handleUpdateUser(selectedUser._id, { firstName, lastName });
                            }
                            if (e.key === 'Escape') {
                              setEditing(null);
                            }
                          }}
                          autoFocus
                        />
                        <button
                          onClick={() => setEditing(null)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#6b7280',
                            cursor: 'pointer'
                          }}
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <h2 style={{
                          margin: 0,
                          fontSize: '1.5rem',
                          fontWeight: '700',
                          color: '#1a202c'
                        }}>
                          {selectedUser.firstName} {selectedUser.lastName}
                        </h2>
                        <button
                          onClick={() => setEditing(selectedUser._id)}
                          disabled={loading}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#6b7280',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                          }}
                        >
                          <FaEdit />
                        </button>
                      </div>
                    )}

                    <div style={{
                      backgroundColor: selectedUser.role === 'ADMIN' ? '#fef3c7' : selectedUser.role === 'FACULTY' ? '#d1fae5' : '#dbeafe',
                      color: selectedUser.role === 'ADMIN' ? '#d97706' : selectedUser.role === 'FACULTY' ? '#059669' : '#2563eb',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      marginTop: '8px',
                      display: 'inline-block'
                    }}>
                      {selectedUser.role}
                    </div>
                  </div>

                  {/* User details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        color: '#6b7280',
                        marginBottom: '4px'
                      }}>
                        USERNAME
                      </label>
                      <div style={{
                        fontSize: '1rem',
                        color: '#1a202c',
                        fontWeight: '500'
                      }}>
                        @{selectedUser.username}
                      </div>
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        color: '#6b7280',
                        marginBottom: '4px'
                      }}>
                        EMAIL
                      </label>
                      <div style={{
                        fontSize: '1rem',
                        color: '#1a202c'
                      }}>
                        {selectedUser.email || 'No email provided'}
                      </div>
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        color: '#6b7280',
                        marginBottom: '4px'
                      }}>
                        USER ID
                      </label>
                      <div style={{
                        fontSize: '0.9rem',
                        color: '#6b7280',
                        fontFamily: 'monospace'
                      }}>
                        {selectedUser._id}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{
                    marginTop: '30px',
                    paddingTop: '20px',
                    borderTop: '1px solid #e5e7eb',
                    display: 'flex',
                    gap: '12px'
                  }}>
                    <button
                      onClick={() => handleDeleteUser(selectedUser._id, `${selectedUser.firstName} ${selectedUser.lastName}`)}
                      disabled={loading || selectedUser._id === state.user._id}
                      style={{
                        flex: 1,
                        backgroundColor: selectedUser._id === state.user._id ? '#9ca3af' : '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '10px 16px',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        cursor: (loading || selectedUser._id === state.user._id) ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                      title={selectedUser._id === state.user._id ? "Cannot delete your own account" : "Delete user"}
                    >
                      <FaTrash />
                      {selectedUser._id === state.user._id ? 'Cannot Delete Self' : 'Delete User'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Create User Modal */}
        {showCreateModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '30px',
              width: '90%',
              maxWidth: '500px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <h3 style={{
                  margin: 0,
                  fontSize: '1.3rem',
                  fontWeight: '600',
                  color: '#1a202c'
                }}>
                  Create New User
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#6b7280',
                    cursor: 'pointer',
                    fontSize: '1.2rem'
                  }}
                >
                  <FaTimes />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <input
                    type="text"
                    placeholder="First Name *"
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                    style={{
                      padding: '10px 12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Last Name *"
                    value={newUser.lastName}
                    onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                    style={{
                      padding: '10px 12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <input
                  type="text"
                  placeholder="Username *"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  style={{
                    padding: '10px 12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />

                <input
                  type="email"
                  placeholder="Email Address"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  style={{
                    padding: '10px 12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />

                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  style={{
                    padding: '10px 12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                >
                  <option value="STUDENT">Student</option>
                  <option value="FACULTY">Faculty</option>
                  <option value="ADMIN">Administrator</option>
                </select>

                <div style={{
                  display: 'flex',
                  gap: '12px',
                  marginTop: '10px'
                }}>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    disabled={loading}
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: '#6b7280',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: '500',
                      cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateUser}
                    disabled={loading || !newUser.username.trim() || !newUser.firstName.trim()}
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: (!newUser.username.trim() || !newUser.firstName.trim()) ? '#9ca3af' : '#4f46e5',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: '500',
                      cursor: (loading || !newUser.username.trim() || !newUser.firstName.trim()) ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    {loading ? (
                      <>
                        <div style={{
                          width: '16px',
                          height: '16px',
                          border: '2px solid #ffffff',
                          borderTop: '2px solid transparent',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }} />
                        Creating...
                      </>
                    ) : (
                      <>
                        <FaPlus />
                        Create User
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CSS for loading animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
