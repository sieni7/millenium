import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

function saveConfigPlugin() {
  return {
    name: 'save-config-plugin',
    configureServer(server) {
      server.middlewares.use('/api/save-config', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => body += chunk);
          req.on('end', () => {
            const configPath = path.resolve(process.cwd(), 'public/config.json');
            try {
                fs.writeFileSync(configPath, body, 'utf8');
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true }));
            } catch (err) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: err.message }));
            }
          });
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [saveConfigPlugin()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    minify: 'terser',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: './index.html',
        admin: './admin.html'
      }
    }
  }
});
