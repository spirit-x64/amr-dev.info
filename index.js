const compression = require('compression')
const express = require("express")
const { join } = require('path')
const { existsSync, readFileSync, writeFileSync } = require('fs')
const { homedir } = require('os')

const app = express()
const PORT = process.env.PORT || 8080
const viewsFilePath = join(homedir(), 'views')
const uniqueViewsFilePath = join(homedir(), 'unique_views')

let viewCount = 0
let uniqueIPs = new Set()

// Load existing view counts if files exist
if (existsSync(viewsFilePath)) {
	viewCount = parseInt(readFileSync(viewsFilePath, 'utf8')) || 0
}
if (existsSync(uniqueViewsFilePath)) {
	uniqueIPs = new Set(JSON.parse(readFileSync(uniqueViewsFilePath, 'utf8')))
}

// Save counts every 5 minutes
setInterval(() => {
	writeFileSync(viewsFilePath, viewCount.toString())
	writeFileSync(uniqueViewsFilePath, JSON.stringify([...uniqueIPs]))
}, 300000)

app.set('trust proxy', true)
app.use(compression())

app.get('/', (req, res, next) => {
	viewCount++
	uniqueIPs.add(req.ip ?? req.connection.remoteAddress)
	next()
})

app.use(express.static(join(__dirname, "public"), { 
	maxAge: 600000 // 10 min
}))

app.get('/views', (req, res) => {
	res.send(`Total views: ${viewCount} | \nUnique views: ${uniqueIPs.size} |`)
})

app.listen(PORT, () => {
	console.log(`Listening at http://localhost:${PORT}`)
})
