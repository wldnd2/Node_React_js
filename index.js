const express = require('express')
const app = express()
const port = 5000
// bodyParser 와 User 끌어오기
const bodyParser = require('body-parser');
const { User } = require('./models/User');

// appplication/x-www-form-urlencoded 이렇게 된 데이터를 분석해서 가지고 올 수 있게 해준다.
app.use(bodyParser.urlencoded({ extended: true }));
// appplication/json으로 된것을 분석해서 들고 올 수 있게 해준다.
app.use(bodyParser.json()); 

const mongoose = require('mongoose')
mongoose.connect("mongodb+srv://jjw:1HCC7g1HB9DmYiba@nodejspractice.z4connl.mongodb.net/?retryWrites=true&w=majority",{
  useNewUrlParser: true, useUnifiedTopology: true
}).then(()=>console.log("MongoDB Connnected..."))
  .catch(err => console.log(err))


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post("/register", (req, res) => {
  // 회원 가입할때 필요한 정보들을 client에서 가져오면
  // 그것들을 데이터베이스에 넣어준다.
  /* body안에는 json으로 id, pwd등 정보가 들어있다.
  -> 있게 해주는게 위의 bodyparser가 있어서 가능하다. */
  const user = new User(req.body);
  // MongoDB에서 오는 메서드, 유저모델에 저장이 된다.
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, message: err.message });
    return res.status(200).json({
      success: true
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
}) 