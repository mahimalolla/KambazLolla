import  { useState } from 'react';

export default function PiazzaDiscussions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  const discussions = [
    {
      id: 1,
      title: "Welcome to the course!",
      author: "Prof. Smith",
      date: "2025-05-01",
      content: "Welcome everyone! This is where we'll have our course discussions. Feel free to ask questions, share resources, and engage with your classmates.",
      replies: 12,
      upvotes: 25,
      isPinned: true,
      tags: ["announcement", "welcome"],
      timeAgo: "3 days ago"
    },
    {
      id: 2,
      title: "Assignment 2 Clarification",
      author: "Jane Doe",
      date: "2025-05-15",
      content: "Hi everyone, I had a question about the requirements for Assignment 2. Specifically, are we supposed to implement the authentication feature?",
      replies: 8,
      upvotes: 15,
      isPinned: false,
      tags: ["assignment", "question"],
      timeAgo: "2 hours ago"
    },
    {
      id: 3,
      title: "Study Group for Midterm",
      author: "Alex Johnson",
      date: "2025-05-14",
      content: "Looking to form a study group for the upcoming midterm. Anyone interested in meeting this weekend?",
      replies: 6,
      upvotes: 8,
      isPinned: false,
      tags: ["study-group", "midterm"],
      timeAgo: "1 day ago"
    },
    {
      id: 4,
      title: "Helpful Resources for React Development",
      author: "Sarah Wilson",
      date: "2025-05-13",
      content: "I found some great resources for learning React that might be helpful for our projects. Here are some links...",
      replies: 20,
      upvotes: 42,
      isPinned: false,
      tags: ["resources", "react"],
      timeAgo: "2 days ago"
    }
  ];

  const filteredDiscussions = discussions.filter(discussion => {
    const matchesSearch = discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         discussion.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'pinned') return matchesSearch && discussion.isPinned;
    if (selectedFilter === 'questions') return matchesSearch && discussion.tags.includes('question');
    if (selectedFilter === 'announcements') return matchesSearch && discussion.tags.includes('announcement');
    
    return matchesSearch;
  });

  const getTagColor = (tag: string) => {
    const tagColors = {
      'announcement': { bg: '#e7f1ff', color: '#0d6efd' },
      'question': { bg: '#fff3cd', color: '#664d03' },
      'assignment': { bg: '#f8d7da', color: '#721c24' },
      'study-group': { bg: '#d1e7dd', color: '#0f5132' },
      'resources': { bg: '#d1ecf1', color: '#055160' },
      'react': { bg: '#e2e3e5', color: '#41464b' },
      'welcome': { bg: '#e7f1ff', color: '#0d6efd' },
      'midterm': { bg: '#e2e3e5', color: '#41464b' }
    };
    return tagColors[tag] || { bg: '#e2e3e5', color: '#41464b' };
  };

  return (
    <div style={{ 
      padding: '2rem', 
      backgroundColor: '#f8f9fa', 
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h2 style={{ 
              color: '#212529', 
              fontWeight: 'bold', 
              marginBottom: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              fontSize: '2rem'
            }}>
              💬 Piazza Discussions
            </h2>
            <p style={{ color: '#6c757d', margin: 0 }}>Connect, collaborate, and learn together</p>
          </div>
          <button style={{
            backgroundColor: '#0d6efd',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#0b5ed7'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#0d6efd'}
          >
            ➕ New Post
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginBottom: '2rem', 
          flexWrap: 'wrap' 
        }}>
          <div style={{ flex: '2', minWidth: '300px' }}>
            <div style={{ position: 'relative' }}>
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
                placeholder="Search discussions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#0d6efd'}
                onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
              />
            </div>
          </div>
          <div style={{ 
            flex: '1', 
            minWidth: '200px', 
            display: 'flex', 
            gap: '8px' 
          }}>
            <select 
              value={selectedFilter} 
              onChange={(e) => setSelectedFilter(e.target.value)}
              style={{
                flex: '1',
                padding: '12px',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '16px',
                backgroundColor: 'white',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="all">All Posts</option>
              <option value="pinned">📌 Pinned</option>
              <option value="questions">❓ Questions</option>
              <option value="announcements">📢 Announcements</option>
            </select>
            <button style={{
              padding: '12px',
              border: '2px solid #e9ecef',
              borderRadius: '8px',
              backgroundColor: 'white',
              cursor: 'pointer',
              fontSize: '16px'
            }}>
              📊
            </button>
          </div>
        </div>
      </div>

      {/* Discussion Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem', 
        marginBottom: '2rem' 
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '2rem',
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
          border: '1px solid #e9ecef'
        }}>
          <div style={{ fontSize: '2.5rem', color: '#0d6efd', fontWeight: 'bold' }}>
            {discussions.length}
          </div>
          <div style={{ color: '#6c757d', marginTop: '0.5rem' }}>Total Posts</div>
        </div>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '2rem',
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
          border: '1px solid #e9ecef'
        }}>
          <div style={{ fontSize: '2.5rem', color: '#198754', fontWeight: 'bold' }}>
            {discussions.reduce((sum, d) => sum + d.replies, 0)}
          </div>
          <div style={{ color: '#6c757d', marginTop: '0.5rem' }}>Total Replies</div>
        </div>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '2rem',
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
          border: '1px solid #e9ecef'
        }}>
          <div style={{ fontSize: '2.5rem', color: '#ffc107', fontWeight: 'bold' }}>
            {discussions.filter(d => d.isPinned).length}
          </div>
          <div style={{ color: '#6c757d', marginTop: '0.5rem' }}>Pinned Posts</div>
        </div>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '2rem',
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
          border: '1px solid #e9ecef'
        }}>
          <div style={{ fontSize: '2.5rem', color: '#0dcaf0', fontWeight: 'bold' }}>
            {discussions.reduce((sum, d) => sum + d.upvotes, 0)}
          </div>
          <div style={{ color: '#6c757d', marginTop: '0.5rem' }}>Total Upvotes</div>
        </div>
      </div>

      {/* Discussions List */}
      <div>
        {filteredDiscussions.map((discussion) => {
          
          return (
            <div 
              key={discussion.id} 
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                marginBottom: '1.5rem',
                boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
                border: '1px solid #e9ecef',
                overflow: 'hidden',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.07)';
              }}
            >
              <div style={{ padding: '2rem' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start', 
                  marginBottom: '1rem',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div style={{ flex: '1', minWidth: '300px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem' }}>
                      {discussion.isPinned && (
                        <span style={{ color: '#ffc107', marginRight: '0.5rem', fontSize: '1.2em' }}>📌</span>
                      )}
                      <h4 style={{ 
                        margin: 0, 
                        color: '#212529', 
                        fontWeight: 'bold',
                        fontSize: '1.5rem',
                        lineHeight: '1.3'
                      }}>
                        {discussion.title}
                      </h4>
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      color: '#6c757d', 
                      marginBottom: '1rem',
                      fontSize: '0.95rem',
                      flexWrap: 'wrap',
                      gap: '0.5rem'
                    }}>
                      <span>👤</span>
                      <span style={{ fontWeight: '500' }}>{discussion.author}</span>
                      <span>🕒</span>
                      <span>{discussion.timeAgo}</span>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      {discussion.tags.map(tag => {
                        const colors = getTagColor(tag);
                        return (
                          <span 
                            key={tag} 
                            style={{
                              backgroundColor: colors.bg,
                              color: colors.color,
                              padding: '6px 12px',
                              borderRadius: '20px',
                              fontSize: '0.8rem',
                              fontWeight: '500',
                              marginRight: '0.5rem',
                              marginBottom: '0.5rem',
                              display: 'inline-block'
                            }}
                          >
                            {tag}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ textAlign: 'center', minWidth: '120px' }}>
                    <button style={{
                      backgroundColor: 'transparent',
                      border: '2px solid #198754',
                      color: '#198754',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      cursor: 'pointer',
                      marginBottom: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      transition: 'all 0.2s ease',
                      margin: '0 auto'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#198754';
                      e.target.style.color = 'white';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#198754';
                    }}
                    >
                      👍 {discussion.upvotes}
                    </button>
                    <small style={{ color: '#6c757d', display: 'block' }}>upvotes</small>
                  </div>
                </div>

                <p style={{ 
                  color: '#495057', 
                  marginBottom: '1.5rem',
                  lineHeight: '1.6',
                  fontSize: '1rem'
                }}>
                  {discussion.content}
                </p>

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <button style={{
                      backgroundColor: 'transparent',
                      border: '2px solid #0d6efd',
                      color: '#0d6efd',
                      borderRadius: '6px',
                      padding: '8px 16px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#0d6efd';
                      e.target.style.color = 'white';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#0d6efd';
                    }}
                    >
                      💬 Reply ({discussion.replies})
                    </button>
                    <button style={{
                      backgroundColor: 'transparent',
                      border: '2px solid #6c757d',
                      color: '#6c757d',
                      borderRadius: '6px',
                      padding: '8px 16px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#6c757d';
                      e.target.style.color = 'white';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#6c757d';
                    }}
                    >
                      ❤️ Like
                    </button>
                  </div>
                  
                  <button style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#0d6efd',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '500',
                    textDecoration: 'none',
                    padding: '8px 0'
                  }}
                  onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                  onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                  >
                    View Full Discussion →
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}