
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
      react({
        // Optimize React plugin settings for better build performance
        jsxImportSource: undefined,
        tsDecorators: false,
      }),
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
          manualChunks: {
            // Group core React libraries together
            'vendor-react-core': ['react', 'react-dom', 'react-router-dom'],
            // Group Supabase separately
            'vendor-supabase': ['@supabase/supabase-js'],
            // Group UI components
            'vendor-ui': [
              '@radix-ui/react-accordion',
              '@radix-ui/react-alert-dialog',
              '@radix-ui/react-avatar',
              '@radix-ui/react-checkbox',
              '@radix-ui/react-dialog',
              '@radix-ui/react-dropdown-menu',
              '@radix-ui/react-label',
              '@radix-ui/react-popover',
              '@radix-ui/react-select',
              '@radix-ui/react-separator',
              '@radix-ui/react-slider',
              '@radix-ui/react-slot',
              '@radix-ui/react-switch',
              '@radix-ui/react-tabs',
              '@radix-ui/react-toast',
              'cmdk',
            ],
            // Group date handling libraries
            'vendor-date-fns': ['date-fns'],
            // Group query libraries
            'vendor-query': ['@tanstack/react-query'],
            // Group chart libraries
            'vendor-charts': ['recharts'],
            // Group utility libraries
            'vendor-utils': [
              'class-variance-authority', 
              'clsx', 
              'tailwind-merge',
              'lucide-react'
            ],
          }
        },
      },
      // Optimize for production builds
      minify: mode === 'production',
      // Target modern browsers for smaller bundle size
      target: 'es2018',
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
        'sonner',
      ],
    },
  };
});
