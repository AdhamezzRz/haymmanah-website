// Custom Node.js entry point for Passenger-based hosts (Hostinger hPanel "Node.js App",
// cPanel Node Selector, Plesk). These panels spawn this file directly and expect it to
// listen on process.env.PORT. Vercel and `next dev`/`next start` never touch this file —
// they use `next build`'s output directly, so it's inert everywhere except here.
const { createServer } = require('http')
const next = require('next')

const port = process.env.PORT || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => handle(req, res)).listen(port, () => {
    console.log(`> haymanah-website ready on port ${port}`)
  })
})
