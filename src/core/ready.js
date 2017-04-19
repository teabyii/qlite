import { document } from '../core/variables'

export default function ready (fn) {
  if (
      document.readyState === 'complete' ||
      (
        document.readyState !== 'loading' &&
        !document.documentElement.doScroll
      )
    ) {
    setTimeout(() => fn())
  } else {
    const handler = () => {
      document.removeEventListener('DOMContentLoaded', handler, false)
      window.removeEventListener('load', handler, false)
      fn()
    }

    document.addEventListener('DOMContentLoaded', handler, false)
    window.addEventListener('load', handler, false)
  }
}
