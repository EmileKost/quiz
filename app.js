
const express = require('express')
const app = express()
const http = require('http').createServer(app)
const path = require('path')
const fetch = require('node-fetch')
const bodyParser = require('body-parser')
const flash = require('express-flash')

const io = require('socket.io')(http)
const port = process.env.PORT || 4500

//Database connection
const mongoose = require('mongoose');
const Question = require('./models/Question.js')
const { getEnvironmentData } = require('worker_threads')
const dbURI = 'mongodb+srv://developerEmile:test@nasaspacequiz.zrhfg.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) =>  console.log('Mongodb connected'))
  .catch((error) => console.log(error + 'has occured'))

http.listen(port, () => {
  console.log('Socket io application is running on ' + port)
})

const baseURLapi = 'https://images-api.nasa.gov/asset/PIA01492'

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.resolve('public')))
app.use(express.urlencoded({ extended: false})); 

// Functions for the five questions
app.get('/admin', (req, res) => {
  res.render('admin')
})

// Admin page for creating questions
app.post('/admin', (req, res) => {
  const title = req.body.title;
  const hint = req.body.hint
  const image = req.body.image;
  const answer = req.body.answer;
  console.log(title, image, answer)
  
  const question = new Question({
    title: title,
    hint: hint,
    image: image,
    answer: answer
  });

  question.save()
    .then((result) => {
      console.log(result)
    })
    .catch((err) => {
      console.log(err)
    })
    res.render('admin')
})

app.get('/', (req, res) => {
  question1 = Question.findOne({
    answer: "Mars"
  })
 .then(result => {
   question1 = result.image
   
   fetch(question1)
    .then(async data => {
      const question = await data.json();
      let question2 = Question.findOne({
        answer: "Jupiter"
      })
      .then(result2 => {
        question2 = result2.image
        fetch(question2)
        .then(async data2 => {
          const question2 = await data2.json()
          
          let question3 = Question.findOne({
            answer: "Neptune"
          })
          .then(result3 => {
            question3 = result3.image

            fetch(question3)
            .then(async data3 => {
              const question3 = await data3.json()

              let question4 = Question.findOne({
                answer: "Mercury"
              })
              .then(result4 => {
                question4 = result4.image

                fetch(question4)
                .then(async data4 => {
                  const question4 = await data4.json()

                  res.render('index', {
                    image: question.collection.items[0],
                    hint: result.hint,
                    answer: result.answer,

                    image2: question2.collection.items[0],
                    hint2: result2.hint,
                    answer2: result2.answer,

                    image3: question3.collection.items[0],
                    hint3: result3.hint,
                    answer3: result3.answer,

                    image4: question4.collection.items[0],
                    hint4: result4.hint,
                    answer4: result4.answer,
                  })
                })
              })
            })
          })
        })
      })
   })
 })
 .catch((err) => {
   console.log(err)
 })
})


// function getQuestion1() {
//   fetch('https://images-api.nasa.gov/asset/PIA04591')
//   .then(async result => {
//     const question1 = await result.json();
//     question1Image = question1.collection.items[0].href
//     question1Hint = 'This planet is named after the Roman god of war'
//     console.log(question1Image, question1Hint)
//   })
// }


//SOCKET IO
let users = [];

io.on('connection', (socket) => {
  console.log('a user connected')
  console.log(socket.id)

  socket.on('name', (name) => {
    let object = {username: name , id: socket.id, points: 0}
    users.push(object)
    io.emit('name', {username: name , id: socket.id, points: 0})
  })

  socket.on('message', (message) => {
    io.emit('message', message)
  })

  socket.on('answer', (answerValue) => {
    Question.findOne({
      answer: 'Mars'
    })
    .then(result => {
      let goodAnswer = result.answer.toLowerCase()
      let input = answerValue.toLowerCase()
      console.log(goodAnswer)
      console.log(input)

      if(input === goodAnswer) {
        console.log('the question is right')
        io.emit('correctAnswer1', input)
      }
      else {
        io.emit('wrongAnswer1', input)
      }
    })
    .catch((err) => {
      console.log(err)
    })
  })

  socket.on('answer2', (answer2Value) => {
    Question.findOne({
      answer: "Jupiter"
    })
    .then(result => {
      let goodAnswer = result.answer.toLowerCase()
      let input = answer2Value.toLowerCase()
      console.log(goodAnswer)
      console.log(input)

      if(input === goodAnswer) {
        console.log('the question is right')
        io.emit('correctAnswer2', input)
      }
      else {
        io.emit('wrongAnswer2', input)
      }
    })
    .catch((err) => {
      console.log(err)
    })
  })

  socket.on('answer3', (answer3Value) => {
    Question.findOne({
      answer: "Neptune"
    })
    .then(result => {
      let goodAnswer = result.answer.toLowerCase()
      let input = answer3Value.toLowerCase()
      console.log(goodAnswer)
      console.log(input)

      if(input === goodAnswer) {
        console.log('the question is right')
        io.emit('correctAnswer3', input)
      }
      else {
        io.emit('wrongAnswer3', input)
      }
    })
    .catch((err) => {
      console.log(err)
    })
  })

  socket.on('answer4', (answer4Value) => {
    Question.findOne({
      answer: "Mercury"
    })
    .then(result => {
      let goodAnswer = result.answer.toLowerCase()
      let input = answer4Value.toLowerCase()
      console.log(goodAnswer)
      console.log(input)

      if(input === goodAnswer) {
        console.log('the question is right')
        io.emit('correctAnswer4', input)
      }
      else {
        io.emit('wrongAnswer4', input)
      }
    })
    .catch((err) => {
      console.log(err)
    })
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })

})



