import { createContext, useContext } from 'react'
import type { NavigateOptions, To } from 'react-router-dom'

export type SplashNavigate = (to: To, options?: NavigateOptions) => void

const SplashNavigationContext = createContext<SplashNavigate | null>(null)

export const SplashNavigationProvider = SplashNavigationContext.Provider

export function useSplashTransition() {
  return useContext(SplashNavigationContext)
}
