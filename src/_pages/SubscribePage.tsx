import { useState, useRef, useEffect } from "react"
import { supabase } from "../lib/supabase"
import { User } from "@supabase/supabase-js"

interface SubscribePageProps {
  user: User
}

export default function SubscribePage({ user }: SubscribePageProps) {
  const [error, setError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        window.electronAPI.updateContentDimensions({
          width: 400, // Fixed width
          height: 400 // Fixed height
        })
      }
    }

    updateDimensions()
  }, [])

  const handleSignOut = async () => {
    try {
      const { error: signOutError } = await supabase.auth.signOut()
      if (signOutError) throw signOutError
    } catch (err) {
      console.error("Error signing out:", err)
      setError("Failed to sign out. Please try again.")
      setTimeout(() => setError(null), 3000)
    }
  }

  const handleSubscribe = async () => {
    if (!user) return

    try {
      const result = await window.electronAPI.openSubscriptionPortal({
        id: user.id,
        email: user.email!
      })

      if (!result.success) {
        throw new Error(result.error || "Failed to open subscription portal")
      }
    } catch (err) {
      console.error("Error opening subscription portal:", err)
      setError("Failed to open subscription portal. Please try again.")
      setTimeout(() => setError(null), 3000)
    }
  }

  return (
    <div
      ref={containerRef}
      className="h-[400px] w-[400px] bg-black flex items-center justify-center"
    >
      <div className="w-full px-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">
            Welcome to Interview Coder
          </h2>
          <p className="text-gray-400 text-sm mt-2 mb-6">
            To continue using Interview Coder, you'll need to subscribe
            ($40/month)
          </p>

          {/* Keyboard Shortcuts */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 mb-6">
            <div className="flex items-center justify-between text-white/70 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-white/40">Toggle Visibility</span>
                <div className="flex gap-1">
                  <kbd className="bg-white/[0.07] border border-white/[0.1] rounded-md px-1.5 py-1 text-[10px] leading-none text-white/60">
                    ⌘
                  </kbd>
                  <kbd className="bg-white/[0.07] border border-white/[0.1] rounded-md px-1.5 py-1 text-[10px] leading-none text-white/60">
                    B
                  </kbd>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white/40">Quit App</span>
                <div className="flex gap-1">
                  <kbd className="bg-white/[0.07] border border-white/[0.1] rounded-md px-1.5 py-1 text-[10px] leading-none text-white/60">
                    ⌘
                  </kbd>
                  <kbd className="bg-white/[0.07] border border-white/[0.1] rounded-md px-1.5 py-1 text-[10px] leading-none text-white/60">
                    Q
                  </kbd>
                </div>
              </div>
            </div>
          </div>

          {/* Subscribe Button */}
          <button
            onClick={handleSubscribe}
            className="w-full px-4 py-3 bg-white text-black rounded-xl font-medium hover:bg-white/90 transition-colors flex items-center justify-center gap-2 mb-6"
          >
            Subscribe
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </button>

          {/* Logout Section */}
          <div className="border-t border-white/[0.06] pt-4">
            <button
              onClick={handleSignOut}
              className="flex items-center justify-center gap-1.5 text-[11px] text-red-400/80 hover:text-red-400 transition-colors w-full group"
            >
              <div className="w-3.5 h-3.5 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-full h-full"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </div>
              Log Out
            </button>
          </div>

          {error && (
            <div className="mt-4 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-xs text-red-400">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
