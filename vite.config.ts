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
        // Basic React plugin settings without unnecessary options
        jsxImportSource: undefined,
        tsDecorators: false,
      }),
      // Only use the component tagger in development mode
      mode === 'development' && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "react": path.resolve(__dirname, "./node_modules/react"),
        "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development',
      // Simplified chunking strategy to prevent module loading issues
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Put React and React DOM into the react-core chunk
            if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
              return 'react-core';
            }
            
            // Group UI components together
            if (id.includes('node_modules/@radix-ui/') || id.includes('/components/ui/')) {
              return 'ui-components';
            }
            
            // Group upcoming tasks components together without splitting them further
            if (id.includes('/components/upcoming-tasks/')) {
              return 'app';
            }
            
            // Keep main app code in its own chunk
            if (id.includes('src/') && !id.includes('node_modules/')) {
              return 'app';
            }
            
            // All other dependencies
            return 'vendor';
          }
        },
      },
      minify: mode === 'production',
      target: 'es2018',
      chunkSizeWarningLimit: 1000,
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@radix-ui/react-tabs',
        'sonner',
        // Include upcoming tasks components to ensure proper optimization
        './src/components/upcoming-tasks/useUpcomingTasks',
        './src/components/upcoming-tasks/UpcomingTasksHeader',
        './src/components/upcoming-tasks/UpcomingDaysTabs',
      ],
      exclude: [],
      esbuildOptions: {
        define: {
          global: 'globalThis',
        },
      },
      force: true,
    },
  };
});
