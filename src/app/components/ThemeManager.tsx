import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ThemeManager() {
    const location = useLocation();

    useEffect(() => {
        // Determine if we are in an Admin/Distributor route
        // Note: We use strict checking for /admin or /distributor prefixes
        const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/distributor');

        // We use the root element (html) and data-theme attribute for standard modern theming
        const root = document.documentElement;

        if (isAdminRoute) {
            // Set theme attribute to 'admin' (Light Mode)
            root.setAttribute('data-theme', 'admin');

            // Also manage the 'dark' class for Tailwind utility consistency (Admin is Light)
            root.classList.remove('dark');
            root.classList.add('light');
        } else {
            // Set theme attribute to 'user' (Dark Mode)
            root.setAttribute('data-theme', 'user');

            // User portal is strictly Dark
            root.classList.remove('light');
            root.classList.add('dark');
        }
    }, [location]);

    return null;
}
