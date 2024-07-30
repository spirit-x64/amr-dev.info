const express = require("express")
const app = express()
const PORT = process.env.PORT || 8080

app.use(express.static("public"))

app.listen(PORT, () => {
	console.log(`Listening at http://localhost:${PORT}`)
})
