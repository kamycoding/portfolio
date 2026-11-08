// Next Imports
import Link from 'next/link'

// Component Imports
import { Button } from '@/components/ui/button'

const BuyNowButton = () => {
  return (
    <Button
      render={<Link href='https://shadcnstudio.com/templates/zolt-portfolio-template-free' target='_blank' />}
      className='animate-heartbeat fixed right-15 bottom-8 z-70'
      nativeButton={false}
    >
      Download
    </Button>
  )
}

export default BuyNowButton
