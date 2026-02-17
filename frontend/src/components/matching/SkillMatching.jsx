import React, { useState, useEffect } from 'react';

const SkillMatching = ({ user }) => {
    const [potentialMatches, setPotentialMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [requestData, setRequestData] = useState({
        message: '',
        scheduledDate: '',
        sessions: 1
    });

    // Fetch real users from MongoDB
    const fetchPotentialMatches = async () => {
        try {
            setLoading(true);
            setError('');
            console.log('🔄 Fetching potential matches...');
            
            const response = await fetch('http://localhost:5000/api/matching/users');
            const data = await response.json();
            
            if (data.success) {
                // Filter out current user and calculate matches
                const otherUsers = data.users.filter(u => u._id !== user.id);
                
                const matchesWithScores = calculateMatchScores(otherUsers, user);
                setPotentialMatches(matchesWithScores);
                
                console.log(`✅ Found ${otherUsers.length} users, ${matchesWithScores.filter(m => m.matchScore > 0).length} matches`);
            } else {
                setError('Failed to load potential matches: ' + (data.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('❌ Fetch error:', error);
            setError('Error connecting to server.');
        } finally {
            setLoading(false);
        }
    };

    // AI Matching Algorithm - Calculate compatibility scores
    const calculateMatchScores = (otherUsers, currentUser) => {
        return otherUsers.map(otherUser => {
            let matchScore = 0;
            let matchReasons = [];
            let teachableSkills = [];
            let learnableSkills = [];

            // Check if they can teach what I want to learn
            const teachMatch = otherUser.teachSkills.filter(skill => 
                currentUser.learnSkills.includes(skill)
            );
            if (teachMatch.length > 0) {
                matchScore += teachMatch.length * 25;
                matchReasons.push(`Can teach you: ${teachMatch.join(', ')}`);
                teachableSkills = teachMatch;
            }

            // Check if they want to learn what I can teach
            const learnMatch = otherUser.learnSkills.filter(skill => 
                currentUser.teachSkills.includes(skill)
            );
            if (learnMatch.length > 0) {
                matchScore += learnMatch.length * 25;
                matchReasons.push(`Wants to learn your: ${learnMatch.join(', ')}`);
                learnableSkills = learnMatch;
            }

            // Bonus for mutual interests
            const mutualTeach = currentUser.teachSkills.filter(skill =>
                otherUser.teachSkills.includes(skill)
            );
            const mutualLearn = currentUser.learnSkills.filter(skill =>
                otherUser.learnSkills.includes(skill)
            );
            if (mutualTeach.length > 0 || mutualLearn.length > 0) {
                matchScore += 15;
                matchReasons.push('Shared skill interests');
            }

            // Bonus for user reputation
            if (otherUser.reputationScore > 20) {
                matchScore += 10;
                matchReasons.push('Highly rated teacher');
            }

            // Cap score at 100%
            matchScore = Math.min(matchScore, 100);

            return {
                ...otherUser,
                matchScore,
                matchReasons,
                teachableSkills,
                learnableSkills,
                distance: 'Nearby',
                reputation: otherUser.reputationScore || 4.5,
                skillCredits: otherUser.skillCredits || 50
            };
        }).sort((a, b) => b.matchScore - a.matchScore);
    };

    useEffect(() => {
        if (user && user.id) {
            fetchPotentialMatches();
        }
    }, [user]);

    // Filter matches based on search and category
    const filteredMatches = potentialMatches.filter(match => {
        const matchesSearch = searchTerm === '' || 
                            match.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            match.teachSkills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
                            match.learnSkills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesCategory = selectedCategory === 'All Categories' || 
                               match.teachSkills.some(skill => getSkillCategory(skill) === selectedCategory) ||
                               match.learnSkills.some(skill => getSkillCategory(skill) === selectedCategory);
        
        return matchesSearch && matchesCategory;
    });

    const getSkillCategory = (skill) => {
        const techSkills = ['Web Development', 'Programming', 'Python', 'JavaScript', 'App Development', 'Graphic Design'];
        const creativeSkills = ['Video Editing', 'Photography', 'Drawing', 'Music', 'Writing', 'Design'];
        const languageSkills = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Language'];
        
        if (techSkills.some(tech => skill.toLowerCase().includes(tech.toLowerCase()))) return 'Technology';
        if (creativeSkills.some(creative => skill.toLowerCase().includes(creative.toLowerCase()))) return 'Creative';
        if (languageSkills.some(lang => skill.toLowerCase().includes(lang.toLowerCase()))) return 'Languages';
        return 'Other';
    };

    const openRequestModal = (targetUser) => {
        setSelectedUser(targetUser);
        
        // Auto-populate skills they can teach you
        const teachableSkills = targetUser.teachSkills.filter(skill => 
            user.learnSkills.includes(skill)
        );
        
        setRequestData({
            message: `Hi ${targetUser.name}! I'd like to learn ${teachableSkills.join(', ')} from you.`,
            scheduledDate: '',
            sessions: Math.max(1, Math.ceil(teachableSkills.length / 2)),
            selectedSkills: teachableSkills
        });
        
        setShowRequestModal(true);
    };

    const sendSwapRequest = async () => {
        try {
            console.log('🔄 Sending swap request to:', selectedUser.name);
            
            // Calculate credits required (10 credits per skill)
            const creditRequired = requestData.selectedSkills.length * 10;
            
            // Check if user has enough credits
            if (user.skillCredits < creditRequired) {
                alert(`❌ Insufficient credits! You need ${creditRequired} credits but only have ${user.skillCredits}.`);
                return;
            }

            const response = await fetch('http://localhost:5000/api/matching/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fromUserId: user.id,
                    toUserId: selectedUser._id,
                    proposedSkills: requestData.selectedSkills,
                    message: requestData.message,
                    scheduledDate: requestData.scheduledDate || null
                }),
            });
            
            const data = await response.json();
            console.log('📨 Swap request response:', data);
            
            if (data.success) {
                alert(`✅ ${data.message}\n\nRequired credits: ${creditRequired}\nYour balance will be deducted when the skill exchange is completed.`);
                setShowRequestModal(false);
                setSelectedUser(null);
                setRequestData({
                    message: '',
                    scheduledDate: '',
                    sessions: 1
                });
                fetchPotentialMatches(); // Refresh matches
            } else {
                alert(`❌ Failed: ${data.message}`);
            }
        } catch (error) {
            console.error('❌ Swap request error:', error);
            alert('❌ Error sending swap request.');
        }
    };

    const startChat = (userId) => {
        alert(`Chat will open with user. This will be implemented with real chat system.`);
    };

    const viewUserProfile = (userData) => {
        alert(`Opening profile for ${userData.name}\nEmail: ${userData.email}\nCredits: ${userData.skillCredits}\nReputation: ${userData.reputationScore}`);
    };

    // Get user's ongoing exchanges
    const getUserActiveExchanges = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/users/${user.id}/swap-requests`);
            const data = await response.json();
            
            if (data.success) {
                return data.activeExchanges || [];
            }
            return [];
        } catch (error) {
            console.error('Error fetching active exchanges:', error);
            return [];
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not scheduled';
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '200px',
                flexDirection: 'column',
                gap: '10px'
            }}>
                <div style={{ fontSize: '32px' }}>🔄</div>
                <div>Finding skill swap partners...</div>
                <div style={{ fontSize: '14px', color: '#666' }}>Analyzing skill compatibility</div>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            {/* Header Section */}
            <div style={{ 
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                padding: '30px',
                borderRadius: '15px',
                marginBottom: '30px',
                position: 'relative'
            }}>
                <h1 style={{ margin: 0, fontSize: '32px', fontWeight: '700' }}>🎯 Skill Matching</h1>
                <p style={{ margin: '10px 0 0 0', opacity: 0.9, fontSize: '16px' }}>
                    Find partners based on your skills and interests
                </p>
                
                <div style={{ 
                    display: 'flex',
                    gap: '15px',
                    marginTop: '20px',
                    flexWrap: 'wrap'
                }}>
                    <div style={{ 
                        background: 'rgba(255,255,255,0.2)',
                        padding: '10px 20px',
                        borderRadius: '20px',
                        fontWeight: '600'
                    }}>
                        💰 Your Credits: {user.skillCredits}
                    </div>
                    
                    <div style={{ 
                        background: 'rgba(255,255,255,0.2)',
                        padding: '10px 20px',
                        borderRadius: '20px',
                        fontWeight: '600'
                    }}>
                        ⭐ Reputation: {user.reputationScore}
                    </div>
                    
                    <div style={{ 
                        background: 'rgba(255,255,255,0.2)',
                        padding: '10px 20px',
                        borderRadius: '20px',
                        fontWeight: '600'
                    }}>
                        🎯 Skills Listed: {user.teachSkills.length + user.learnSkills.length}
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div style={{
                    background: '#f8d7da',
                    color: '#721c24',
                    padding: '20px',
                    borderRadius: '10px',
                    marginBottom: '20px',
                    border: '1px solid #f5c6cb',
                    fontSize: '16px'
                }}>
                    <strong>❌ Error:</strong> {error}
                    <div style={{ marginTop: '10px' }}>
                        <button 
                            onClick={fetchPotentialMatches}
                            style={{
                                background: '#dc3545',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }}
                        >
                            🔄 Try Again
                        </button>
                    </div>
                </div>
            )}

            {/* Search & Filter Section */}
            <div style={{
                background: 'white',
                padding: '25px',
                borderRadius: '15px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                marginBottom: '30px'
            }}>
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '20px',
                    marginBottom: '20px'
                }}>
                    <div>
                        <div style={{ 
                            background: '#e7f3ff', 
                            padding: '15px',
                            borderRadius: '10px'
                        }}>
                            <strong style={{ display: 'block', marginBottom: '5px', color: '#0066cc' }}>👤 Your Skills to Teach:</strong>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px' }}>
                                {user.teachSkills.map((skill, index) => (
                                    <span key={index} style={{
                                        background: '#d4edda',
                                        color: '#155724',
                                        padding: '5px 10px',
                                        borderRadius: '15px',
                                        fontSize: '13px',
                                        fontWeight: '500'
                                    }}>
                                        🎯 {skill}
                                    </span>
                                ))}
                                {user.teachSkills.length === 0 && (
                                    <span style={{ color: '#666', fontStyle: 'italic' }}>Add skills you can teach</span>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <div style={{ 
                            background: '#fff3cd', 
                            padding: '15px',
                            borderRadius: '10px'
                        }}>
                            <strong style={{ display: 'block', marginBottom: '5px', color: '#856404' }}>📚 Skills You Want to Learn:</strong>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px' }}>
                                {user.learnSkills.map((skill, index) => (
                                    <span key={index} style={{
                                        background: '#f8d7da',
                                        color: '#721c24',
                                        padding: '5px 10px',
                                        borderRadius: '15px',
                                        fontSize: '13px',
                                        fontWeight: '500'
                                    }}>
                                        📚 {skill}
                                    </span>
                                ))}
                                {user.learnSkills.length === 0 && (
                                    <span style={{ color: '#666', fontStyle: 'italic' }}>Add skills you want to learn</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ 
                    display: 'flex', 
                    gap: '15px', 
                    marginTop: '20px',
                    flexWrap: 'wrap'
                }}>
                    <input 
                        type="text" 
                        placeholder="🔍 Search by name or skill..." 
                        style={{ 
                            flex: 1,
                            padding: '12px 15px',
                            border: '2px solid #e0e0e0',
                            borderRadius: '8px',
                            fontSize: '15px',
                            minWidth: '200px'
                        }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    
                    <select 
                        style={{ 
                            padding: '12px 15px',
                            border: '2px solid #e0e0e0',
                            borderRadius: '8px',
                            fontSize: '15px',
                            background: 'white',
                            minWidth: '150px'
                        }}
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option>All Categories</option>
                        <option>Technology</option>
                        <option>Creative</option>
                        <option>Languages</option>
                        <option>Other</option>
                    </select>
                    
                    <button 
                        onClick={fetchPotentialMatches}
                        style={{
                            background: '#007bff',
                            color: 'white',
                            border: 'none',
                            padding: '12px 25px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '15px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        🔄 Refresh Matches
                    </button>
                </div>
            </div>

            {/* Results Header */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '20px'
            }}>
                <div>
                    <h2 style={{ margin: 0, color: '#333' }}>🤝 Recommended Partners</h2>
                    <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
                        AI-powered matches based on your skill profile
                    </p>
                </div>
                <div style={{ 
                    background: '#e7f3ff', 
                    padding: '10px 20px', 
                    borderRadius: '20px',
                    fontSize: '15px',
                    color: '#0066cc',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <span>👥 {filteredMatches.length} users</span>
                    <span>•</span>
                    <span>🎯 {filteredMatches.filter(m => m.matchScore > 0).length} matches</span>
                </div>
            </div>

            {/* Matches List */}
            {filteredMatches.length === 0 ? (
                <div style={{ 
                    padding: '60px 20px', 
                    textAlign: 'center',
                    background: 'white',
                    borderRadius: '15px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    color: '#666'
                }}>
                    <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔍</div>
                    <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>No matching partners found</h3>
                    <p style={{ fontSize: '16px', marginBottom: '25px', maxWidth: '500px', margin: '0 auto 25px auto' }}>
                        Try adjusting your search filters or add more skills to your profile to find better matches.
                    </p>
                    <button 
                        onClick={() => {
                            setSearchTerm('');
                            setSelectedCategory('All Categories');
                        }}
                        style={{
                            background: '#28a745',
                            color: 'white',
                            border: 'none',
                            padding: '12px 30px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '15px',
                            fontWeight: '600'
                        }}
                    >
                        ✨ Clear All Filters
                    </button>
                </div>
            ) : (
                <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                    gap: '20px'
                }}>
                    {filteredMatches.map(match => (
                        <div key={match._id} style={{
                            background: 'white',
                            borderRadius: '15px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            padding: '25px',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            border: match.matchScore > 70 ? '2px solid #28a745' : '1px solid #e9ecef'
                        }}>
                            {/* User Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: '50%',
                                        background: match.matchScore > 70 ? 'linear-gradient(135deg, #28a745, #20c997)' : 
                                                   match.matchScore > 40 ? 'linear-gradient(135deg, #007bff, #17a2b8)' : 
                                                   'linear-gradient(135deg, #6c757d, #adb5bd)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '20px',
                                        fontWeight: 'bold'
                                    }}>
                                        {match.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <h4 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>{match.name}</h4>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
                                            <span style={{ color: '#666' }}>⭐ {match.reputation.toFixed(1)}</span>
                                            <span style={{ color: '#666' }}>•</span>
                                            <span style={{ color: '#666' }}>💰 {match.skillCredits} credits</span>
                                            <span style={{ color: '#666' }}>•</span>
                                            <span style={{ color: '#666' }}>{match.distance}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div style={{
                                    background: match.matchScore > 70 ? '#28a745' : 
                                               match.matchScore > 40 ? '#007bff' : '#6c757d',
                                    color: 'white',
                                    padding: '8px 15px',
                                    borderRadius: '20px',
                                    fontSize: '14px',
                                    fontWeight: '600'
                                }}>
                                    {match.matchScore}% Match
                                </div>
                            </div>

                            {/* Match Reasons */}
                            {match.matchReasons.length > 0 && (
                                <div style={{ 
                                    margin: '15px 0',
                                    padding: '15px',
                                    background: '#f8f9fa',
                                    borderRadius: '10px',
                                    borderLeft: '4px solid #667eea'
                                }}>
                                    <strong style={{ display: 'block', marginBottom: '8px', color: '#333' }}>💡 Why this is a good match:</strong>
                                    <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '14px', color: '#555' }}>
                                        {match.matchReasons.map((reason, index) => (
                                            <li key={index} style={{ marginBottom: '5px' }}>{reason}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Skills Section */}
                            <div style={{ margin: '20px 0' }}>
                                {/* Skills They Can Teach You */}
                                <div style={{ marginBottom: '15px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <strong style={{ color: '#155724', fontSize: '15px' }}>🎯 Can Teach You:</strong>
                                        <span style={{ 
                                            background: '#d4edda', 
                                            color: '#155724',
                                            padding: '3px 10px',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            fontWeight: '600'
                                        }}>
                                            {match.teachableSkills.length} skills
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {match.teachableSkills.map((skill, index) => (
                                            <span key={index} style={{
                                                background: '#28a745',
                                                color: 'white',
                                                padding: '8px 12px',
                                                borderRadius: '20px',
                                                fontSize: '13px',
                                                fontWeight: '500',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '5px'
                                            }}>
                                                <span>✓</span>
                                                {skill}
                                            </span>
                                        ))}
                                        {match.teachableSkills.length === 0 && (
                                            <span style={{ color: '#666', fontStyle: 'italic', fontSize: '14px' }}>
                                                No matching skills to teach
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Skills They Want to Learn */}
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <strong style={{ color: '#721c24', fontSize: '15px' }}>📚 Wants to Learn:</strong>
                                        <span style={{ 
                                            background: '#f8d7da', 
                                            color: '#721c724',
                                            padding: '3px 10px',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            fontWeight: '600'
                                        }}>
                                            {match.learnableSkills.length} skills
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {match.learnableSkills.map((skill, index) => (
                                            <span key={index} style={{
                                                background: '#dc3545',
                                                color: 'white',
                                                padding: '8px 12px',
                                                borderRadius: '20px',
                                                fontSize: '13px',
                                                fontWeight: '500',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '5px'
                                            }}>
                                                <span>✓</span>
                                                {skill}
                                            </span>
                                        ))}
                                        {match.learnableSkills.length === 0 && (
                                            <span style={{ color: '#666', fontStyle: 'italic', fontSize: '14px' }}>
                                                No matching skills to learn
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div style={{ 
                                display: 'flex', 
                                gap: '10px', 
                                marginTop: '20px',
                                borderTop: '1px solid #e9ecef',
                                paddingTop: '20px'
                            }}>
                                <button 
                                    onClick={() => viewUserProfile(match)}
                                    style={{
                                        flex: 1,
                                        background: '#6c757d',
                                        color: 'white',
                                        border: 'none',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    👤 View Profile
                                </button>
                                
                                <button 
                                    onClick={() => startChat(match._id)}
                                    disabled={match.matchScore === 0}
                                    style={{
                                        flex: 1,
                                        background: match.matchScore > 0 ? '#17a2b8' : '#ccc',
                                        color: 'white',
                                        border: 'none',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        cursor: match.matchScore > 0 ? 'pointer' : 'not-allowed',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        opacity: match.matchScore > 0 ? 1 : 0.5
                                    }}
                                >
                                    💬 Chat
                                </button>
                                
                                <button 
                                    onClick={() => openRequestModal(match)}
                                    disabled={match.matchScore === 0 || match.teachableSkills.length === 0}
                                    style={{
                                        flex: 1,
                                        background: match.matchScore > 0 && match.teachableSkills.length > 0 ? '#28a745' : '#ccc',
                                        color: 'white',
                                        border: 'none',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        cursor: match.matchScore > 0 && match.teachableSkills.length > 0 ? 'pointer' : 'not-allowed',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        opacity: match.matchScore > 0 && match.teachableSkills.length > 0 ? 1 : 0.5
                                    }}
                                >
                                    🤝 Swap Request
                                </button>
                            </div>

                            {/* Credit Info */}
                            {match.teachableSkills.length > 0 && (
                                <div style={{ 
                                    marginTop: '15px',
                                    padding: '10px',
                                    background: '#fff3cd',
                                    borderRadius: '8px',
                                    fontSize: '13px',
                                    color: '#856404',
                                    textAlign: 'center'
                                }}>
                                    <strong>💰 Cost:</strong> {match.teachableSkills.length * 10} credits 
                                    ({match.teachableSkills.length} skills × 10 credits each)
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Swap Request Modal */}
            {showRequestModal && selectedUser && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'white',
                        padding: '30px',
                        borderRadius: '15px',
                        width: '500px',
                        maxWidth: '90%',
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }}>
                        <h3 style={{ marginBottom: '20px' }}>
                            🤝 Send Swap Request to {selectedUser.name}
                        </h3>
                        
                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ 
                                background: '#f8f9fa', 
                                padding: '15px',
                                borderRadius: '10px',
                                marginBottom: '15px'
                            }}>
                                <strong style={{ display: 'block', marginBottom: '10px' }}>Selected Skills to Learn:</strong>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {requestData.selectedSkills?.map((skill, index) => (
                                        <span key={index} style={{
                                            background: '#28a745',
                                            color: 'white',
                                            padding: '8px 12px',
                                            borderRadius: '20px',
                                            fontSize: '14px'
                                        }}>
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                                <div style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>
                                    <strong>Credits Required:</strong> {requestData.selectedSkills?.length * 10} 
                                    (Deducted upon completion)
                                </div>
                            </div>
                            
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                                    Message to {selectedUser.name}
                                </label>
                                <textarea
                                    value={requestData.message}
                                    onChange={(e) => setRequestData({...requestData, message: e.target.value})}
                                    placeholder="Write a friendly message..."
                                    rows="4"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '2px solid #e0e0e0',
                                        fontSize: '14px',
                                        resize: 'vertical'
                                    }}
                                />
                            </div>
                            
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                                    Preferred Session Date (Optional)
                                </label>
                                <input
                                    type="datetime-local"
                                    value={requestData.scheduledDate}
                                    onChange={(e) => setRequestData({...requestData, scheduledDate: e.target.value})}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        borderRadius: '8px',
                                        border: '2px solid #e0e0e0',
                                        fontSize: '14px'
                                    }}
                                />
                            </div>
                            
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                                    Estimated Sessions Needed
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={requestData.sessions}
                                    onChange={(e) => setRequestData({...requestData, sessions: parseInt(e.target.value) || 1})}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        borderRadius: '8px',
                                        border: '2px solid #e0e0e0',
                                        fontSize: '14px'
                                    }}
                                />
                                <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                                    Number of sessions to complete these skills
                                </div>
                            </div>
                        </div>
                        
                        <div style={{ 
                            background: '#e7f3ff', 
                            padding: '15px',
                            borderRadius: '10px',
                            marginBottom: '20px',
                            fontSize: '14px'
                        }}>
                            <strong>💡 How it works:</strong>
                            <ol style={{ margin: '10px 0 0 20px', padding: 0 }}>
                                <li>Send request to {selectedUser.name}</li>
                                <li>They accept and schedule sessions</li>
                                <li>Complete skill learning sessions</li>
                                <li>Credits transferred upon completion</li>
                                <li>Both users rate the experience</li>
                            </ol>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button 
                                onClick={() => {
                                    setShowRequestModal(false);
                                    setSelectedUser(null);
                                }}
                                style={{
                                    background: '#6c757d',
                                    color: 'white',
                                    border: 'none',
                                    padding: '12px 25px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '600'
                                }}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={sendSwapRequest}
                                style={{
                                    background: '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    padding: '12px 25px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '600'
                                }}
                            >
                                Send Swap Request
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SkillMatching;