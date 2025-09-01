import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar.jsx';
import AdminHeader from '../components/AdminHeader.jsx';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    topProducts: [],
    monthlyRevenue: [],
    orderStatusCounts: {}
  });

  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      // For now, we'll use the existing stats endpoint
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/admin/stats`);

      if (response.ok) {
        const data = await response.json();
        
        // Transform the data for analytics display
        setAnalytics({
          totalRevenue: data.totalRevenue || 0,
          totalOrders: data.totalOrders || 0,
          averageOrderValue: data.totalOrders > 0 ? (data.totalRevenue / data.totalOrders).toFixed(2) : 0,
          topProducts: [],
          monthlyRevenue: [],
          orderStatusCounts: {}
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Logout functionality removed - admin is now public
    console.log('Logout clicked');
  };

  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa'
    },
    main: {
      flex: 1,
      padding: '20px'
    },
    pageTitle: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#2c3e50',
      marginBottom: '30px'
    },
    controls: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
      gap: '20px',
      flexWrap: 'wrap'
    },
    timeRangeSelector: {
      display: 'flex',
      gap: '8px',
      alignItems: 'center'
    },
    timeButton: {
      padding: '8px 16px',
      border: '1px solid #dee2e6',
      backgroundColor: '#fff',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      transition: 'all 0.3s ease'
    },
    timeButtonActive: {
      backgroundColor: '#b8860b',
      color: '#fff',
      borderColor: '#b8860b'
    },
    refreshButton: {
      padding: '8px 16px',
      border: '1px solid #28a745',
      backgroundColor: '#28a745',
      color: '#fff',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      transition: 'all 0.3s ease',
      marginLeft: 'auto',
      ':hover': {
        backgroundColor: '#218838',
        borderColor: '#218838'
      }
    },
    metricsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginBottom: '30px'
    },
    metricCard: {
      backgroundColor: '#fff',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e9ecef',
      textAlign: 'center'
    },
    metricValue: {
      fontSize: '2.5rem',
      fontWeight: '700',
      color: '#b8860b',
      marginBottom: '8px'
    },
    metricLabel: {
      fontSize: '1rem',
      color: '#6c757d',
      fontWeight: '500'
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '400px'
    },
    spinner: {
      width: '40px',
      height: '40px',
      border: '4px solid #f3f3f3',
      borderTop: '4px solid #b8860b',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <AdminSidebar />
        <div style={styles.main}>
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <AdminSidebar />
      <div style={styles.main}>
        <AdminHeader onLogout={handleLogout} />
        
        <h1 style={styles.pageTitle}>Analytics Dashboard</h1>

        {/* Time Range Controls */}
        <div style={styles.controls}>
          <div style={styles.timeRangeSelector}>
            <button
              style={{
                ...styles.timeButton,
                ...(timeRange === 'week' ? styles.timeButtonActive : {})
              }}
              onClick={() => setTimeRange('week')}
            >
              Week
            </button>
            <button
              style={{
                ...styles.timeButton,
                ...(timeRange === 'month' ? styles.timeButtonActive : {})
              }}
              onClick={() => setTimeRange('month')}
            >
              Month
            </button>
            <button
              style={{
                ...styles.timeButton,
                ...(timeRange === 'year' ? styles.timeButtonActive : {})
              }}
              onClick={() => setTimeRange('year')}
            >
              Year
            </button>
          </div>
          <button 
            style={styles.refreshButton}
            onClick={fetchAnalytics}
          >
            🔄 Refresh Data
          </button>
        </div>

        {/* Key Metrics */}
        <div style={styles.metricsGrid}>
          <div style={styles.metricCard}>
            <div style={styles.metricValue}>₹{Number(analytics.totalRevenue).toFixed(2)}</div>
            <div style={styles.metricLabel}>Total Revenue</div>
          </div>
          
          <div style={styles.metricCard}>
            <div style={styles.metricValue}>{analytics.totalOrders}</div>
            <div style={styles.metricLabel}>Total Orders</div>
          </div>
          
          <div style={styles.metricCard}>
            <div style={styles.metricValue}>₹{Number(analytics.averageOrderValue).toFixed(2)}</div>
            <div style={styles.metricLabel}>Average Order Value</div>
          </div>
          
          <div style={styles.metricCard}>
            <div style={styles.metricValue}>{timeRange}</div>
            <div style={styles.metricLabel}>Time Period</div>
          </div>
        </div>

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default AdminAnalytics;
