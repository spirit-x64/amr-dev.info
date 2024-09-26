const compression = require('compression')
const express = require("express")
const { join } = require('path')
const { existsSync, readFileSync, writeFileSync } = require('fs')
const { homedir } = require('os')

const app = express()
const PORT = process.env.PORT || 8080
const visitsFilePath = join(homedir(), 'visits')
const visitorsFilePath = join(homedir(), 'visitors')

let visitCount = 0
let uniqueIPs = new Set()

// Load existing visit counts if files exist
if (existsSync(visitsFilePath)) {
	visitCount = parseInt(readFileSync(visitsFilePath, 'utf8')) || 0
}
if (existsSync(visitorsFilePath)) {
	uniqueIPs = new Set(JSON.parse(readFileSync(visitorsFilePath, 'utf8')))
}

// Save counts every 5 minutes
setInterval(() => {
	writeFileSync(visitsFilePath, visitCount.toString())
	writeFileSync(visitorsFilePath, JSON.stringify([...uniqueIPs]))
}, 300000)

app.set('trust proxy', true)
app.use(compression())

app.get('/', (req, res, next) => {
	visitCount++
	uniqueIPs.add(req.headers['x-forwarded-for'] || req.ip)
	next()
})

app.use(express.static(join(__dirname, "public"), { 
	maxAge: 600000 // 10 min
}))

app.get('/views', (req, res) => {
	res.send(`Total visits: ${visitCount} | Unique visitors: ${uniqueIPs.size} | back to site: <a href="https://lilspirit.info">https://lilspirit.info</a>`)
})

app.get('/visits', (req, res) => {
	res.send('' + visitCount)
})

app.get('/visitors', (req, res) => {
	res.send('' + uniqueIPs.size)
})

app.listen(PORT, () => {
	console.log(`Listening at http://localhost:${PORT}`)
})
