import React, { useState, useEffect } from 'react';
import UserManagement from '../components/admin/UserManagement';
import AdminUsersList from '../components/admin/AdminUsersList';
import AdminSkillsManagement from '../components/admin/AdminSkillsManagement';
import AdminTransactions from '../components/admin/AdminTransactions';
import AdminSettings from '../components/admin/AdminSettings';
import AdminReports from '../components/admin/AdminReports';
import ReviewList from '../components/reviews/ReviewList';
import { 
  LayoutDashboard, 
  Users, 
  Target, 
  CreditCard, 
  Star, 
  BarChart3, 
  Settings, 
  LogOut,
  TrendingUp,
  MessageCircle,
  ArrowRight,
  Activity,
  Zap,
  Shield,
  Crown,
  ChevronRight,
  Sparkles
} from 'lucide-react';

const AdminDashboard = ({ user, onLogout }) => {
    const [activeModule, setActiveModule] = useState('overview');
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    useEffect(() => {
        fetchAdminStats();
    }, []);

    const fetchAdminStats = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/admin/stats');
            const data = await response.json();
            if (data.success) {
                setStats(data.stats);
            }
        } catch (error) {
            console.error('Error fetching admin stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const adminModules = [
        {
            id: 'overview',
            title: 'Overview',
            description: 'Platform analytics',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            icon: LayoutDashboard
        },
        {
            id: 'users',
            title: 'Users',
            description: 'Manage users & roles',
            gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
            icon: Users
        },
        {
            id: 'skills',
            title: 'Skills',
            description: 'Skill marketplace',
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            icon: Target
        },
        {
            id: 'transactions',
            title: 'Transactions',
            description: 'Credit movements',
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            icon: CreditCard
        },
        {
            id: 'reviews',
            title: 'Reviews',
            description: 'User feedback',
            gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            icon: Star
        },
        {
            id: 'reports',
            title: 'Reports',
            description: 'Analytics & insights',
            gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            icon: BarChart3
        },
        {
            id: 'settings',
            title: 'Settings',
            description: 'System config',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            icon: Settings
        }
    ];

    const StatCard = ({ icon: Icon, title, value, subtitle, gradient, trend }) => (
        <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
        }}
        >
            <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '100px',
                height: '100px',
                background: gradient,
                borderRadius: '50%',
                opacity: 0.15,
                filter: 'blur(20px)'
            }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    background: gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)'
                }}>
                    <Icon size={28} color="white" />
                </div>
                {trend && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        background: trend > 0 ? 'rgba(72, 187, 120, 0.1)' : 'rgba(245, 101, 101, 0.1)',
                        color: trend > 0 ? '#48bb78' : '#f56565',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                    }}>
                        <TrendingUp size={14} style={{ transform: trend < 0 ? 'rotate(180deg)' : 'none' }} />
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>
            
            <div style={{ 
                fontSize: '2.5rem', 
                fontWeight: '800',
                background: gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: 1,
                marginBottom: '8px'
            }}>
                {value || 0}
            </div>
            <div style={{ color: '#1a202c', fontWeight: '600', fontSize: '1rem', marginBottom: '4px' }}>
                {title}
            </div>
            <div style={{ color: '#718096', fontSize: '0.85rem' }}>
                {subtitle}
            </div>
        </div>
    );

    const QuickActionCard = ({ icon: Icon, title, description, gradient, onClick }) => (
        <div 
            onClick={onClick}
            style={{
                background: 'white',
                borderRadius: '16px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: '1px solid #e2e8f0',
                position: 'relative',
                overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = gradient.split(' ')[2];
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.12)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '4px',
                height: '100%',
                background: gradient
            }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Icon size={22} color="white" />
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: '#1a202c', fontSize: '0.95rem' }}>{title}</div>
                    <div style={{ color: '#718096', fontSize: '0.8rem' }}>{description}</div>
                </div>
                <ChevronRight size={18} color="#cbd5e0" />
            </div>
        </div>
    );

    const ActivityItem = ({ icon: Icon, title, time, gradient }) => (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: '14px',
            borderRadius: '12px',
            transition: 'all 0.2s',
            cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f7fafc';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
        }}
        >
            <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Icon size={18} color="white" />
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '500', color: '#1a202c', fontSize: '0.9rem' }}>{title}</div>
                <div style={{ color: '#a0aec0', fontSize: '0.75rem' }}>{time}</div>
            </div>
        </div>
    );

    const renderModule = () => {
        if (activeModule === 'overview') {
            const moduleComponents = {
                users: <AdminUsersList currentUser={user} />,
                skills: <AdminSkillsManagement />,
                transactions: <AdminTransactions />,
                reviews: <ReviewList currentUser={user} />,
                reports: <AdminReports />,
                settings: <AdminSettings />
            };

            return (
                <div>
                    {/* Stats Grid */}
                    <div style={{ marginBottom: '32px' }}>
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '12px', 
                            marginBottom: '24px' 
                        }}>
                            <div style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: '#48bb78',
                                animation: 'pulse 2s infinite'
                            }} />
                            <h2 style={{ 
                                margin: 0, 
                                fontSize: '1.5rem', 
                                fontWeight: '700',
                                color: '#1a202c'
                            }}>
                                Platform Overview
                            </h2>
                        </div>
                        
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                            gap: '20px'
                        }}>
                            <StatCard 
                                icon={Users}
                                title="Total Users"
                                value={stats?.totalUsers}
                                subtitle={`${stats?.adminUsers || 0} Admins • ${stats?.regularUsers || 0} Members`}
                                gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                                trend={12}
                            />
                            <StatCard 
                                icon={Activity}
                                title="Total Swaps"
                                value={stats?.totalSwapRequests}
                                subtitle={`${stats?.pendingRequests || 0} pending • ${stats?.acceptedRequests || 0} completed`}
                                gradient="linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
                                trend={8}
                            />
                            <StatCard 
                                icon={MessageCircle}
                                title="Sessions"
                                value={stats?.totalSessions}
                                subtitle={`${stats?.totalChats || 0} active chats`}
                                gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                                trend={24}
                            />
                            <StatCard 
                                icon={Star}
                                title="Reviews"
                                value={stats?.totalReviews}
                                subtitle={`${stats?.totalSkillProgress || 0} skill verifications`}
                                gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
                                trend={-3}
                            />
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div style={{ marginBottom: '32px' }}>
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '12px', 
                            marginBottom: '20px' 
                        }}>
                            <Zap size={20} color="#f6ad55" />
                            <h2 style={{ 
                                margin: 0, 
                                fontSize: '1.3rem', 
                                fontWeight: '700',
                                color: '#1a202c'
                            }}>
                                Quick Actions
                            </h2>
                        </div>
                        
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: '16px'
                        }}>
                            <QuickActionCard 
                                icon={Users}
                                title="Manage Users"
                                description="View, edit, and manage user accounts"
                                gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                                onClick={() => setActiveModule('users')}
                            />
                            <QuickActionCard 
                                icon={CreditCard}
                                title="View Transactions"
                                description="Monitor all credit transactions"
                                gradient="linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
                                onClick={() => setActiveModule('transactions')}
                            />
                            <QuickActionCard 
                                icon={Star}
                                title="Review Feedback"
                                description="Monitor platform reviews"
                                gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
                                onClick={() => setActiveModule('reviews')}
                            />
                            <QuickActionCard 
                                icon={Target}
                                title="Skill Management"
                                description="Manage skills marketplace"
                                gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                                onClick={() => setActiveModule('skills')}
                            />
                            <QuickActionCard 
                                icon={BarChart3}
                                title="Analytics Reports"
                                description="View detailed analytics"
                                gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                                onClick={() => setActiveModule('reports')}
                            />
                            <QuickActionCard 
                                icon={Settings}
                                title="System Settings"
                                description="Configure platform settings"
                                gradient="linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
                                onClick={() => setActiveModule('settings')}
                            />
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div>
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '12px', 
                            marginBottom: '20px' 
                        }}>
                            <Activity size={20} color="#667eea" />
                            <h2 style={{ 
                                margin: 0, 
                                fontSize: '1.3rem', 
                                fontWeight: '700',
                                color: '#1a202c'
                            }}>
                                Recent Activity
                            </h2>
                        </div>
                        
                        <div style={{
                            background: 'white',
                            borderRadius: '20px',
                            padding: '8px',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                            border: '1px solid #e2e8f0'
                        }}>
                            <ActivityItem 
                                icon={Users}
                                title="New user registration"
                                time="2 minutes ago"
                                gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                            />
                            <ActivityItem 
                                icon={Activity}
                                title="Skill swap request created"
                                time="15 minutes ago"
                                gradient="linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
                            />
                            <ActivityItem 
                                icon={Star}
                                title="New 5-star review received"
                                time="1 hour ago"
                                gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
                            />
                            <ActivityItem 
                                icon={CreditCard}
                                title="Credit transaction completed"
                                time="3 hours ago"
                                gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                            />
                        </div>
                    </div>
                </div>
            );
        }

        const moduleComponents = {
            users: <AdminUsersList currentUser={user} />,
            skills: <AdminSkillsManagement />,
            transactions: <AdminTransactions />,
            reviews: <ReviewList currentUser={user} />,
            reports: <AdminReports />,
            settings: <AdminSettings />
        };

        const currentModule = adminModules.find(m => m.id === activeModule);
        
        return (
            <div style={{
                background: 'white',
                borderRadius: '24px',
                padding: '32px',
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.08)',
                border: '1px solid #e2e8f0',
                animation: 'fadeIn 0.3s ease'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    marginBottom: '28px',
                    paddingBottom: '20px',
                    borderBottom: '2px solid #f7fafc'
                }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '14px',
                        background: currentModule?.gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {currentModule && <currentModule.icon size={24} color="white" />}
                    </div>
                    <div>
                        <h2 style={{ 
                            margin: 0, 
                            fontSize: '1.4rem', 
                            fontWeight: '700',
                            color: '#1a202c'
                        }}>
                            {currentModule?.title}
                        </h2>
                        <p style={{ margin: 0, color: '#718096', fontSize: '0.9rem' }}>
                            {currentModule?.description}
                        </p>
                    </div>
                </div>
                {moduleComponents[activeModule]}
            </div>
        );
    };

    const currentModule = adminModules.find(m => m.id === activeModule);

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Decorations */}
            <div style={{
                position: 'fixed',
                top: '-200px',
                right: '-200px',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'fixed',
                bottom: '-100px',
                left: '-100px',
                width: '400px',
                height: '400px',
                background: 'radial-gradient(circle, rgba(17, 153, 142, 0.08) 0%, transparent 70%)',
                borderRadius: '50%',
                pointerEvents: 'none'
            }} />

            {/* Main Layout */}
            <div style={{ display: 'flex', minHeight: '100vh' }}>
                {/* Sidebar */}
                <div style={{
                    width: sidebarCollapsed ? '80px' : '280px',
                    background: 'linear-gradient(180deg, #1a202c 0%, #2d3748 100%)',
                    padding: '24px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    height: '100vh',
                    boxShadow: '4px 0 30px rgba(0, 0, 0, 0.15)',
                    zIndex: 100
                }}>
                    {/* Logo */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        padding: '0 8px',
                        marginBottom: '40px'
                    }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '14px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)',
                            flexShrink: 0
                        }}>
                            <Sparkles size={24} color="white" />
                        </div>
                        {!sidebarCollapsed && (
                            <div>
                                <div style={{ 
                                    color: 'white', 
                                    fontWeight: '800', 
                                    fontSize: '1.2rem',
                                    letterSpacing: '-0.5px'
                                }}>
                                    SkillSwap
                                </div>
                                <div style={{ 
                                    color: 'rgba(255,255,255,0.5)', 
                                    fontSize: '0.7rem',
                                    fontWeight: '600',
                                    letterSpacing: '1px'
                                }}>
                                    ADMIN PANEL
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Navigation */}
                    <nav style={{ flex: 1 }}>
                        {adminModules.map((module) => {
                            const Icon = module.icon;
                            const isActive = activeModule === module.id;
                            
                            return (
                                <div
                                    key={module.id}
                                    onClick={() => setActiveModule(module.id)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '14px',
                                        padding: sidebarCollapsed ? '14px' : '14px 18px',
                                        marginBottom: '8px',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        transition: 'all 0.25s ease',
                                        background: isActive 
                                            ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%)'
                                            : 'transparent',
                                        border: isActive ? '1px solid rgba(102, 126, 234, 0.3)' : '1px solid transparent',
                                        justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.background = 'transparent';
                                        }
                                    }}
                                >
                                    {isActive && (
                                        <div style={{
                                            position: 'absolute',
                                            left: 0,
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            width: '4px',
                                            height: '24px',
                                            background: '#667eea',
                                            borderRadius: '0 4px 4px 0'
                                        }} />
                                    )}
                                    <Icon 
                                        size={20} 
                                        color={isActive ? '#667eea' : 'rgba(255,255,255,0.6)'} 
                                        style={{ flexShrink: 0 }}
                                    />
                                    {!sidebarCollapsed && (
                                        <div>
                                            <div style={{ 
                                                color: isActive ? 'white' : 'rgba(255,255,255,0.7)', 
                                                fontWeight: isActive ? '600' : '500',
                                                fontSize: '0.9rem'
                                            }}>
                                                {module.title}
                                            </div>
                                            <div style={{ 
                                                color: 'rgba(255,255,255,0.4)', 
                                                fontSize: '0.7rem',
                                                display: 'none'
                                            }}>
                                                {module.description}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </nav>

                    {/* User Profile & Logout */}
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
                        {!sidebarCollapsed && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px',
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '12px',
                                marginBottom: '12px'
                            }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: '700',
                                    color: 'white',
                                    fontSize: '0.9rem'
                                }}>
                                    {user.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div style={{ flex: 1, overflow: 'hidden' }}>
                                    <div style={{ 
                                        color: 'white', 
                                        fontWeight: '600', 
                                        fontSize: '0.85rem',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        {user.name}
                                    </div>
                                    <div style={{ 
                                        color: '#667eea', 
                                        fontSize: '0.7rem',
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}>
                                        <Crown size={10} /> Administrator
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <button 
                            onClick={onLogout}
                            style={{ 
                                width: '100%',
                                padding: sidebarCollapsed ? '14px' : '14px 18px',
                                background: 'rgba(245, 101, 101, 0.1)',
                                border: '1px solid rgba(245, 101, 101, 0.3)',
                                borderRadius: '12px',
                                color: '#fc8181',
                                fontWeight: '600',
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: sidebarCollapsed ? 'center' : 'center',
                                gap: '10px',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(245, 101, 101, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(245, 101, 101, 0.1)';
                            }}
                        >
                            <LogOut size={18} />
                            {!sidebarCollapsed && 'Sign Out'}
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div style={{ 
                    flex: 1, 
                    padding: '32px',
                    marginLeft: sidebarCollapsed ? '80px' : '280px',
                    overflowY: 'auto',
                    minHeight: '100vh',
                    transition: 'margin-left 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}>
                    {/* Header */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '32px'
                    }}>
                        <div>
                            <h1 style={{ 
                                margin: 0, 
                                fontSize: '1.8rem', 
                                fontWeight: '800',
                                color: '#1a202c',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}>
                                {activeModule === 'overview' ? (
                                    <>
                                        <span style={{
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent'
                                        }}>
                                            Dashboard
                                        </span>
                                        <div style={{
                                            padding: '6px 14px',
                                            background: 'rgba(72, 187, 120, 0.1)',
                                            borderRadius: '20px',
                                            fontSize: '0.8rem',
                                            fontWeight: '600',
                                            color: '#48bb78',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}>
                                            <span style={{
                                                width: '6px',
                                                height: '6px',
                                                borderRadius: '50%',
                                                background: '#48bb78',
                                                animation: 'pulse 2s infinite'
                                            }} />
                                            All Systems Operational
                                        </div>
                                    </>
                                ) : (
                                    <span style={{
                                        background: currentModule?.gradient,
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent'
                                    }}>
                                        {currentModule?.title}
                                    </span>
                                )}
                            </h1>
                            <p style={{ 
                                margin: '8px 0 0 0', 
                                color: '#718096',
                                fontSize: '0.95rem'
                            }}>
                                Welcome back! Here's what's happening with your platform.
                            </p>
                        </div>

                        {/* Header Actions */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                padding: '10px 16px',
                                background: 'white',
                                borderRadius: '12px',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                border: '1px solid #e2e8f0'
                            }}>
                                <Shield size={16} color="#48bb78" />
                                <span style={{ fontSize: '0.85rem', color: '#4a5568', fontWeight: '500' }}>
                                    Secure Mode
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    {renderModule()}
                </div>
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                * {
                    scrollbar-width: thin;
                    scrollbar-color: #cbd5e0 transparent;
                }
                *::-webkit-scrollbar {
                    width: 6px;
                }
                *::-webkit-scrollbar-track {
                    background: transparent;
                }
                *::-webkit-scrollbar-thumb {
                    background: #cbd5e0;
                    border-radius: 3px;
                }
                *::-webkit-scrollbar-thumb:hover {
                    background: #a0aec0;
                }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
