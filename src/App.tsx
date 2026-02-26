import { Toaster } from '@/components/ui/sonner'
import { AppLayout } from '@/components/layout'
import Home from '@/pages/Home'

function App() {
  return (
    <>
      <AppLayout>
        <Home />
      </AppLayout>
      <Toaster position="bottom-right" richColors />
    </>
  )
}

export default App
