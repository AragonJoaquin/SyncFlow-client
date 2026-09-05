import { createRoot } from 'react-dom/client'
import { AxiosProvider } from './api/useAxios.tsx'
import App from './app.tsx'
import { GlobalProvider } from './context'
import './index.css'

createRoot(document.getElementById('root')!).render(
	<AxiosProvider>
		<GlobalProvider>
			<App />
		</GlobalProvider>
	</AxiosProvider>
)
