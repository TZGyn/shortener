import express from 'express'

const app = express()
const port = 1234

app.get('/', (req, res) => {
	res.json({ message: 'Hello', data: 'World' })
})

app.listen(port, () => {
	console.log(`Listening on port ${port}...`)
})
