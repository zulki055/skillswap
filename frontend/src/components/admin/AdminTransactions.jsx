import React, { useState, useEffect } from 'react';

const AdminTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState({
        totalCredits: 0,
        totalEarned: 0,
        totalSpent: 0,
        totalTransactions: 0
    });

    useEffect(() => {
        fetchAllTransactions();
    }, []);

    const fetchAllTransactions = async () => {
        try {
            // You'll need to create this endpoint
            const response = await fetch('http://localhost:5000/api/admin/transactions/all');
            const data = await response.json();
            if (data.success) {
                setTransactions(data.transactions);
                setStats(data.stats);
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredTransactions = transactions.filter(t => {
        const matchesFilter = filter === 'all' || t.type === filter;
        const matchesSearch = 
            t.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.relatedUserName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.description?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '40px' }}>Loading transactions...</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ marginBottom: '20px' }}>💰 Transaction Monitor</h2>

            {/* Stats Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                marginBottom: '30px'
            }}>
                <div style={{
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    padding: '20px',
                    borderRadius: '10px',
                    color: 'white'
                }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalTransactions}</div>
                    <div>Total Transactions</div>
                </div>
                <div style={{
                    background: 'linear-gradient(135deg, #48bb78, #38a169)',
                    padding: '20px',
                    borderRadius: '10px',
                    color: 'white'
                }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalCredits}</div>
                    <div>Total Credits in System</div>
                </div>
                <div style={{
                    background: 'linear-gradient(135deg, #f6ad55, #ed8936)',
                    padding: '20px',
                    borderRadius: '10px',
                    color: 'white'
                }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalEarned}</div>
                    <div>Total Credits Earned</div>
                </div>
                <div style={{
                    background: 'linear-gradient(135deg, #fc8181, #f56565)',
                    padding: '20px',
                    borderRadius: '10px',
                    color: 'white'
                }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalSpent}</div>
                    <div>Total Credits Spent</div>
                </div>
            </div>

            {/* Filters */}
            <div style={{
                display: 'flex',
                gap: '15px',
                marginBottom: '20px',
                flexWrap: 'wrap'
            }}>
                <input
                    type="text"
                    placeholder="Search by user or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        flex: 1,
                        padding: '10px',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        minWidth: '250px'
                    }}
                />
                
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    style={{
                        padding: '10px',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        background: 'white'
                    }}
                >
                    <option value="all">All Transactions</option>
                    <option value="earned">Earned</option>
                    <option value="spent">Spent</option>
                    <option value="bonus">Bonus</option>
                    <option value="transfer">Transfer</option>
                </select>
            </div>

            {/* Transactions Table */}
            <div style={{
                background: 'white',
                borderRadius: '10px',
                overflow: 'auto',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                    <thead>
                        <tr style={{ background: '#f7fafc', borderBottom: '2px solid #e2e8f0' }}>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Date</th>
                            <th style={{ padding: '15px', textAlign: 'left' }}>User</th>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Type</th>
                            <th style={{ padding: '15px', textAlign: 'right' }}>Amount</th>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Description</th>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Related User</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.map(t => (
                            <tr key={t._id} style={{ borderBottom: '1px solid #edf2f7' }}>
                                <td style={{ padding: '15px', fontSize: '0.9rem' }}>{formatDate(t.createdAt)}</td>
                                <td style={{ padding: '15px', fontWeight: '600' }}>{t.userName}</td>
                                <td style={{ padding: '15px' }}>
                                    <span style={{
                                        background: t.type === 'earned' ? '#c6f6d5' : 
                                                   t.type === 'spent' ? '#fed7d7' : 
                                                   t.type === 'bonus' ? '#feebc8' : '#e2e8f0',
                                        color: t.type === 'earned' ? '#22543d' : 
                                               t.type === 'spent' ? '#9b2c2c' : 
                                               t.type === 'bonus' ? '#975a16' : '#4a5568',
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        fontSize: '0.8rem',
                                        fontWeight: '600'
                                    }}>
                                        {t.type}
                                    </span>
                                </td>
                                <td style={{ 
                                    padding: '15px', 
                                    textAlign: 'right',
                                    fontWeight: '600',
                                    color: t.amount > 0 ? '#48bb78' : '#f56565'
                                }}>
                                    {t.amount > 0 ? '+' : ''}{t.amount}
                                </td>
                                <td style={{ padding: '15px', fontSize: '0.9rem' }}>{t.description}</td>
                                <td style={{ padding: '15px' }}>{t.relatedUserName || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminTransactions;