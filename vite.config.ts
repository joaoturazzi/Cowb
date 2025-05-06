
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables to use in the config
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      // Only use the component tagger in development mode
      mode === 'development' && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development',
      // Optimize chunking for better loading performance
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Create separate chunks for major dependencies
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) {
                return 'vendor-react';
              }
              if (id.includes('@supabase')) {
                return 'vendor-supabase';
              }
              if (id.includes('@radix-ui') || id.includes('cmdk')) {
                return 'vendor-ui';
              }
              if (id.includes('date-fns')) {
                return 'vendor-date-fns';
              }
              if (id.includes('@tanstack/react-query')) {
                return 'vendor-react-query';
              }
              return 'vendor'; // all other packages go here
            }
          }
        },
      },
      // Minify for production builds
      minify: mode === 'production',
      // Target modern browsers for smaller bundle size
      target: 'es2018',
      // Add chunk size warnings
      chunkSizeWarningLimit: 1000,
      // Improve asset optimization
      assetsInlineLimit: 4096, // Inline assets under 4kb
    },
    // Include environment variables prefixed with PUBLIC_
    define: {
      'import.meta.env.APP_VERSION': JSON.stringify(process.env.npm_package_version),
    },
    // Optimize deps for faster startup
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@supabase/supabase-js',
        'date-fns',
        '@tanstack/react-query',
      ],
      // Exclude certain dependencies from pre-bundling
      exclude: [],
    },
  };
});
