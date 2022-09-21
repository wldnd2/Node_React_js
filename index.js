const express = require('express')
const app = express()
const port = 5000
// bodyParser 와 User 끌어오기
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { User } = require('./models/User');

const config = require('./config/keys');

// appplication/x-www-form-urlencoded 이렇게 된 데이터를 분석해서 가지고 올 수 있게 해준다.
app.use(bodyParser.urlencoded({ extended: true }));
// appplication/json으로 된것을 분석해서 들고 올 수 있게 해준다.
app.use(bodyParser.json()); 
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,{
  useNewUrlParser: true, useUnifiedTopology: true
}).then(()=>console.log("MongoDB Connnected..."))
  .catch(err => console.log(err))


app.get('/', (req, res) => {
  res.send('Hello World! Hello Node.js!');
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

// app.post('/login', async (req, res) => {
app.post('/login', async (req, res) => {
  // 요청된 이메일을 데이터베이스에서 있는지 찾는다.
  // const user = await User.findOne({ email: req.body.email });
  // if (!user)

  User.findOne({ email: req.body.email }, (err, user) => {
    // 유저 컬렉션에 위의 이메일을 가진 유저가 한 명도 없다면 하는 if
    if (!user) {
      return res.json({
        success: false,
        message: '찾고자 하는 User 이메일이 없습니다.',
      })
    }
    // 요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호 인지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." })
      // 비밀번호까지 맞다면 토큰을 생성하기
      // 토큰을 쓰기 위해서 라이브러리를 다운받는다 (npm install jsonwebtoken --save)
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        // 토큰을 저장한다. 어디에? 쿠키, 로컬스토리지 일단은 쿠키에 해보자
        // 쿠키를 쓰기 위해서는 라이브러리를  다운받는다  (npm install cookie-parser --save)
        res.cookie("x_auth", user.token).status(200).json({ loginSuccess: true, userId: user.id })
      })
    })
  })
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
}) 