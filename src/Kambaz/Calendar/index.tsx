import { useState } from 'react';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();
  
  // Sample events data
  const events = [
    { id: 1, date: '2025-05-30', title: 'Assignment 2 Due', type: 'assignment', color: '#dc3545' },
    { id: 2, date: '2025-06-02', title: 'Quiz 3: JavaScript', type: 'quiz', color: '#ffc107' },
    { id: 3, date: '2025-06-05', title: 'Office Hours', type: 'meeting', color: '#28a745' },
    { id: 4, date: '2025-06-08', title: 'Project Presentation', type: 'presentation', color: '#6f42c1' },
    { id: 5, date: '2025-06-10', title: 'Final Exam', type: 'exam', color: '#fd7e14' },
    { id: 6, date: '2025-05-29', title: 'Lab 3 Due', type: 'assignment', color: '#dc3545' },
    { id: 7, date: '2025-06-03', title: 'Team Meeting', type: 'meeting', color: '#28a745' },
  ];

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = formatDate(date);
    return events.filter(event => event.date === dateStr);
  };

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} style={{
          aspectRatio: '1',
          border: '1px solid #e9ecef',
          backgroundColor: '#f8f9fa'
        }} />
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isToday = formatDate(date) === formatDate(today);
      const dayEvents = getEventsForDate(date);

      days.push(
        <div
          key={day}
          style={{
            aspectRatio: '1',
            border: '1px solid #e9ecef',
            backgroundColor: 'white',
            padding: '8px',
            position: 'relative',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#f8f9fa'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
        >
          <div style={{
            fontSize: '14px',
            fontWeight: isToday ? 'bold' : 'normal',
            color: isToday ? '#dc3545' : '#212529',
            marginBottom: '4px'
          }}>
            {day}
          </div>
          
          {/* Event dots */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px' }}>
            {dayEvents.slice(0, 3).map((event) => (
              <div
                key={event.id}
                title={event.title}
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: event.color
                }}
              />
            ))}
            {dayEvents.length > 3 && (
              <div style={{
                fontSize: '10px',
                color: '#6c757d',
                fontWeight: 'bold'
              }}>
                +{dayEvents.length - 3}
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const upcomingEvents = events
    .filter(event => new Date(event.date) >= today)
    .slice(0, 5);

  return (
    <div style={{ 
      marginLeft: '240px',
      padding: '30px',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ 
          color: '#212529', 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          marginBottom: '10px',
          display: 'flex',
          alignItems: 'center'
        }}>
          📅 Calendar
        </h1>
        <p style={{ color: '#6c757d', fontSize: '1.1rem' }}>
          Stay organized with your academic schedule
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
        {/* Calendar Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '25px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e9ecef'
        }}>
          {/* Calendar Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '25px',
            paddingBottom: '15px',
            borderBottom: '2px solid #f1f3f4'
          }}>
            <button
              onClick={() => navigateMonth(-1)}
              style={{
                backgroundColor: 'transparent',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                padding: '10px 15px',
                cursor: 'pointer',
                fontSize: '18px',
                color: '#495057',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#e9ecef';
                e.target.style.borderColor = '#adb5bd';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.borderColor = '#e9ecef';
              }}
            >
              ←
            </button>
            
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: 'bold',
              color: '#212529',
              margin: 0
            }}>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            
            <button
              onClick={() => navigateMonth(1)}
              style={{
                backgroundColor: 'transparent',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                padding: '10px 15px',
                cursor: 'pointer',
                fontSize: '18px',
                color: '#495057',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#e9ecef';
                e.target.style.borderColor = '#adb5bd';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.borderColor = '#e9ecef';
              }}
            >
              →
            </button>
          </div>

          {/* Days of Week Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '0',
            marginBottom: '10px'
          }}>
            {daysOfWeek.map(day => (
              <div
                key={day}
                style={{
                  textAlign: 'center',
                  padding: '12px 8px',
                  fontWeight: 'bold',
                  color: '#6c757d',
                  fontSize: '14px',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #e9ecef'
                }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '0'
          }}>
            {renderCalendarDays()}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Today's Date */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e9ecef',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: '#dc3545',
              marginBottom: '5px'
            }}>
              {today.getDate()}
            </div>
            <div style={{
              color: '#6c757d',
              fontSize: '16px',
              fontWeight: '500'
            }}>
              {monthNames[today.getMonth()]} {today.getFullYear()}
            </div>
            <div style={{
              color: '#28a745',
              fontSize: '14px',
              marginTop: '5px',
              fontWeight: '500'
            }}>
              Today
            </div>
          </div>

          {/* Upcoming Events */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{
              color: '#212529',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              marginBottom: '15px',
              display: 'flex',
              alignItems: 'center'
            }}>
              ⏰ Upcoming Events
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {upcomingEvents.map(event => (
                <div
                  key={event.id}
                  style={{
                    padding: '12px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    borderLeft: `4px solid ${event.color}`,
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#e9ecef'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                >
                  <div style={{
                    fontWeight: '600',
                    color: '#212529',
                    fontSize: '14px',
                    marginBottom: '4px'
                  }}>
                    {event.title}
                  </div>
                  <div style={{
                    color: '#6c757d',
                    fontSize: '12px'
                  }}>
                    {new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Event Legend */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{
              color: '#212529',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              marginBottom: '15px'
            }}>
              Event Types
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { type: 'Assignment', color: '#dc3545', icon: '📝' },
                { type: 'Quiz', color: '#ffc107', icon: '❓' },
                { type: 'Meeting', color: '#28a745', icon: '👥' },
                { type: 'Presentation', color: '#6f42c1', icon: '🎤' },
                { type: 'Exam', color: '#fd7e14', icon: '📊' }
              ].map(item => (
                <div
                  key={item.type}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px'
                  }}
                >
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: item.color
                  }} />
                  <span style={{ fontSize: '12px' }}>{item.icon}</span>
                  <span style={{
                    fontSize: '14px',
                    color: '#495057'
                  }}>
                    {item.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}