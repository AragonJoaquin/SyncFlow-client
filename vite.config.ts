import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

//! can add more!
const root = (dir: string = '') => path.resolve(__dirname, 'src', dir)

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],

	resolve: {
		alias: {
			"@": root(),
			// "@api": root("/api"),
			// "@store": root("/store"),
			// "@comp": root("/components")
		}
	}
})
