'use client'

import { signUpAction } from "@/app/actions"
import { FormMessage, Message } from "@/components/form-message"
import { SubmitButton } from "@/components/submit-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useTranslations } from "next-intl"

export default function Signup({ searchParams }: { searchParams: { message?: string; type?: string } }) {
  const t = useTranslations("Signup")
  
  const message: Message = {
    message: searchParams.message,
    type: searchParams.type
  }
  
  if (message.message) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={message} />
      </div>
    )
  }

  return (
    <form className="flex flex-col min-w-64 max-w-64 mx-auto">
      {/* ... rest of your component ... */}
      
      {message.message && (
        <FormMessage message={message} />
      )}
    </form>
  )
}