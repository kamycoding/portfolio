// Lib Imports
import { cn } from '@/lib/utils'

type EyebrowProps = {
  children: string
  className?: string
}

const Eyebrow = ({ children, className }: EyebrowProps) => {
  return <p className={cn('text-accent text-[22px] font-medium italic', className)}>{`// ${children}`}</p>
}

export default Eyebrow
