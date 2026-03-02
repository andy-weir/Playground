import { Toaster } from '@/components/ui/sonner'
import { AppLayout } from '@/components/layout'
import { FeatureFlagsProvider } from '@/contexts/FeatureFlagsContext'
import { PrototypeControlPanel } from '@/components/opt-in'
import Home from '@/pages/Home'

function App() {
  return (
    <FeatureFlagsProvider>
      <AppLayout>
        <Home />
      </AppLayout>
      <PrototypeControlPanel />
      <Toaster position="bottom-right" richColors />
    </FeatureFlagsProvider>
  )
}

export default App
