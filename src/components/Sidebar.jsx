import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, FileText, BookOpen, Award, Moon, Sun, Menu, X } from 'lucide-react';

export default function Sidebar() {
    const location = useLocation();
    const [darkMode, setDarkMode] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        // Check for saved theme preference or default to light mode
        const savedTheme = localStorage.getItem('theme') || 'light';
        setDarkMode(savedTheme === 'dark');
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, []);

    useEffect(() => {
        // Close mobile menu when route changes
        setMobileMenuOpen(false);
    }, [location]);

    const toggleDarkMode = () => {
        const newTheme = darkMode ? 'light' : 'dark';
        setDarkMode(!darkMode);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Practice Arena', path: '/dashboard/practice', icon: MessageSquare },
        { name: 'MCQ Quiz', path: '/dashboard/quiz', icon: BookOpen },
        { name: 'Experiences', path: '/dashboard/experiences', icon: Award },
        { name: 'Resume Feedback', path: '/dashboard/resume', icon: FileText },
    ];

    return (
        <>
            {/* Mobile Header */}
            <div style={{
                display: 'none',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: '60px',
                backgroundColor: 'var(--surface)',
                borderBottom: '1px solid var(--border-color)',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 1rem',
                zIndex: 1000,
                transition: 'background-color 0.3s ease'
            }}
                className="mobile-header">
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>placely.ai</h2>
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-color)',
                        cursor: 'pointer',
                        padding: '0.5rem',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar */}
            <div style={{
                width: 'var(--sidebar-width)',
                backgroundColor: 'var(--surface)',
                borderRight: '1px solid var(--border-color)',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                left: 0,
                top: 0,
                transition: 'transform 0.3s ease, background-color 0.3s ease',
                zIndex: 999
            }}
                className="sidebar">
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>placely.ai</h2>
                </div>

                <nav style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
                    <ul style={{ listStyle: 'none' }}>
                        {navItems.map((item) => (
                            <li key={item.path} style={{ marginBottom: '0.5rem' }}>
                                <Link
                                    to={item.path}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '0.75rem 1rem',
                                        borderRadius: '0.5rem',
                                        color: isActive(item.path) ? 'var(--primary-color)' : 'var(--text-color)',
                                        backgroundColor: isActive(item.path) ? (darkMode ? '#1A3A52' : '#eff6ff') : 'transparent',
                                        fontWeight: isActive(item.path) ? '500' : 'normal',
                                        transition: 'background-color 0.2s',
                                        minHeight: '44px'
                                    }}
                                >
                                    <item.icon size={20} style={{ marginRight: '0.75rem' }} />
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Dark Mode Toggle */}
                <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
                    <button
                        onClick={toggleDarkMode}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.75rem 1rem',
                            borderRadius: '0.75rem',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'var(--surface)',
                            color: 'var(--text-color)',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            minHeight: '44px'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--background)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--surface)'}
                    >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {darkMode ? <Moon size={18} /> : <Sun size={18} />}
                            {darkMode ? 'Dark Mode' : 'Light Mode'}
                        </span>
                        <div style={{
                            width: '44px',
                            height: '24px',
                            backgroundColor: darkMode ? 'var(--primary-color)' : '#E5E5EA',
                            borderRadius: '12px',
                            position: 'relative',
                            transition: 'background-color 0.3s'
                        }}>
                            <div style={{
                                width: '20px',
                                height: '20px',
                                backgroundColor: 'white',
                                borderRadius: '50%',
                                position: 'absolute',
                                top: '2px',
                                left: darkMode ? '22px' : '2px',
                                transition: 'left 0.3s',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }} />
                        </div>
                    </button>
                </div>

                <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: darkMode ? '#2C2C2E' : '#e5e7eb',
                            marginRight: '0.75rem'
                        }}></div>
                        <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-color)' }}>Edward Snowden</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Free Plan</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Overlay */}
            {mobileMenuOpen && (
                <div
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                        display: 'none',
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 998
                    }}
                    className="mobile-overlay"
                />
            )}

            <style>{`
                @media (max-width: 768px) {
                    .mobile-header {
                        display: flex !important;
                    }

                    .sidebar {
                        transform: translateX(${mobileMenuOpen ? '0' : '-100%'});
                        top: 60px;
                        height: calc(100vh - 60px);
                    }

                    .mobile-overlay {
                        display: block !important;
                    }
                }
            `}</style>
        </>
    );
}
