import { Redirect, Route, Switch } from 'wouter'
import { useShallow } from 'zustand/shallow'
import { SFToastRoot } from './components/SFToast'
import { ChatProvider } from './context'
import { AuthPage } from './pages/auth'
import { ChatPage } from './pages/chats/chats'
import { NotFoundPage } from './pages/not-found'
import { useOwnUserStore } from './store'

export default function App() {
  const token = useOwnUserStore(useShallow((s) => s.token))

  return (
    <main className="min-h-screen h-screen w-full bg-darkBG font-OpenSans text-whiteText">
      <Switch>
        <Route
          path="/"
          component={() =>
            token ? (
              <ChatProvider>
                <ChatPage />
              </ChatProvider>
            ) : (
              <Redirect to="/auth" />
            )
          }
        />
        <Route path="/auth" component={() => (token ? <Redirect to="/" /> : <AuthPage />)} />

        <Route component={NotFoundPage} />
      </Switch>

      <SFToastRoot />
    </main>
  )
}
