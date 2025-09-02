import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react'; // <-- Add this import
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'], // <-- change to .jsx
            refresh: true,
        }),
        tailwindcss(),
        react(), // <-- Add react plugin here
    ],
});