import React from 'react';

const AdminStats = ({ stats }) => {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
        }}>
            <div style={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                padding: '25px',
                borderRadius: '15px',
                color: 'white'
            }}>
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>👥</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats?.totalUsers || 0}</div>
                <div>Total Users</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '10px' }}>
                    👑 {stats?.adminUsers || 0} Admins
                </div>
            </div>

            <div style={{
                background: 'linear-gradient(135deg, #48bb78, #38a169)',
                padding: '25px',
                borderRadius: '15px',
                color: 'white'
            }}>
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🔄</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats?.totalSwapRequests || 0}</div>
                <div>Total Swaps</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '10px' }}>
                    ⏳ {stats?.pendingRequests || 0} Pending
                </div>
            </div>

            <div style={{
                background: 'linear-gradient(135deg, #f6ad55, #ed8936)',
                padding: '25px',
                borderRadius: '15px',
                color: 'white'
            }}>
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>💬</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats?.totalSessions || 0}</div>
                <div>Total Sessions</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '10px' }}>
                    ⭐ {stats?.totalReviews || 0} Reviews
                </div>
            </div>

            <div style={{
                background: 'linear-gradient(135deg, #fc8181, #f56565)',
                padding: '25px',
                borderRadius: '15px',
                color: 'white'
            }}>
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📊</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats?.activeUsers || 0}</div>
                <div>Active Users</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '10px' }}>
                    🎯 With skills listed
                </div>
            </div>
        </div>
    );
};

export default AdminStats;