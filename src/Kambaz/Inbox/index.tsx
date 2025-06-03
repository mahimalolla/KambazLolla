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
      subject: 'Assignment 4 - State Management Feedback',
      preview: 'Excellent work on your React state management! Your Redux implementation shows solid understanding...',
      content: 'Dear Student,\n\nI wanted to provide you with feedback on Assignment 4 - State Management. Your React components and Redux implementation show excellent understanding of the fundamentals.\n\nHighlights:\n✅ Proper useState implementation\n✅ Clean Redux store setup\n✅ Well-structured CRUD operations\n✅ Good component organization\n\nAreas for improvement:\n1. Consider adding loading states for async operations\n2. Implement error boundaries for better error handling\n3. Add prop validation with TypeScript interfaces\n\nOverall grade: A-\n\nKeep up the excellent work!\n\nBest regards,\nProf. Smith',
      time: '1 hour ago',
      date: '2025-06-03',
      isRead: false,
      isStarred: true,
      type: 'academic',
      priority: 'high'
    },
    {
      id: 2,
      from: 'Kambaz System',
      fromEmail: 'noreply@kambaz.edu',
      subject: 'Course Module Update - CS5610',
      preview: 'New modules have been added to your Web Development course. Check out the latest content...',
      content: 'Dear Student,\n\nNew modules have been added to your CS5610 Web Development course:\n\n📚 New Modules:\n• Module 7: Advanced State Management\n• Module 8: Server-Side Rendering\n• Module 9: Testing React Applications\n\nThese modules include:\n- Interactive lectures\n- Hands-on coding exercises\n- Project assignments\n- Additional resources\n\nThe modules are now available in your course dashboard.\n\nHappy learning!\nKambaz Learning Management System',
      time: '3 hours ago',
      date: '2025-06-03',
      isRead: true,
      isStarred: false,
      type: 'administrative',
      priority: 'medium'
    },
    {
      id: 3,
      from: 'Study Group Chat',
      fromEmail: 'studygroup.cs5610@northeastern.edu',
      subject: 'Redux Study Session - Tomorrow 2PM',
      preview: 'Hey everyone! Let\'s meet tomorrow to review Redux concepts and work on Assignment 4 together...',
      content: 'Hey CS5610 Study Group!\n\n🗓️ Study Session Details:\n• Date: Tomorrow (June 4th)\n• Time: 2:00 PM - 4:00 PM\n• Location: Library Room 301\n• Topic: Redux & State Management\n\n📋 Agenda:\n1. Review Redux fundamentals\n2. Work through Assignment 4 problems\n3. Discuss CRUD operations\n4. Q&A session\n\nPlease bring:\n💻 Your laptop with code\n📝 Any specific questions\n☕ Snacks to share (optional!)\n\nSee you there!\n- Study Group Organizers',
      time: '5 hours ago',
      date: '2025-06-03',
      isRead: false,
      isStarred: false,
      type: 'social',
      priority: 'low'
    },
    {
      id: 4,
      from: 'Netlify Deploy Bot',
      fromEmail: 'deploy@netlify.com',
      subject: '✅ Deployment Successful - kambaz-app',
      preview: 'Your site has been successfully deployed! Your latest changes are now live...',
      content: '🎉 Deployment Successful!\n\nYour Kambaz application has been successfully deployed to Netlify.\n\n📊 Deployment Details:\n• Site: kambaz-react-web-app\n• Branch: a4-assignment\n• Commit: "Add Lab4 state management features"\n• Deploy time: 2 minutes 34 seconds\n• Status: ✅ Live\n\n🔗 Your site is available at:\nhttps://cheerful-gumdrop-bc5c37.netlify.app\n\n📈 Performance:\n• Build time: 1m 45s\n• Bundle size: 2.3 MB\n• All checks passed ✅\n\nGreat work on getting your assignment deployed!\n\n- Netlify Team',
      time: '2 hours ago',
      date: '2025-06-03',
      isRead: true,
      isStarred: true,
      type: 'technical',
      priority: 'medium'
    },
    {
      id: 5,
      from: 'GitHub',
      fromEmail: 'noreply@github.com',
      subject: '🔄 Pull Request Ready for Review',
      preview: 'Your pull request "Add CRUD operations for courses and modules" is ready for review...',
      content: '👋 Hello!\n\nYour pull request is ready for review:\n\n📋 Pull Request Details:\n• Title: "Add CRUD operations for courses and modules"\n• Repository: KambazLolla/kambaz-react-web-app\n• Branch: a4-assignment → main\n• Files changed: 12\n• Additions: +450 lines\n• Deletions: -23 lines\n\n✨ Changes include:\n• Dashboard CRUD functionality\n• Module state management\n• Redux integration\n• Improved UI components\n\n🔍 Review checklist:\n☑️ All tests passing\n☑️ No merge conflicts\n☑️ Code follows style guidelines\n☑️ Documentation updated\n\nYour code looks great! Ready to merge when you are.\n\n- GitHub Team',
      time: '4 hours ago',
      date: '2025-06-03',
      isRead: false,
      isStarred: true,
      type: 'technical',
      priority: 'high'
    },
    {
      id: 6,
      from: 'Career Services',
      fromEmail: 'careers@northeastern.edu',
      subject: '🚀 React Developer Internship Opportunity',
      preview: 'Based on your coursework in CS5610, we have an exciting React internship opportunity...',
      content: 'Dear Computer Science Student,\n\nBased on your excellent performance in CS5610 Web Development, we have an exciting opportunity that matches your skills:\n\n🏢 Company: TechFlow Solutions\n📍 Location: Boston, MA (Hybrid)\n💼 Position: React Developer Intern\n⏰ Duration: Summer 2025 (12 weeks)\n💰 Compensation: $25/hour\n\n🔧 Requirements:\n• Strong React.js and JavaScript skills ✅\n• Experience with state management (Redux) ✅\n• Knowledge of modern web development ✅\n• Git/GitHub proficiency ✅\n\n📝 Responsibilities:\n• Build responsive web applications\n• Collaborate with senior developers\n• Participate in code reviews\n• Work on real client projects\n\n🎯 This looks like a perfect match for your skills!\n\nApplication deadline: June 15th\nInterviews: June 20-25th\nStart date: July 1st\n\nInterested? Reply to this email or visit our career portal.\n\nBest of luck!\nCareer Services Team',
      time: '1 day ago',
      date: '2025-06-02',
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

  const toggleStar = (emailId: number, e: React.MouseEvent): void => {
    e.stopPropagation();
    // Update email starred status in real app
    console.log('Toggle star for email:', emailId);
  };

  const markAsRead = (emailId: number): void => {
    // Update email read status in real app
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
        width: '450px',
        backgroundColor: 'white',
        borderRight: '1px solid #dee2e6',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '2px 0 4px rgba(0,0,0,0.1)'
      }}>
        {/* Header */}
        <div style={{
          padding: '30px',
          borderBottom: '1px solid #dee2e6',
          backgroundColor: '#ffffff'
        }}>
          <h1 style={{
            color: '#212529',
            fontSize: '2.2rem',
            fontWeight: 'bold',
            marginBottom: '15px',
            display: 'flex',
            alignItems: 'center'
          }}>
            📧 Inbox
            <span style={{
              backgroundColor: '#dc3545',
              color: 'white',
              fontSize: '0.8rem',
              padding: '4px 8px',
              borderRadius: '12px',
              marginLeft: '12px'
            }}>
              {filteredEmails.filter(e => !e.isRead).length}
            </span>
          </h1>
          
          {/* Search Bar */}
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <span style={{
              position: 'absolute',
              left: '15px',
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
                padding: '15px 15px 15px 45px',
                border: '2px solid #e9ecef',
                borderRadius: '10px',
                fontSize: '15px',
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
          <div style={{ display: 'flex', gap: '10px' }}>
            {[
              { key: 'all', label: 'All', icon: '📧' },
              { key: 'unread', label: 'Unread', icon: '🔴' },
              { key: 'starred', label: 'Starred', icon: '⭐' }
            ].map(filterOption => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key)}
                style={{
                  padding: '10px 15px',
                  border: filter === filterOption.key ? '2px solid #0d6efd' : '2px solid #e9ecef',
                  borderRadius: '8px',
                  backgroundColor: filter === filterOption.key ? '#e7f1ff' : 'white',
                  color: filter === filterOption.key ? '#0d6efd' : '#6c757d',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  flex: 1,
                  textAlign: 'center'
                }}
              >
                <span style={{ marginRight: '6px' }}>{filterOption.icon}</span>
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
                  padding: '25px',
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
                  marginBottom: '10px'
                }}>
                  <div style={{
                    fontWeight: email.isRead ? '500' : 'bold',
                    color: '#212529',
                    fontSize: '15px',
                    flex: 1
                  }}>
                    {email.from}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: getPriorityColor(email.priority)
                      }}
                      title={`${email.priority} priority`}
                    />
                    <button
                      onClick={(e) => toggleStar(email.id, e)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '16px',
                        padding: '4px'
                      }}
                    >
                      {email.isStarred ? '⭐' : '☆'}
                    </button>
                  </div>
                </div>
                
                <div style={{
                  fontWeight: email.isRead ? '500' : 'bold',
                  color: '#212529',
                  fontSize: '15px',
                  marginBottom: '10px',
                  lineHeight: '1.4'
                }}>
                  {email.subject}
                </div>
                
                <div style={{
                  color: '#6c757d',
                  fontSize: '14px',
                  marginBottom: '12px',
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
                    padding: '6px 10px',
                    borderRadius: '15px',
                    fontSize: '12px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    <span>{typeStyle.icon}</span>
                    {email.type}
                  </span>
                  <span style={{
                    color: '#6c757d',
                    fontSize: '13px',
                    fontWeight: '500'
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
              padding: '35px',
              borderBottom: '1px solid #dee2e6',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '25px'
              }}>
                <h2 style={{
                  color: '#212529',
                  fontSize: '1.8rem',
                  fontWeight: 'bold',
                  margin: 0,
                  lineHeight: '1.3',
                  flex: 1,
                  paddingRight: '20px'
                }}>
                  {selectedEmail.subject}
                </h2>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button style={{
                    backgroundColor: '#0d6efd',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 16px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    Reply
                  </button>
                  <button style={{
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 16px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    Forward
                  </button>
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                color: '#6c757d',
                fontSize: '15px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#0d6efd',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}>
                    {selectedEmail.from.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: '#212529', fontSize: '16px' }}>
                      {selectedEmail.from}
                    </div>
                    <div style={{ fontSize: '13px' }}>
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
              padding: '35px',
              overflowY: 'auto'
            }}>
              <div style={{
                fontSize: '16px',
                lineHeight: '1.8',
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
              <div style={{ fontSize: '5rem', marginBottom: '25px' }}>📧</div>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '15px', color: '#212529' }}>
                Select an email to read
              </h3>
              <p style={{ fontSize: '1.1rem' }}>
                Choose an email from the list to view its contents
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
