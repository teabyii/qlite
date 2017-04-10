import { document } from '../core/variables'

export default function ready (fn) {
  if (
      document.readyState === 'complete' ||
      (
        document.readyState !== 'loading' &&
        !document.documentElement.doScroll
      )
    ) {
    setTimeout(() => fn(qlite))
  } else {
    const handler = () => {
      document.removeEventListener('DOMContentLoaded', handler, false)
      window.removeEventListener('load', handler, false)
      fn(qlite)
    }

    document.addEventListener('DOMContentLoaded', handler, false)
    window.addEventListener('load', handler, false)
  }
}
