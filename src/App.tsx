import { Toaster } from '@/components/ui/sonner'
import { AppLayout } from '@/components/layout'
import GdprConsentDemo from '@/pages/GdprConsentDemo'

function App() {
  return (
    <>
      <AppLayout>
        <GdprConsentDemo />
      </AppLayout>
      <Toaster position="bottom-right" richColors />
    </>
  )
}

export default App
