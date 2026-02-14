// Accessibility Utilities

export interface AccessibilityState {
  seniorMode: boolean
  darkMode: boolean
}

export const getAccessibilityPreferences = (): AccessibilityState => {
  if (typeof window === 'undefined') {
    return { seniorMode: false, darkMode: false }
  }

  return {
    seniorMode: localStorage.getItem('seniorMode') === 'true',
    darkMode: localStorage.getItem('darkMode') === 'true',
  }
}

export const setSeniorMode = (enabled: boolean) => {
  if (typeof window === 'undefined') return
  localStorage.setItem('seniorMode', String(enabled))
  if (enabled) {
    document.documentElement.classList.add('senior-mode')
  } else {
    document.documentElement.classList.remove('senior-mode')
  }
}

export const setDarkMode = (enabled: boolean) => {
  if (typeof window === 'undefined') return
  localStorage.setItem('darkMode', String(enabled))
  if (enabled) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

export const getSeniorModeClass = () => {
  const { seniorMode } = getAccessibilityPreferences()
  return seniorMode ? 'senior-mode' : ''
}

// Add global styles for senior mode
export const applyAccessibilityStyles = () => {
  if (typeof document === 'undefined') return

  const { seniorMode } = getAccessibilityPreferences()

  const style = document.createElement('style')
  style.textContent = `
    .senior-mode {
      font-size: 18px !important;
      line-height: 1.8 !important;
    }

    .senior-mode button,
    .senior-mode [role="button"] {
      min-height: 56px !important;
      min-width: 56px !important;
      font-size: 18px !important;
      padding: 16px 24px !important;
    }

    .senior-mode input,
    .senior-mode textarea,
    .senior-mode select {
      min-height: 48px !important;
      font-size: 16px !important;
      padding: 12px !important;
    }

    .senior-mode .text-sm {
      font-size: 16px !important;
    }

    .senior-mode .text-xs {
      font-size: 14px !important;
    }

    .senior-mode a {
      text-decoration: underline !important;
    }

    /* High contrast for senior mode */
    .senior-mode {
      --foreground: 0 0% 0%;
      --background: 0 0% 100%;
    }
  `
  document.head.appendChild(style)

  if (seniorMode) {
    document.documentElement.classList.add('senior-mode')
  }
}
