import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { HeroUIProvider } from '@heroui/react';
import { ThemeProvider } from './Providers/ThemeProvider';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <HeroUIProvider>
                <ThemeProvider>
                    <App {...props} />
                </ThemeProvider>
            </HeroUIProvider>,
        );
    },
    progress: {
        color: '#3b82f6',
    },
});
