const app = require("express")()
const PORT = 8080

app.listen(PORT, () => {
	console.log(`Listening at http://localhost:${PORT}`)
})

app.get("/", (req, res) => {
	res.send("Testing in production lol :)")
})

