import  { useState, useEffect } from 'react';

export default function Zoom() {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const meetings = [
    {
      topic: "Live Lecture – Week 1",
      date: "2025-05-21",
      time: "10:00 AM",
      link: "https://zoom.us/j/1234567890",
      duration: "90 minutes",
      type: "lecture",
      status: "upcoming",
      attendees: 45,
      isRecorded: true,
      professor: "Prof. Smith",
      description: "Introduction to Web Development fundamentals"
    },
    {
      topic: "Project Check-in – Week 2",
      date: "2025-05-28",
      time: "2:00 PM",
      link: "https://zoom.us/j/9876543210",
      duration: "60 minutes",
      type: "meeting",
      status: "live",
      attendees: 12,
      isRecorded: false,
      professor: "Prof. Smith",
      description: "Review project progress and discuss challenges"
    },
    {
      topic: "Office Hours - Q&A Session",
      date: "2025-05-30",
      time: "3:00 PM",
      link: "https://zoom.us/j/1122334455",
      duration: "45 minutes",
      type: "office-hours",
      status: "upcoming",
      attendees: 8,
      isRecorded: false,
      professor: "Prof. Smith",
      description: "Open discussion and assignment help"
    }
  ];

  const getMeetingTypeInfo = (type: string) => {
    const types = {
      'lecture': { bg: '#e7f1ff', color: '#0d6efd', emoji: '📚', label: 'Lecture' },
      'meeting': { bg: '#fff3cd', color: '#664d03', emoji: '💼', label: 'Meeting' },
      'office-hours': { bg: '#d1e7dd', color: '#0f5132', emoji: '💬', label: 'Office Hours' }
    };
    return types[type] || { bg: '#e2e3e5', color: '#41464b', emoji: '📹', label: 'Meeting' };
  };

  const getStatusInfo = (status: string) => {
    const statuses = {
      'live': { bg: '#dc3545', color: 'white', text: '🔴 LIVE NOW', pulse: true },
      'upcoming': { bg: '#198754', color: 'white', text: '🟢 UPCOMING', pulse: false },
      'scheduled': { bg: '#ffc107', color: '#000', text: '🟡 SCHEDULED', pulse: false }
    };
    return statuses[status] || { bg: '#6c757d', color: 'white', text: 'UNKNOWN', pulse: false };
  };

  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isToday = (dateString: string | number | Date) => {
    const today = new Date().toDateString();
    const meetingDate = new Date(dateString).toDateString();
    return today === meetingDate;
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
              📹 Zoom Meetings
            </h2>
            <p style={{ color: '#6c757d', margin: 0 }}>
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
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
          onClick={() => window.open('https://zoom.us', '_blank')}
          >
            🚀 Launch Zoom
          </button>
        </div>

        {/* Quick Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
          gap: '1rem', 
          marginBottom: '2rem' 
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
            border: '1px solid #e9ecef'
          }}>
            <div style={{ fontSize: '2rem', color: '#0d6efd', fontWeight: 'bold' }}>
              {meetings.length}
            </div>
            <div style={{ color: '#6c757d', marginTop: '0.25rem' }}>Total Meetings</div>
          </div>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
            border: '1px solid #e9ecef'
          }}>
            <div style={{ fontSize: '2rem', color: '#dc3545', fontWeight: 'bold' }}>
              {meetings.filter(m => m.status === 'live').length}
            </div>
            <div style={{ color: '#6c757d', marginTop: '0.25rem' }}>Live Now</div>
          </div>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
            border: '1px solid #e9ecef'
          }}>
            <div style={{ fontSize: '2rem', color: '#198754', fontWeight: 'bold' }}>
              {meetings.filter(m => isToday(m.date)).length}
            </div>
            <div style={{ color: '#6c757d', marginTop: '0.25rem' }}>Today</div>
          </div>
        </div>
      </div>

      {/* Meetings List */}
      <div>
        <h3 style={{ 
          color: '#495057', 
          marginBottom: '1.5rem',
          fontSize: '1.5rem',
          fontWeight: '600'
        }}>
          📅 Upcoming Sessions
        </h3>
        
        {meetings.map((meeting, index) => {
          const typeInfo = getMeetingTypeInfo(meeting.type);
          const statusInfo = getStatusInfo(meeting.status);
          
          return (
            <div 
              key={index} 
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                marginBottom: '1.5rem',
                boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
                border: '1px solid #e9ecef',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                position: 'relative'
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
              {/* Status Indicator */}
              {meeting.status === 'live' && (
                <div style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  right: '0',
                  height: '4px',
                  background: 'linear-gradient(90deg, #dc3545, #ff6b6b)',
                  animation: 'pulse 2s infinite'
                }} />
              )}

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
                    {/* Meeting Title */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '1.5em', marginRight: '0.5rem' }}>
                        {typeInfo.emoji}
                      </span>
                      <h4 style={{ 
                        margin: 0, 
                        color: '#212529', 
                        fontWeight: 'bold',
                        fontSize: '1.4rem',
                        lineHeight: '1.3'
                      }}>
                        {meeting.topic}
                      </h4>
                    </div>
                    
                    {/* Meeting Details */}
                    <div style={{ 
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '1rem',
                      marginBottom: '1rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', color: '#6c757d' }}>
                        <span style={{ marginRight: '0.5rem' }}>📅</span>
                        <span style={{ fontWeight: '500' }}>{formatDate(meeting.date)}</span>
                        {isToday(meeting.date) && (
                          <span style={{
                            marginLeft: '0.5rem',
                            backgroundColor: '#198754',
                            color: 'white',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '0.7rem',
                            fontWeight: 'bold'
                          }}>
                            TODAY
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', color: '#6c757d' }}>
                        <span style={{ marginRight: '0.5rem' }}>⏰</span>
                        <span>{meeting.time} ({meeting.duration})</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', color: '#6c757d' }}>
                        <span style={{ marginRight: '0.5rem' }}>👥</span>
                        <span>{meeting.attendees} attendees</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', color: '#6c757d' }}>
                        <span style={{ marginRight: '0.5rem' }}>👨‍🏫</span>
                        <span>{meeting.professor}</span>
                      </div>
                    </div>

                    {/* Meeting Description */}
                    <p style={{ 
                      color: '#495057', 
                      marginBottom: '1rem',
                      lineHeight: '1.5',
                      fontSize: '0.95rem'
                    }}>
                      {meeting.description}
                    </p>

                    {/* Tags */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                      <span style={{
                        backgroundColor: typeInfo.bg,
                        color: typeInfo.color,
                        padding: '4px 12px',
                        borderRadius: '16px',
                        fontSize: '0.8rem',
                        fontWeight: '500'
                      }}>
                        {typeInfo.label}
                      </span>
                      <span style={{
                        backgroundColor: statusInfo.bg,
                        color: statusInfo.color,
                        padding: '4px 12px',
                        borderRadius: '16px',
                        fontSize: '0.8rem',
                        fontWeight: '500'
                      }}>
                        {statusInfo.text}
                      </span>
                      {meeting.isRecorded && (
                        <span style={{
                          backgroundColor: '#f8f9fa',
                          color: '#6c757d',
                          padding: '4px 12px',
                          borderRadius: '16px',
                          fontSize: '0.8rem',
                          fontWeight: '500'
                        }}>
                          📹 Recorded
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Join Button */}
                  <div style={{ textAlign: 'center', minWidth: '150px' }}>
                    <button 
                      style={{
                        backgroundColor: meeting.status === 'live' ? '#dc3545' : '#198754',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '12px 24px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s ease',
                        width: '100%',
                        justifyContent: 'center',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        animation: meeting.status === 'live' ? 'pulse 2s infinite' : 'none'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = 'scale(1.05)';
                        e.target.style.backgroundColor = meeting.status === 'live' ? '#bb2d3b' : '#157347';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.backgroundColor = meeting.status === 'live' ? '#dc3545' : '#198754';
                      }}
                      onClick={() => window.open(meeting.link, '_blank')}
                    >
                      {meeting.status === 'live' ? '🔴 Join Live' : '🚀 Join Meeting'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Go to Zoom Link */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '2rem',
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
          border: '1px solid #e9ecef',
          marginTop: '2rem'
        }}>
          <div style={{ marginBottom: '1rem' }}>
            <span style={{ fontSize: '3rem' }}>🎯</span>
          </div>
          <h4 style={{ color: '#212529', marginBottom: '0.5rem' }}>Need to access Zoom directly?</h4>
          <p style={{ color: '#6c757d', marginBottom: '1.5rem' }}>
            Launch the Zoom application or visit the web portal
          </p>
          <button 
            style={{
              backgroundColor: '#0d6efd',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 32px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#0b5ed7';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#0d6efd';
              e.target.style.transform = 'translateY(0)';
            }}
            onClick={() => window.open('https://zoom.us', '_blank')}
          >
            🌐 Go to Zoom →
          </button>
        </div>
      </div>

      {/* Custom Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.7; }
            100% { opacity: 1; }
          }
          
          @media (max-width: 768px) {
            h2 {
              font-size: 1.5rem !important;
            }
            
            .meeting-card {
              margin-bottom: 1rem;
            }
          }
        `
      }} />
    </div>
  );
}