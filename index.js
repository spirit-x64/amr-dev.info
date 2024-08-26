const compression = require('compression')
const express = require("express")
const { join } = require('path')
const app = express()
const PORT = process.env.PORT || 8080

app.use(compression())

app.use(express.static(join(__dirname, "public")))

app.listen(PORT, () => {
	console.log(`Listening at http://localhost:${PORT}`)
})
