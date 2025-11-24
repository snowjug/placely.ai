import { useState, useEffect } from 'react';
import { Code, ExternalLink } from 'lucide-react';

export default function PracticeArena() {
    const [targetRole, setTargetRole] = useState('');
    const [targetCompany, setTargetCompany] = useState('');
    const [hasTarget, setHasTarget] = useState(false);

    useEffect(() => {
        const storedRole = localStorage.getItem('targetRole');
        const storedCompany = localStorage.getItem('targetCompany');

        if (storedRole && storedCompany) {
            setTargetRole(storedRole);
            setTargetCompany(storedCompany);
            setHasTarget(true);
        }
    }, []);

    // Coding questions with LeetCode links
    const codingQuestions = [
        {
            title: 'Two Sum',
            category: 'Array',
            difficulty: 'Easy',
            link: 'https://leetcode.com/problems/two-sum/'
        },
        {
            title: 'Reverse Linked List',
            category: 'Linked List',
            difficulty: 'Easy',
            link: 'https://leetcode.com/problems/reverse-linked-list/'
        },
        {
            title: 'Valid Parentheses',
            category: 'Stack',
            difficulty: 'Easy',
            link: 'https://leetcode.com/problems/valid-parentheses/'
        },
        {
            title: 'Merge Two Sorted Lists',
            category: 'Linked List',
            difficulty: 'Easy',
            link: 'https://leetcode.com/problems/merge-two-sorted-lists/'
        },
        {
            title: 'Binary Tree Inorder Traversal',
            category: 'Tree',
            difficulty: 'Easy',
            link: 'https://leetcode.com/problems/binary-tree-inorder-traversal/'
        },
        {
            title: 'Maximum Subarray',
            category: 'Array',
            difficulty: 'Medium',
            link: 'https://leetcode.com/problems/maximum-subarray/'
        },
        {
            title: 'Longest Substring Without Repeating Characters',
            category: 'String',
            difficulty: 'Medium',
            link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/'
        },
        {
            title: 'Container With Most Water',
            category: 'Array',
            difficulty: 'Medium',
            link: 'https://leetcode.com/problems/container-with-most-water/'
        },
        {
            title: 'Merge Intervals',
            category: 'Array',
            difficulty: 'Medium',
            link: 'https://leetcode.com/problems/merge-intervals/'
        },
        {
            title: 'Coin Change',
            category: 'Dynamic Programming',
            difficulty: 'Medium',
            link: 'https://leetcode.com/problems/coin-change/'
        }
    ];

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Easy': return '#059669';
            case 'Medium': return '#F59E0B';
            case 'Hard': return '#DC2626';
            default: return '#6b7280';
        }
    };

    if (!hasTarget) {
        return (
            <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', paddingTop: '4rem' }} className="fade-in">
                <div style={{
                    backgroundColor: 'white',
                    padding: '3rem',
                    borderRadius: '1.5rem',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>💻</div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: '600', marginBottom: '1rem' }}>Set Target on Dashboard</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.6' }}>
                        Please set your target company and role from the dashboard to access personalized coding questions.
                    </p>
                    <button
                        onClick={() => window.location.href = '/dashboard'}
                        className="btn btn-primary"
                        style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }} className="fade-in">
            <h1 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '0.5rem' }}>Practice Arena</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.05rem' }}>
                Preparing for <strong>{targetRole}</strong> at <strong>{targetCompany}</strong>
            </p>

            <div style={{
                backgroundColor: '#EFF6FF',
                borderRadius: '1rem',
                padding: '1.25rem',
                marginBottom: '2rem',
                border: '1px solid #BFDBFE'
            }}>
                <strong style={{ color: '#1E40AF' }}>Agent-Generated Guidance:</strong>
                <span style={{ color: '#1E40AF', marginLeft: '0.5rem' }}>
                    The following content is AI-generated. Always verify critical information.
                </span>
            </div>

            {/* Code Playground */}
            <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '1.25rem',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                marginBottom: '2rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <Code size={28} style={{ color: 'var(--primary-color)' }} />
                    <div>
                        <h2 style={{ fontSize: '1.3rem', fontWeight: '600' }}>Code Playground</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                            Use our AI-powered editor for your own coding problems.
                        </p>
                    </div>
                </div>
                <a
                    href="https://codesandbox.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <Code size={18} />
                    Start Coding
                </a>
            </div>

            {/* Coding Questions */}
            <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '1.25rem',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
            }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.5rem' }}>Coding Questions</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    Select a question to start practicing.
                </p>

                <div style={{ display: 'grid', gap: '0.75rem' }}>
                    {codingQuestions.map((question, idx) => (
                        <a
                            key={idx}
                            href={question.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '1.25rem',
                                border: '1px solid var(--border-color)',
                                borderRadius: '0.75rem',
                                textDecoration: 'none',
                                color: 'inherit',
                                transition: 'all 0.2s',
                                backgroundColor: 'white'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'var(--primary-color)';
                                e.currentTarget.style.backgroundColor = '#fafafa';
                                e.currentTarget.style.transform = 'translateX(4px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'var(--border-color)';
                                e.currentTarget.style.backgroundColor = 'white';
                                e.currentTarget.style.transform = 'translateX(0)';
                            }}
                        >
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>{question.title}</h3>
                                    <ExternalLink size={16} style={{ color: 'var(--text-secondary)' }} />
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        backgroundColor: '#F3F4F6',
                                        borderRadius: '0.375rem',
                                        color: '#4B5563',
                                        fontWeight: '500'
                                    }}>
                                        {question.category}
                                    </span>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        backgroundColor: `${getDifficultyColor(question.difficulty)}15`,
                                        borderRadius: '0.375rem',
                                        color: getDifficultyColor(question.difficulty),
                                        fontWeight: '600'
                                    }}>
                                        {question.difficulty}
                                    </span>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
