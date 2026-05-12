import React, { useState, useEffect } from 'react';

const AdminUsersList = ({ currentUser }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showSkillsModal, setShowSkillsModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [editForm, setEditForm] = useState({
        role: '',
        skillCredits: 0,
        reputationScore: 0
    });
    const [skillsForm, setSkillsForm] = useState({
        teachSkills: [],
        learnSkills: []
    });
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    useEffect(() => {
        fetchUsers();
    }, []);

    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/admin/users');
            const data = await response.json();
            if (data.success) {
                setUsers(data.users);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            showNotification('Failed to fetch users', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setEditForm({
            role: user.role,
            skillCredits: user.skillCredits,
            reputationScore: user.reputationScore
        });
        setShowEditModal(true);
    };

    const handleEditSkills = (user) => {
        setSelectedUser(user);
        setSkillsForm({
            teachSkills: user.teachSkills || [],
            learnSkills: user.learnSkills || []
        });
        setShowSkillsModal(true);
    };

    const handleUpdateUser = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/users/${selectedUser._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm)
            });
            const data = await response.json();
            if (data.success) {
                showNotification('✅ User updated successfully');
                fetchUsers();
                setShowEditModal(false);
            }
        } catch (error) {
            console.error('Error updating user:', error);
            showNotification('Failed to update user', 'error');
        }
    };

    const handleUpdateSkills = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/users/${selectedUser._id}/skills`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(skillsForm)
            });
            const data = await response.json();
            if (data.success) {
                showNotification('✅ User skills updated successfully');
                fetchUsers();
                setShowSkillsModal(false);
            }
        } catch (error) {
            console.error('Error updating skills:', error);
            showNotification('Failed to update skills', 'error');
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentUserId: currentUser.id })
            });
            const data = await response.json();
            if (data.success) {
                showNotification('✅ User deleted successfully');
                fetchUsers();
                setShowDeleteConfirm(null);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            showNotification('Failed to delete user', 'error');
        }
    };

    const handleResetPassword = async (userId) => {
        const newPassword = prompt('Enter new password for user:');
        if (!newPassword) return;

        try {
            const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/password`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newPassword })
            });
            const data = await response.json();
            if (data.success) {
                showNotification('✅ Password reset successfully');
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            showNotification('Failed to reset password', 'error');
        }
    };

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const getRandomColor = (userId) => {
        const colors = [
            'linear-gradient(135deg, #667eea, #764ba2)',
            'linear-gradient(135deg, #f093fb, #f5576c)',
            'linear-gradient(135deg, #4facfe, #00f2fe)',
            'linear-gradient(135deg, #43e97b, #38f9d7)',
            'linear-gradient(135deg, #fa709a, #fee140)',
            'linear-gradient(135deg, #30cfd0, #330867)'
        ];
        const index = userId.charCodeAt(0) % colors.length;
        return colors[index];
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '400px'
            }}>
                <div style={{
                    width: '50px',
                    height: '50px',
                    border: '3px solid #f3f3f3',
                    borderTop: '3px solid #667eea',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }} />
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Notification */}
            {notification.show && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    padding: '16px 24px',
                    background: notification.type === 'success' ? '#48bb78' : '#f56565',
                    color: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 9999,
                    animation: 'slideIn 0.3s ease',
                    fontWeight: '500'
                }}>
                    {notification.message}
                </div>
            )}

            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px',
                flexWrap: 'wrap',
                gap: '15px'
            }}>
                <div>
                    <h1 style={{
                        margin: 0,
                        fontSize: '2rem',
                        fontWeight: '700',
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        display: 'inline-block'
                    }}>
                        👥 User Management
                    </h1>
                    <p style={{ margin: '5px 0 0', color: '#718096' }}>
                        Manage all users, roles, and permissions
                    </p>
                </div>
                
                <div style={{
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    padding: '12px 24px',
                    borderRadius: '30px',
                    color: 'white',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                }}>
                    <span style={{ fontSize: '1.2rem' }}>👥</span>
                    <span>Total Users: {users.length}</span>
                </div>
            </div>

            {/* Search Bar */}
            <div style={{
                background: 'white',
                padding: '20px',
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                marginBottom: '24px',
                border: '1px solid #edf2f7'
            }}>
                <div style={{ position: 'relative' }}>
                    <span style={{
                        position: 'absolute',
                        left: '15px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: '1.2rem',
                        color: '#a0aec0'
                    }}>🔍</span>
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '15px 15px 15px 50px',
                            border: '2px solid #edf2f7',
                            borderRadius: '12px',
                            fontSize: '1rem',
                            outline: 'none',
                            transition: 'all 0.3s',
                            boxSizing: 'border-box'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#edf2f7'}
                    />
                </div>
            </div>

            {/* Users Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: '20px'
            }}>
                {filteredUsers.map((user, index) => (
                    <div
                        key={user._id}
                        style={{
                            background: 'white',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                            border: '1px solid #edf2f7',
                            transition: 'all 0.3s ease',
                            animation: `fadeIn 0.5s ease ${index * 0.1}s both`,
                            position: 'relative'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                        }}
                    >
                        <style>{`
                            @keyframes fadeIn {
                                from {
                                    opacity: 0;
                                    transform: translateY(20px);
                                }
                                to {
                                    opacity: 1;
                                    transform: translateY(0);
                                }
                            }
                            @keyframes slideIn {
                                from {
                                    transform: translateX(100%);
                                    opacity: 0;
                                }
                                to {
                                    transform: translateX(0);
                                    opacity: 1;
                                }
                            }
                        `}</style>

                        {/* User Header with Gradient */}
                        <div style={{
                            background: getRandomColor(user._id),
                            padding: '24px 20px',
                            color: 'white',
                            position: 'relative'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px'
                            }}>
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '50%',
                                    background: 'rgba(255,255,255,0.2)',
                                    backdropFilter: 'blur(10px)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    border: '2px solid rgba(255,255,255,0.5)'
                                }}>
                                    {getInitials(user.name)}
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600' }}>
                                        {user.name}
                                    </h3>
                                    <p style={{ margin: '5px 0 0', opacity: 0.9, fontSize: '0.9rem' }}>
                                        {user.email}
                                    </p>
                                </div>
                            </div>

                            {/* Role Badge */}
                            <div style={{
                                position: 'absolute',
                                top: '15px',
                                right: '15px',
                                background: 'rgba(255,255,255,0.2)',
                                padding: '6px 12px',
                                borderRadius: '20px',
                                fontSize: '0.8rem',
                                fontWeight: '600',
                                backdropFilter: 'blur(10px)'
                            }}>
                                {user.role === 'admin' ? '👑 Admin' : '👤 User'}
                            </div>
                        </div>

                        {/* User Stats */}
                        <div style={{ padding: '20px' }}>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '15px',
                                marginBottom: '20px'
                            }}>
                                <div style={{
                                    background: '#f7fafc',
                                    padding: '12px',
                                    borderRadius: '12px',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#667eea' }}>
                                        {user.skillCredits}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: '#718096' }}>Credits</div>
                                </div>
                                <div style={{
                                    background: '#f7fafc',
                                    padding: '12px',
                                    borderRadius: '12px',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#48bb78' }}>
                                        {user.reputationScore}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: '#718096' }}>Reputation</div>
                                </div>
                            </div>

                            {/* Skills */}
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    marginBottom: '10px'
                                }}>
                                    <span style={{ fontSize: '1rem' }}>🎯</span>
                                    <span style={{ fontWeight: '600', color: '#2d3748' }}>Teaches</span>
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {user.teachSkills?.length > 0 ? (
                                        user.teachSkills.slice(0, 3).map((skill, i) => (
                                            <span key={i} style={{
                                                background: 'linear-gradient(135deg, #48bb78, #38a169)',
                                                color: 'white',
                                                padding: '4px 12px',
                                                borderRadius: '20px',
                                                fontSize: '0.8rem',
                                                fontWeight: '500',
                                                boxShadow: '0 2px 4px rgba(72, 187, 120, 0.2)'
                                            }}>
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <span style={{ color: '#a0aec0', fontSize: '0.9rem' }}>No teaching skills</span>
                                    )}
                                    {user.teachSkills?.length > 3 && (
                                        <span style={{
                                            background: '#edf2f7',
                                            color: '#4a5568',
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            fontSize: '0.8rem'
                                        }}>
                                            +{user.teachSkills.length - 3}
                                        </span>
                                    )}
                                </div>

                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    margin: '15px 0 10px'
                                }}>
                                    <span style={{ fontSize: '1rem' }}>📚</span>
                                    <span style={{ fontWeight: '600', color: '#2d3748' }}>Learning</span>
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {user.learnSkills?.length > 0 ? (
                                        user.learnSkills.slice(0, 3).map((skill, i) => (
                                            <span key={i} style={{
                                                background: 'linear-gradient(135deg, #f56565, #e53e3e)',
                                                color: 'white',
                                                padding: '4px 12px',
                                                borderRadius: '20px',
                                                fontSize: '0.8rem',
                                                fontWeight: '500',
                                                boxShadow: '0 2px 4px rgba(245, 101, 101, 0.2)'
                                            }}>
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <span style={{ color: '#a0aec0', fontSize: '0.9rem' }}>No learning skills</span>
                                    )}
                                    {user.learnSkills?.length > 3 && (
                                        <span style={{
                                            background: '#edf2f7',
                                            color: '#4a5568',
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            fontSize: '0.8rem'
                                        }}>
                                            +{user.learnSkills.length - 3}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: user._id !== currentUser.id ? '1fr 1fr 1fr 1fr' : '1fr 1fr 1fr',
                                gap: '8px'
                            }}>
                                <button
                                    onClick={() => handleEditUser(user)}
                                    style={{
                                        padding: '10px',
                                        background: 'linear-gradient(135deg, #4299e1, #3182ce)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '10px',
                                        fontSize: '0.8rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        boxShadow: '0 2px 4px rgba(66, 153, 225, 0.3)'
                                    }}
                                    onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                                >
                                    ✏️ Edit
                                </button>
                                <button
                                    onClick={() => handleEditSkills(user)}
                                    style={{
                                        padding: '10px',
                                        background: 'linear-gradient(135deg, #48bb78, #38a169)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '10px',
                                        fontSize: '0.8rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        boxShadow: '0 2px 4px rgba(72, 187, 120, 0.3)'
                                    }}
                                    onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                                >
                                    🎯 Skills
                                </button>
                                <button
                                    onClick={() => handleResetPassword(user._id)}
                                    style={{
                                        padding: '10px',
                                        background: 'linear-gradient(135deg, #ed8936, #dd6b20)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '10px',
                                        fontSize: '0.8rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        boxShadow: '0 2px 4px rgba(237, 137, 54, 0.3)'
                                    }}
                                    onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                                >
                                    🔑 Reset PW
                                </button>
                                {user._id !== currentUser.id && (
                                    <button
                                        onClick={() => setShowDeleteConfirm(user)}
                                        style={{
                                            padding: '10px',
                                            background: 'linear-gradient(135deg, #f56565, #e53e3e)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '10px',
                                            fontSize: '0.8rem',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            boxShadow: '0 2px 4px rgba(245, 101, 101, 0.3)'
                                        }}
                                        onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                                    >
                                        🗑️ Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* No Results */}
            {filteredUsers.length === 0 && (
                <div style={{
                    textAlign: 'center',
                    padding: '60px 20px',
                    background: 'white',
                    borderRadius: '20px',
                    border: '2px dashed #e2e8f0'
                }}>
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔍</div>
                    <h3 style={{ color: '#2d3748', marginBottom: '10px' }}>No users found</h3>
                    <p style={{ color: '#718096' }}>Try adjusting your search terms</p>
                </div>
            )}

            {/* Edit User Modal */}
            {showEditModal && selectedUser && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    backdropFilter: 'blur(5px)',
                    animation: 'fadeIn 0.3s ease'
                }}>
                    <div style={{
                        background: 'white',
                        padding: '30px',
                        borderRadius: '24px',
                        width: '450px',
                        maxWidth: '90%',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                        animation: 'slideUp 0.3s ease'
                    }}>
                        <style>{`
                            @keyframes slideUp {
                                from {
                                    transform: translateY(20px);
                                    opacity: 0;
                                }
                                to {
                                    transform: translateY(0);
                                    opacity: 1;
                                }
                            }
                        `}</style>

                        <h3 style={{
                            margin: '0 0 20px',
                            fontSize: '1.5rem',
                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Edit User: {selectedUser.name}
                        </h3>
                        
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4a5568' }}>
                                Role
                            </label>
                            <select
                                value={editForm.role}
                                onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '2px solid #e2e8f0',
                                    borderRadius: '12px',
                                    fontSize: '0.95rem',
                                    outline: 'none',
                                    transition: 'all 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            >
                                <option value="user">👤 User</option>
                                <option value="admin">👑 Admin</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4a5568' }}>
                                Skill Credits
                            </label>
                            <input
                                type="number"
                                value={editForm.skillCredits}
                                onChange={(e) => setEditForm({...editForm, skillCredits: parseInt(e.target.value)})}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '2px solid #e2e8f0',
                                    borderRadius: '12px',
                                    fontSize: '0.95rem',
                                    outline: 'none',
                                    transition: 'all 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        <div style={{ marginBottom: '25px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4a5568' }}>
                                Reputation Score
                            </label>
                            <input
                                type="number"
                                value={editForm.reputationScore}
                                onChange={(e) => setEditForm({...editForm, reputationScore: parseInt(e.target.value)})}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '2px solid #e2e8f0',
                                    borderRadius: '12px',
                                    fontSize: '0.95rem',
                                    outline: 'none',
                                    transition: 'all 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setShowEditModal(false)}
                                style={{
                                    padding: '12px 24px',
                                    background: '#edf2f7',
                                    color: '#4a5568',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontSize: '0.95rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.background = '#e2e8f0'}
                                onMouseLeave={(e) => e.target.style.background = '#edf2f7'}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateUser}
                                style={{
                                    padding: '12px 24px',
                                    background: 'linear-gradient(135deg, #48bb78, #38a169)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontSize: '0.95rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 12px rgba(72, 187, 120, 0.3)',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                            >
                                Update User
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Skills Modal */}
            {showSkillsModal && selectedUser && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    backdropFilter: 'blur(5px)',
                    animation: 'fadeIn 0.3s ease'
                }}>
                    <div style={{
                        background: 'white',
                        padding: '30px',
                        borderRadius: '24px',
                        width: '550px',
                        maxWidth: '90%',
                        maxHeight: '80vh',
                        overflowY: 'auto',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                        animation: 'slideUp 0.3s ease'
                    }}>
                        <h3 style={{
                            margin: '0 0 20px',
                            fontSize: '1.5rem',
                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Edit Skills: {selectedUser.name}
                        </h3>
                        
                        {/* Teach Skills Section */}
                        <div style={{ marginBottom: '25px' }}>
                            <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', color: '#4a5568' }}>
                                🎯 Skills to Teach
                            </label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '15px', minHeight: '50px', padding: '10px', background: '#f7fafc', borderRadius: '12px' }}>
                                {skillsForm.teachSkills.map((skill, index) => (
                                    <span key={index} style={{
                                        background: 'linear-gradient(135deg, #48bb78, #38a169)',
                                        color: 'white',
                                        padding: '6px 16px',
                                        borderRadius: '30px',
                                        fontSize: '0.9rem',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        boxShadow: '0 2px 8px rgba(72, 187, 120, 0.2)'
                                    }}>
                                        {skill}
                                        <button
                                            onClick={() => {
                                                const newSkills = [...skillsForm.teachSkills];
                                                newSkills.splice(index, 1);
                                                setSkillsForm({...skillsForm, teachSkills: newSkills});
                                            }}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: 'white',
                                                cursor: 'pointer',
                                                fontSize: '1.2rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                padding: '0 2px'
                                            }}
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                                {skillsForm.teachSkills.length === 0 && (
                                    <span style={{ color: '#a0aec0', padding: '8px' }}>No teaching skills added</span>
                                )}
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input
                                    type="text"
                                    placeholder="Enter a skill to teach"
                                    id="newTeachSkill"
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        border: '2px solid #e2e8f0',
                                        borderRadius: '12px',
                                        fontSize: '0.95rem',
                                        outline: 'none'
                                    }}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            const input = document.getElementById('newTeachSkill');
                                            if (input.value.trim()) {
                                                setSkillsForm({
                                                    ...skillsForm,
                                                    teachSkills: [...skillsForm.teachSkills, input.value.trim()]
                                                });
                                                input.value = '';
                                            }
                                        }
                                    }}
                                />
                                <button
                                    onClick={() => {
                                        const input = document.getElementById('newTeachSkill');
                                        if (input.value.trim()) {
                                            setSkillsForm({
                                                ...skillsForm,
                                                teachSkills: [...skillsForm.teachSkills, input.value.trim()]
                                            });
                                            input.value = '';
                                        }
                                    }}
                                    style={{
                                        padding: '12px 24px',
                                        background: 'linear-gradient(135deg, #48bb78, #38a169)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontSize: '0.95rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                                >
                                    Add
                                </button>
                            </div>
                        </div>

                        {/* Learn Skills Section */}
                        <div style={{ marginBottom: '30px' }}>
                            <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', color: '#4a5568' }}>
                                📚 Skills to Learn
                            </label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '15px', minHeight: '50px', padding: '10px', background: '#f7fafc', borderRadius: '12px' }}>
                                {skillsForm.learnSkills.map((skill, index) => (
                                    <span key={index} style={{
                                        background: 'linear-gradient(135deg, #f56565, #e53e3e)',
                                        color: 'white',
                                        padding: '6px 16px',
                                        borderRadius: '30px',
                                        fontSize: '0.9rem',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        boxShadow: '0 2px 8px rgba(245, 101, 101, 0.2)'
                                    }}>
                                        {skill}
                                        <button
                                            onClick={() => {
                                                const newSkills = [...skillsForm.learnSkills];
                                                newSkills.splice(index, 1);
                                                setSkillsForm({...skillsForm, learnSkills: newSkills});
                                            }}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: 'white',
                                                cursor: 'pointer',
                                                fontSize: '1.2rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                padding: '0 2px'
                                            }}
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                                {skillsForm.learnSkills.length === 0 && (
                                    <span style={{ color: '#a0aec0', padding: '8px' }}>No learning skills added</span>
                                )}
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input
                                    type="text"
                                    placeholder="Enter a skill to learn"
                                    id="newLearnSkill"
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        border: '2px solid #e2e8f0',
                                        borderRadius: '12px',
                                        fontSize: '0.95rem',
                                        outline: 'none'
                                    }}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            const input = document.getElementById('newLearnSkill');
                                            if (input.value.trim()) {
                                                setSkillsForm({
                                                    ...skillsForm,
                                                    learnSkills: [...skillsForm.learnSkills, input.value.trim()]
                                                });
                                                input.value = '';
                                            }
                                        }
                                    }}
                                />
                                <button
                                    onClick={() => {
                                        const input = document.getElementById('newLearnSkill');
                                        if (input.value.trim()) {
                                            setSkillsForm({
                                                ...skillsForm,
                                                learnSkills: [...skillsForm.learnSkills, input.value.trim()]
                                            });
                                            input.value = '';
                                        }
                                    }}
                                    style={{
                                        padding: '12px 24px',
                                        background: 'linear-gradient(135deg, #f56565, #e53e3e)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontSize: '0.95rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                                >
                                    Add
                                </button>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setShowSkillsModal(false)}
                                style={{
                                    padding: '12px 24px',
                                    background: '#edf2f7',
                                    color: '#4a5568',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontSize: '0.95rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.background = '#e2e8f0'}
                                onMouseLeave={(e) => e.target.style.background = '#edf2f7'}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateSkills}
                                style={{
                                    padding: '12px 24px',
                                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontSize: '0.95rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                            >
                                Update Skills
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    backdropFilter: 'blur(5px)',
                    animation: 'fadeIn 0.3s ease'
                }}>
                    <div style={{
                        background: 'white',
                        padding: '30px',
                        borderRadius: '24px',
                        width: '400px',
                        maxWidth: '90%',
                        textAlign: 'center',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                        animation: 'slideUp 0.3s ease'
                    }}>
                        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
                        <h3 style={{ margin: '0 0 10px', color: '#2d3748' }}>Delete User?</h3>
                        <p style={{ color: '#718096', marginBottom: '25px' }}>
                            Are you sure you want to delete <strong>{showDeleteConfirm.name}</strong>?<br />
                            This action cannot be undone.
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button
                                onClick={() => setShowDeleteConfirm(null)}
                                style={{
                                    padding: '12px 24px',
                                    background: '#edf2f7',
                                    color: '#4a5568',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontSize: '0.95rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.background = '#e2e8f0'}
                                onMouseLeave={(e) => e.target.style.background = '#edf2f7'}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeleteUser(showDeleteConfirm._id)}
                                style={{
                                    padding: '12px 24px',
                                    background: 'linear-gradient(135deg, #f56565, #e53e3e)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontSize: '0.95rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 12px rgba(245, 101, 101, 0.3)',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                            >
                                Delete User
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsersList;