import { router } from './router.js';
import { store } from './store.js';
import { renderSidebar } from './components/sidebar.js';
import { renderHeader } from './components/header.js';
import { renderLogin, hideLogin } from './pages/login.js';
import { renderDashboard } from './pages/dashboard.js';
import { renderMarketplace } from './pages/marketplace.js';
import { renderOrders } from './pages/orders.js';
import { renderMessages } from './pages/messages.js';
import { renderReagents } from './pages/reagents.js';
import { renderDigitalTwin } from './pages/digital-twin.js';
import { renderWetLab } from './pages/wet-lab.js';
import { renderAnalytics } from './pages/analytics.js';
import { renderSimulation } from './pages/simulation.js';
import { renderSubscription } from './pages/subscription.js';
import { renderExperimentHistory } from './pages/experiment-history.js';
import { renderAdminDashboard } from './pages/admin-dashboard.js';
import { renderAdminUsers } from './pages/admin-users.js';
import { renderAdminLabs } from './pages/admin-labs.js';
import { renderAdminOrders } from './pages/admin-orders.js';
import { renderAdminFinance } from './pages/admin-finance.js';
import { renderAdminSettings } from './pages/admin-settings.js';

// Auth guard: redirect to login if not authenticated
router.before((path) => {
    if (path === '/login') return true;
    if (!store.get('isLoggedIn')) {
        renderLogin();
        return false;
    }
    hideLogin();
    return true;
});

// Helper to render page with layout
function page(renderFn) {
    return () => { renderSidebar(); renderHeader(); renderFn(); };
}

// Route definitions
router
    .on('/login', () => { renderLogin(); })
    // Front-end routes
    .on('/', page(renderDashboard))
    .on('/marketplace', page(renderMarketplace))
    .on('/orders', page(renderOrders))
    .on('/messages', page(renderMessages))
    .on('/reagents', page(renderReagents))
    .on('/digital-twin', page(renderDigitalTwin))
    .on('/wet-lab', page(renderWetLab))
    .on('/analytics', page(renderAnalytics))
    .on('/simulation', page(renderSimulation))
    .on('/subscription', page(renderSubscription))
    .on('/history', page(renderExperimentHistory))
    // Admin routes
    .on('/admin', page(renderAdminDashboard))
    .on('/admin/users', page(renderAdminUsers))
    .on('/admin/labs', page(renderAdminLabs))
    .on('/admin/orders', page(renderAdminOrders))
    .on('/admin/finance', page(renderAdminFinance))
    .on('/admin/settings', page(renderAdminSettings));

// Sidebar overlay click to close (mobile)
document.getElementById('sidebar-overlay')?.addEventListener('click', () => {
    document.getElementById('sidebar')?.classList.remove('open');
    document.getElementById('sidebar-overlay')?.classList.remove('visible');
});

// Start
router.start();
