require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser")
const app = express()
const router = require("./routes")

app.use(bodyParser.json())
app.use(cors());
app.use(morgan("dev"))
app.use(express.json())
app.use(router)

// 404
app.use((req, res) => {
  return res.status(404).json(({
    status: false,
    message: 'Not Found',
    err: `Cannot find ${req.url}`,
    data: null
  }))
})

// 500
app.use((err, req, res) => {
  return res.status(500).json(({
    status: false,
    message: 'Internal Server Error',
    err: err.message,
    data: null
  }))
})


const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});

module.exports = app