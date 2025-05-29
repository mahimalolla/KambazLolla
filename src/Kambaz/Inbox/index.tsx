import { useState } from 'react';

interface Email {
  id: number;
  from: string;
  fromEmail: string;
  subject: string;
  preview: string;
  content: string;
  time: string;
  date: string;
  isRead: boolean;
  isStarred: boolean;
  type: string;
  priority: string;
}

export default function Inbox() {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Sample email data
  const emails: Email[] = [
    {
      id: 1,
      from: 'Prof. Smith',
      fromEmail: 'j.smith@northeastern.edu',
      subject: 'Assignment 2 Feedback',
      preview: 'Great work on your React components! I have some suggestions for improvement...',
      content: 'Dear Student,\n\nI wanted to provide you with feedback on Assignment 2. Your React components show good understanding of the fundamentals. However, I noticed a few areas where you can improve:\n\n1. Consider using more descriptive variable names\n2. Add proper error handling\n3. Implement better component composition\n\nOverall, excellent work! Keep it up.\n\nBest regards,\nProf. Smith',
      time: '2 hours ago',
      date: '2025-05-29',
      isRead: false,
      isStarred: true,
      type: 'academic',
      priority: 'high'
    },
    {
      id: 2,
      from: 'Academic Registrar',
      fromEmail: 'registrar@northeastern.edu',
      subject: 'Course Registration Reminder',
      preview: 'Registration for Fall 2025 semester opens next week. Make sure to...',
      content: 'Dear Student,\n\nThis is a reminder that course registration for Fall 2025 semester will open on June 15th at 9:00 AM.\n\nPlease review your degree requirements and plan your schedule accordingly. Academic advisors are available for consultation.\n\nImportant dates:\n- Registration opens: June 15, 9:00 AM\n- Registration deadline: July 1, 11:59 PM\n- Add/Drop period: First week of classes\n\nBest regards,\nAcademic Registrar',
      time: '1 day ago',
      date: '2025-05-28',
      isRead: true,
      isStarred: false,
      type: 'administrative',
      priority: 'medium'
    },
    {
      id: 3,
      from: 'Study Group',
      fromEmail: 'studygroup.cs@northeastern.edu',
      subject: 'Study Session Tomorrow',
      preview: 'Hey everyone! Reminder about our study session tomorrow at 3 PM in...',
      content: 'Hey everyone!\n\nJust a reminder about our study session tomorrow (May 30th) at 3:00 PM in the library, Room 204.\n\nWe\'ll be reviewing:\n- JavaScript ES6 features\n- React hooks\n- State management\n\nPlease bring your laptops and any specific questions you have.\n\nSee you there!\nStudy Group Organizers',
      time: '3 hours ago',
      date: '2025-05-29',
      isRead: false,
      isStarred: false,
      type: 'social',
      priority: 'low'
    },
    {
      id: 4,
      from: 'IT Support',
      fromEmail: 'itsupport@northeastern.edu',
      subject: 'System Maintenance Notice',
      preview: 'Scheduled maintenance on the learning management system this weekend...',
      content: 'Dear Students and Faculty,\n\nWe will be performing scheduled maintenance on the learning management system this weekend.\n\nMaintenance window:\n- Start: Saturday, June 1st, 11:00 PM\n- End: Sunday, June 2nd, 6:00 AM\n\nDuring this time, you may experience:\n- Temporary service interruptions\n- Slower response times\n- Unable to submit assignments\n\nPlease plan accordingly and submit any assignments before the maintenance window.\n\nThank you for your patience.\nIT Support Team',
      time: '5 hours ago',
      date: '2025-05-29',
      isRead: true,
      isStarred: false,
      type: 'technical',
      priority: 'medium'
    },
    {
      id: 5,
      from: 'Career Services',
      fromEmail: 'careers@northeastern.edu',
      subject: '🚀 Summer Internship Opportunities',
      preview: 'Exciting internship opportunities available for CS students...',
      content: 'Dear Computer Science Students,\n\nWe have exciting summer internship opportunities that might interest you:\n\n🏢 Tech Companies:\n- Google (Software Engineering Intern)\n- Microsoft (Product Management Intern)\n- Amazon (Data Science Intern)\n\n💡 Startups:\n- Local fintech startup seeking full-stack developers\n- AI/ML startup looking for research interns\n\n📅 Application deadlines vary, but most are due by June 15th.\n\nVisit our career portal for more details and application links.\n\nBest of luck!\nCareer Services Team',
      time: '1 day ago',
      date: '2025-05-28',
      isRead: false,
      isStarred: true,
      type: 'career',
      priority: 'high'
    }
  ];

  const filteredEmails = emails.filter(email => {
    const matchesSearch = email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.preview.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'unread') return matchesSearch && !email.isRead;
    if (filter === 'starred') return matchesSearch && email.isStarred;
    
    return matchesSearch;
  });

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: { bg: string; color: string; icon: string } } = {
      academic: { bg: '#e7f1ff', color: '#0d6efd', icon: '📚' },
      administrative: { bg: '#fff3cd', color: '#664d03', icon: '🏛️' },
      social: { bg: '#d1e7dd', color: '#0f5132', icon: '👥' },
      technical: { bg: '#f8d7da', color: '#721c24', icon: '🔧' },
      career: { bg: '#e2e3e5', color: '#41464b', icon: '💼' }
    };
    return colors[type] || { bg: '#f8f9fa', color: '#6c757d', icon: '📧' };
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'high': return '#dc3545';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const toggleStar = (emailId: number): void => {
    console.log('Toggle star for email:', emailId);
  };

  const markAsRead = (emailId: number): void => {
    console.log('Mark as read:', emailId);
  };

  return (
    <div style={{ 
      marginLeft: '240px',
      display: 'flex',
      height: '100vh',
      backgroundColor: '#f8f9fa'
    }}>
      {/* Email List Sidebar */}
      <div style={{
        width: '400px',
        backgroundColor: 'white',
        borderRight: '1px solid #dee2e6',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '25px',
          borderBottom: '1px solid #dee2e6',
          backgroundColor: '#ffffff'
        }}>
          <h1 style={{
            color: '#212529',
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '15px',
            display: 'flex',
            alignItems: 'center'
          }}>
            📧 Inbox
          </h1>
          
          {/* Search Bar */}
          <div style={{ position: 'relative', marginBottom: '15px' }}>
            <span style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#6c757d',
              fontSize: '16px'
            }}>🔍</span>
            <input
              type="text"
              placeholder="Search emails..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 12px 12px 40px',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                const target = e.target as HTMLInputElement;
                target.style.borderColor = '#0d6efd';
              }}
              onBlur={(e) => {
                const target = e.target as HTMLInputElement;
                target.style.borderColor = '#e9ecef';
              }}
            />
          </div>

          {/* Filter Buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { key: 'all', label: 'All', icon: '📧' },
              { key: 'unread', label: 'Unread', icon: '🔴' },
              { key: 'starred', label: 'Starred', icon: '⭐' }
            ].map(filterOption => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key)}
                style={{
                  padding: '8px 12px',
                  border: filter === filterOption.key ? '2px solid #0d6efd' : '2px solid #e9ecef',
                  borderRadius: '6px',
                  backgroundColor: filter === filterOption.key ? '#e7f1ff' : 'white',
                  color: filter === filterOption.key ? '#0d6efd' : '#6c757d',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <span style={{ marginRight: '4px' }}>{filterOption.icon}</span>
                {filterOption.label}
              </button>
            ))}
          </div>
        </div>

        {/* Email List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filteredEmails.map(email => {
            const typeStyle = getTypeColor(email.type);
            return (
              <div
                key={email.id}
                onClick={() => {
                  setSelectedEmail(email);
                  if (!email.isRead) markAsRead(email.id);
                }}
                style={{
                  padding: '20px',
                  borderBottom: '1px solid #f1f3f4',
                  cursor: 'pointer',
                  backgroundColor: selectedEmail?.id === email.id ? '#f0f8ff' : 'white',
                  borderLeft: selectedEmail?.id === email.id ? '4px solid #0d6efd' : '4px solid transparent',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  if (selectedEmail?.id !== email.id) {
                    (e.currentTarget as HTMLElement).style.backgroundColor = '#f8f9fa';
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedEmail?.id !== email.id) {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'white';
                  }
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '8px'
                }}>
                  <div style={{
                    fontWeight: email.isRead ? '400' : 'bold',
                    color: '#212529',
                    fontSize: '14px',
                    flex: 1
                  }}>
                    {email.from}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: getPriorityColor(email.priority)
                      }}
                      title={`${email.priority} priority`}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStar(email.id);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                        padding: '2px'
                      }}
                    >
                      {email.isStarred ? '⭐' : '☆'}
                    </button>
                  </div>
                </div>
                
                <div style={{
                  fontWeight: email.isRead ? '400' : '600',
                  color: '#212529',
                  fontSize: '14px',
                  marginBottom: '8px',
                  lineHeight: '1.4'
                }}>
                  {email.subject}
                </div>
                
                <div style={{
                  color: '#6c757d',
                  fontSize: '13px',
                  marginBottom: '10px',
                  lineHeight: '1.4',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {email.preview}
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{
                    backgroundColor: typeStyle.bg,
                    color: typeStyle.color,
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span>{typeStyle.icon}</span>
                    {email.type}
                  </span>
                  <span style={{
                    color: '#6c757d',
                    fontSize: '12px'
                  }}>
                    {email.time}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Email Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {selectedEmail ? (
          <>
            {/* Email Header */}
            <div style={{
              backgroundColor: 'white',
              padding: '30px',
              borderBottom: '1px solid #dee2e6'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '20px'
              }}>
                <h2 style={{
                  color: '#212529',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  margin: 0,
                  lineHeight: '1.3'
                }}>
                  {selectedEmail.subject}
                </h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button style={{
                    backgroundColor: '#e9ecef',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#495057'
                  }}>
                    Reply
                  </button>
                  <button style={{
                    backgroundColor: '#e9ecef',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#495057'
                  }}>
                    Forward
                  </button>
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                color: '#6c757d',
                fontSize: '14px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#0d6efd',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    {selectedEmail.from.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: '500', color: '#212529' }}>
                      {selectedEmail.from}
                    </div>
                    <div style={{ fontSize: '12px' }}>
                      {selectedEmail.fromEmail}
                    </div>
                  </div>
                </div>
                <div>•</div>
                <div>{selectedEmail.time}</div>
                <div>•</div>
                <div>{selectedEmail.date}</div>
              </div>
            </div>

            {/* Email Body */}
            <div style={{
              flex: 1,
              backgroundColor: 'white',
              padding: '30px',
              overflowY: 'auto'
            }}>
              <div style={{
                fontSize: '16px',
                lineHeight: '1.6',
                color: '#212529',
                whiteSpace: 'pre-line'
              }}>
                {selectedEmail.content}
              </div>
            </div>
          </>
        ) : (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white'
          }}>
            <div style={{ textAlign: 'center', color: '#6c757d' }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📧</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>
                Select an email to read
              </h3>
              <p style={{ fontSize: '1rem' }}>
                Choose an email from the list to view its contents
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}