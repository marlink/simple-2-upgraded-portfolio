const fs = require('fs')
const path = require('path')

class PersistentLRU {
  constructor(filePath, { maxEntries = 500, ttlMs = 7 * 24 * 60 * 60 * 1000 } = {}) {
    this.filePath = filePath
    this.maxEntries = maxEntries
    this.ttlMs = ttlMs
    this.store = new Map()
    this._ensureDir()
    this._load()
  }

  _ensureDir() {
    const dir = path.dirname(this.filePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
  }

  _load() {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf8')
        const obj = JSON.parse(raw || '{}')
        const now = Date.now()
        Object.keys(obj).forEach((k) => {
          const e = obj[k]
          if (e && typeof e === 'object' && typeof e.expiresAt === 'number' && e.expiresAt > now) {
            this.store.set(k, e)
          }
        })
      }
    } catch (_) {}
  }

  _save() {
    try {
      const obj = {}
      this.store.forEach((v, k) => {
        obj[k] = v
      })
      fs.writeFileSync(this.filePath, JSON.stringify(obj), 'utf8')
    } catch (_) {}
  }

  _prune() {
    const now = Date.now()
    let changed = false
    this.store.forEach((e, k) => {
      if (!e || typeof e.expiresAt !== 'number' || e.expiresAt <= now) {
        this.store.delete(k)
        changed = true
      }
    })
    while (this.store.size > this.maxEntries) {
      const firstKey = this.store.keys().next().value
      if (firstKey === undefined) break
      this.store.delete(firstKey)
      changed = true
    }
    if (changed) this._save()
  }

  get(key) {
    const e = this.store.get(key)
    const now = Date.now()
    if (!e || typeof e.expiresAt !== 'number' || e.expiresAt <= now) {
      if (e) this.store.delete(key)
      return undefined
    }
    this.store.delete(key)
    this.store.set(key, e)
    return e.value
  }

  set(key, value, ttlMs = this.ttlMs) {
    const expiresAt = Date.now() + (ttlMs > 0 ? ttlMs : this.ttlMs)
    this.store.set(key, { value, expiresAt })
    this._prune()
    this._save()
    return value
  }

  async getOrCreate(key, producer, ttlMs = this.ttlMs) {
    const cached = this.get(key)
    if (cached !== undefined) return cached
    const v = producer()
    const value = v && typeof v.then === 'function' ? await v : v
    this.set(key, value, ttlMs)
    return value
  }
}

module.exports = { PersistentLRU }