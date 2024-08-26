const compression = require('compression')
const express = require("express")
const { join } = require('path')
const app = express()
const PORT = process.env.PORT || 8080

app.use(compression())

app.use(express.static(join(__dirname, "public")), { 
	maxAge: 600000 // 10 min
})

app.listen(PORT, () => {
	console.log(`Listening at http://localhost:${PORT}`)
})
