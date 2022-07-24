const express = require('express')
const app = express()
const port = 5000

const mongoose = require('mongoose')
mongoose.connect("mongodb+srv://jjw:1HCC7g1HB9DmYiba@nodejspractice.z4connl.mongodb.net/?retryWrites=true&w=majority",{
  useNewUrlParser: true, useUnifiedTopology: true
}).then(()=>console.log("MongoDB Connnected..."))
  .catch(err => console.log(err))


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
}) 