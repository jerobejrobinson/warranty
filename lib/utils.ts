import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, func: any) => {
  if (
    (e.ctrlKey || e.metaKey) &&
    (e.key === 'Enter' || e.key === 'NumpadEnter')
  ) {
    e.preventDefault()
    // e.currentTarget.form?.requestSubmit()
    func()
  }
}