'use client'

import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

const Toast = () => {
  const { message } = useToast()

  return (
    <div
      role='status'
      className={cn(
        'bg-text text-bg pointer-events-none fixed bottom-12 left-1/2 z-85 rounded-lg px-3.5 py-2 font-mono text-[12.5px] font-medium transition-all duration-200',
        message ? '-translate-x-1/2 translate-y-0 opacity-100' : '-translate-x-1/2 translate-y-2 opacity-0'
      )}
    >
      {message}
    </div>
  )
}

export default Toast
