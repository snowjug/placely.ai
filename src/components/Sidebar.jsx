import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, FileText, BookOpen, Award } from 'lucide-react';

export default function Sidebar() {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Practice Arena', path: '/dashboard/practice', icon: MessageSquare },
        { name: 'MCQ Quiz', path: '/dashboard/quiz', icon: BookOpen }, // Placeholder
        { name: 'Experiences', path: '/dashboard/experiences', icon: Award }, // Placeholder
        { name: 'Resume Feedback', path: '/dashboard/resume', icon: FileText },
    ];

    return (
        <div style={{
            width: 'var(--sidebar-width)',
            backgroundColor: 'white',
            borderRight: '1px solid var(--border-color)',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            left: 0,
            top: 0
        }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>placely.ai</h2>
            </div>

            <nav style={{ flex: 1, padding: '1rem' }}>
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
                                    backgroundColor: isActive(item.path) ? '#eff6ff' : 'transparent',
                                    fontWeight: isActive(item.path) ? '500' : 'normal',
                                    transition: 'background-color 0.2s'
                                }}
                            >
                                <item.icon size={20} style={{ marginRight: '0.75rem' }} />
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#e5e7eb',
                        marginRight: '0.75rem'
                    }}></div>
                    <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: '500' }}>Edward Snowden</div>
                        <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Free Plan</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
