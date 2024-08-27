const compression = require('compression')
const express = require("express")
const { join } = require('path')
const { existsSync, readFileSync, writeFileSync } = require('fs')
const { homedir } = require('os')

const app = express()
const PORT = process.env.PORT || 8080
const viewsFilePath = join(homedir(), 'views')

let viewCount = 0

// Load existing view count if file exists
if (existsSync(viewsFilePath)) {
  viewCount = parseInt(readFileSync(viewsFilePath, 'utf8')) || 0
}

setInterval(() => writeFileSync(viewsFilePath, viewCount.toString()), 300000) // 5 min

app.use(compression())

app.use((req, res, next) => {
	viewCount++
	next()
})

app.use(express.static(join(__dirname, "public"), { 
	maxAge: 600000 // 10 min
}))

app.get('/views', (req, res) => {
	res.send(`Total views: ${viewCount}`)
})

app.listen(PORT, () => {
	console.log(`Listening at http://localhost:${PORT}`)
})
