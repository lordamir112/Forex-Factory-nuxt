import throttle from "lodash/throttle"

const CACHE_TTL = 30_000 // 30s
const cache = new Map<string, { ts: number; data: any }>()

export function useAbortableFetch() {
  let controller: AbortController | null = null

  function abort() {
    if (controller) {
      controller.abort()
      controller = null
    }
  }

  async function doFetch(url: string, options: RequestInit = {}) {
    const key = url + JSON.stringify(options)
       // check cache
    const cached = cache.get(key)
    if (cached && Date.now() - cached.ts < CACHE_TTL) {
      return cached.data
    }

    abort() // cancel previous request
    
    controller = new AbortController()

    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    })

    if (!res.ok) throw new Error(await res.text())
    const data = await res.json()

    cache.set(key, { ts: Date.now(), data })
    return data
  }
  
  // throttled version (300ms)
  const throttledFetch = throttle(
    (url: string, options: RequestInit, cb: (data: any) => void, errCb?: (e: any) => void) => {
      doFetch(url, options).then(cb).catch(errCb)
    },
    300,
    { leading: false, trailing: true }
  )

  return { doFetch, throttledFetch, abort }
}
