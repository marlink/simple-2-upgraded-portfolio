#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const { getCache } = require('../cache')

const projectRoot = path.resolve(__dirname, '../../')
const cache = getCache('dev-bootstrap', { maxEntries: 10000, ttlMs: 7 * 24 * 60 * 60 * 1000 })

function listFiles(dir, exts) {
  const out = []
  const base = path.resolve(projectRoot, dir)
  if (!fs.existsSync(base)) return out
  const stack = [base]
  while (stack.length) {
    const cur = stack.pop()
    const items = fs.readdirSync(cur)
    for (const name of items) {
      const p = path.join(cur, name)
      const stat = fs.statSync(p)
      if (stat.isDirectory()) {
        stack.push(p)
      } else {
        const ext = path.extname(name).toLowerCase()
        if (!exts || exts.includes(ext)) {
          out.push(path.relative(projectRoot, p))
        }
      }
    }
  }
  return out.sort()
}

function sha1File(fileRel) {
  const p = path.join(projectRoot, fileRel)
  const buf = fs.readFileSync(p)
  return crypto.createHash('sha1').update(buf).digest('hex')
}

function meta(fileRel) {
  const p = path.join(projectRoot, fileRel)
  const s = fs.statSync(p)
  return { size: s.size, mtimeMs: s.mtimeMs, hash: sha1File(fileRel) }
}

function parseCssVars(fileRel) {
  const p = path.join(projectRoot, fileRel)
  if (!fs.existsSync(p)) return {}
  const css = fs.readFileSync(p, 'utf8')
  const vars = {}
  const re = /--([a-zA-Z0-9_-]+)\s*:\s*([^;]+);/g
  let m
  while ((m = re.exec(css)) !== null) {
    vars[m[1]] = m[2].trim()
  }
  return vars
}

function set(key, value) {
  cache.set(key, value)
}

function warm() {
  const jsFiles = listFiles('assets/js', ['.js'])
  const cssFiles = listFiles('assets/css', ['.css'])
  const demoHtml = listFiles('demo', ['.html'])
  const rootHtml = fs.readdirSync(projectRoot).filter(f => f.endsWith('.html'))

  set('files:assets:js', jsFiles)
  set('files:assets:css', cssFiles)
  set('files:demo', demoHtml)
  set('files:html:root', rootHtml)

  for (const f of [...jsFiles, ...cssFiles, ...demoHtml, ...rootHtml]) {
    set(`meta:${f}`, meta(f))
  }

  const cssVars = parseCssVars('assets/css/framework-unified.css')
  set('tokens:css-vars', cssVars)
}

warm()
console.log('Bootstrap cache complete')