import { useState } from 'react'
import { Sparkles, Zap, Shield, Plus } from 'lucide-react'
import { motion, staggerContainer, staggerItem, slideUp, scaleIn } from '@/components/motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from '@/components/ui/sonner'
import { PageHeader } from '@/components/layout'

const features = [
  {
    icon: Sparkles,
    title: 'Beautiful Components',
    description: 'Pre-built shadcn/ui components with consistent styling and accessibility.',
  },
  {
    icon: Zap,
    title: 'Motion Animations',
    description: 'Smooth, performant animations powered by Motion library.',
  },
  {
    icon: Shield,
    title: 'Type Safe',
    description: 'Full TypeScript support with strict mode enabled.',
  },
]

export default function Home() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const handleSubmit = () => {
    if (inputValue.trim()) {
      toast.success('Form submitted!', {
        description: `You entered: ${inputValue}`,
      })
      setInputValue('')
      setDialogOpen(false)
    } else {
      toast.error('Please enter a value')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        breadcrumbs={[
          { label: 'Home', href: '#' },
          { label: 'Dashboard' },
        ]}
        actions={
          <>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Item</DialogTitle>
                  <DialogDescription>
                    Enter details for your new item.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Input
                    placeholder="Enter something..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit}>Create</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        }
      />

      {/* Stats Overview */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {[
          { label: 'Total Campaigns', value: '12', change: '+2 from last month' },
          { label: 'Active Audiences', value: '3,245', change: '+12% growth' },
          { label: 'Form Submissions', value: '892', change: '+18% this week' },
          { label: 'Growth Credits', value: '$4,523', change: 'Available balance' },
        ].map((stat, index) => (
          <motion.div key={index} variants={staggerItem}>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>{stat.label}</CardDescription>
                <CardTitle className="text-3xl">{stat.value}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Features Section */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="grid gap-6 md:grid-cols-3"
      >
        {features.map((feature, index) => (
          <motion.div key={index} variants={slideUp}>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <motion.div
                    variants={scaleIn}
                    className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground"
                  >
                    <feature.icon className="h-5 w-5" />
                  </motion.div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="ghost"
                    className="px-0"
                    onClick={() =>
                      toast.info(`Learn more about ${feature.title}`)
                    }
                  >
                    Learn more →
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
