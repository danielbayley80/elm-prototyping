import { copyFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/** GitHub project site: https://<user>.github.io/<repo>/ */
const GITHUB_PAGES_BASE = '/elm-prototyping/'

function ghPagesSpaFallback() {
  return {
    name: 'gh-pages-spa-fallback',
    closeBundle() {
      const outDir = path.resolve('dist')
      const index = path.join(outDir, 'index.html')
      if (existsSync(index)) {
        copyFileSync(index, path.join(outDir, '404.html'))
      }
    },
  }
}

export default defineConfig(() => {
  const forGitHubPages = process.env.GITHUB_PAGES === 'true'

  return {
    base: forGitHubPages ? GITHUB_PAGES_BASE : '/',
    plugins: [react(), tailwindcss(), ...(forGitHubPages ? [ghPagesSpaFallback()] : [])],
    build: {
      outDir: 'dist',
    },
    preview: {
      // `npm run preview:pages` serves the GitHub Pages build locally
      port: 4173,
    },
  }
})
