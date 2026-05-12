import React, { useState, useEffect } from 'react';

const AdminSkillsManagement = () => {
    const [allSkills, setAllSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSkill, setSelectedSkill] = useState(null);
    const [skillStats, setSkillStats] = useState(null);

    useEffect(() => {
        fetchAllSkills();
    }, []);

    const fetchAllSkills = async () => {
        try {
            // You'll need to create this endpoint
            const response = await fetch('http://localhost:5000/api/admin/skills/all');
            const data = await response.json();
            if (data.success) {
                setAllSkills(data.skills);
                setSkillStats(data.stats);
            }
        } catch (error) {
            console.error('Error fetching skills:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveSkill = async (skillName) => {
        if (!window.confirm(`Are you sure you want to remove "${skillName}" from all users?`)) {
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/admin/skills/remove', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ skill: skillName })
            });
            const data = await response.json();
            if (data.success) {
                alert('✅ Skill removed successfully');
                fetchAllSkills();
            }
        } catch (error) {
            console.error('Error removing skill:', error);
        }
    };

    const filteredSkills = allSkills.filter(skill => 
        skill.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '40px' }}>Loading skills...</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ marginBottom: '20px' }}>🎯 Skill Management</h2>

            {/* Stats Cards */}
            {skillStats && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '20px',
                    marginBottom: '30px'
                }}>
                    <div style={{
                        background: '#ebf8ff',
                        padding: '20px',
                        borderRadius: '10px',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📚</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{skillStats.totalSkills}</div>
                        <div>Total Unique Skills</div>
                    </div>
                    <div style={{
                        background: '#f0fff4',
                        padding: '20px',
                        borderRadius: '10px',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🎯</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{skillStats.mostTaught}</div>
                        <div>Most Taught Skill</div>
                    </div>
                    <div style={{
                        background: '#fff5f5',
                        padding: '20px',
                        borderRadius: '10px',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📖</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{skillStats.mostLearned}</div>
                        <div>Most Wanted Skill</div>
                    </div>
                </div>
            )}

            {/* Search Bar */}
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Search skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '0.95rem'
                    }}
                />
            </div>

            {/* Skills Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '15px'
            }}>
                {filteredSkills.map(skill => (
                    <div key={skill.name} style={{
                        background: 'white',
                        borderRadius: '10px',
                        padding: '20px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                        border: '1px solid #e2e8f0'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <h3 style={{ margin: 0, color: '#2d3748' }}>{skill.name}</h3>
                            <span style={{
                                background: '#e2e8f0',
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '0.8rem',
                                fontWeight: '600'
                            }}>
                                {skill.count} users
                            </span>
                        </div>
                        
                        <div style={{ marginBottom: '10px' }}>
                            <div style={{ fontSize: '0.9rem', color: '#4a5568' }}>
                                <span style={{ color: '#48bb78', fontWeight: '600' }}>Teach:</span> {skill.teachCount || 0}
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#4a5568' }}>
                                <span style={{ color: '#f56565', fontWeight: '600' }}>Learn:</span> {skill.learnCount || 0}
                            </div>
                        </div>

                        <button
                            onClick={() => handleRemoveSkill(skill.name)}
                            style={{
                                width: '100%',
                                padding: '8px',
                                background: '#f56565',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            Remove Skill
                        </button>
                    </div>
                ))}
            </div>

            {filteredSkills.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>
                    No skills found matching your search.
                </div>
            )}
        </div>
    );
};

export default AdminSkillsManagement;