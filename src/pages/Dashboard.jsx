import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function Dashboard() {
    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content" style={{ marginLeft: 'var(--sidebar-width)' }}>
                <Outlet />
            </div>
        </div>
    );
}
