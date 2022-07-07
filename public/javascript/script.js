let socket = io()
let messages = document.querySelector('#quiz-chat')

const quizSection = document.querySelector('#quiz');

//USERNAME
const usernameSection = document.querySelector('#username-section');
const usernameForm = document.querySelector('#username-form');

let usernameInput = document.querySelector('#username-input');
let usernameList = document.querySelector('#usernameList');

const usernameListSection = document.querySelector('#username');

usernameForm.addEventListener('submit', event => {
    event.preventDefault();
    if(usernameInput.value) {
        socket.emit('name', usernameInput.value);
        usernameSection.classList.add('invisible');
        quizSection.classList.remove('invisible');
        usernameListSection.classList.remove('invisible');
    }
})

socket.on('name', user => {
    usernameList.insertAdjacentHTML('beforeend', 
    `<li id="text${user.id}"> 
        <p>${user.username}</p>
        <p>${user.points}</p>
    </li>`)
})  

let question1 = document.querySelector('#vraag1');
let question2 = document.querySelector('#vraag2');
let question3 = document.querySelector('#vraag3');
let question4 = document.querySelector('#vraag4')
// let question4 = document.querySelector('#vraag4');

//QUESTION 1
const answerForm = document.querySelector('#chat-form');
let input1 = document.querySelector('#quiz-input')

answerForm.addEventListener('submit', (event) => {
  event.preventDefault();
  let answerValue = input1.value;
  console.log(answerValue)
  socket.emit('answer', answerValue)
  answerValue = '';
})


socket.on('correctAnswer1', (answerValue) => {
  alert(`The answer: ${answerValue} is correct!`)
  question1.classList.remove('question1');
  question1.classList.add('invisible')

  
  question2.classList.remove('invisible');
  question2.classList.add('question1')
})

socket.on('wrongAnswer1', () => {
  alert(`The answer is not correct`)
})

// QUESTION 2
const answer2Form = document.querySelector('#question2-form');
let input2 = document.querySelector('#question2-input');

answer2Form.addEventListener('submit', (event) => {
  event.preventDefault();
  let answer2Value = input2.value;
  socket.emit('answer2', answer2Value)
  answer2Value = '';
})

socket.on('correctAnswer2', (answer2Value) => {
  alert(`The answer: ${answer2Value} is correct!`)

  question2.classList.remove('question1')
  question2.classList.add('invisible');

  question3.classList.remove('invisible')
  question3.classList.add('question1')
})

socket.on('wrongAnswer2', () => {
  alert('The answer is incorrect')
})

//QUESTION 3
const answer3Form = document.querySelector('#question3-form');
let input3 = document.querySelector('#question3-input');

answer3Form.addEventListener('submit', (event) => {
  event.preventDefault();
  let answer3Value = input3.value;
  socket.emit('answer3', answer3Value)
  answer3Value = '';
})

socket.on('correctAnswer3', (answer3Value) => {
  alert(`The answer: ${answer3Value} is correct!`)

  question3.classList.remove('question1')
  question3.classList.add('invisible');

  question4.classList.remove('invisible')
  question4.classList.add('question1')
})

socket.on('wrongAnswer3', () => {
  alert('The answer is incorrect')
})

//QUESTION 4
const answer4Form = document.querySelector('#question4-form');
let input4 = document.querySelector('#question4-input');

answer4Form.addEventListener('submit', (event) => {
  event.preventDefault();
  let answer4Value = input4.value;
  socket.emit('answer4', answer4Value)
  answer4Value = '';
})

socket.on('correctAnswer4', (answer4Value) => {
  alert(`The answer: ${answer4Value} is correct!`)
  quizSection.classList.add('invisible')
  let footer = document.querySelector('footer');
  footer.classList.add('invisible')

  let endText = document.querySelector('#end');
  endText.classList.remove('invisible')
})

socket.on('wrongAnswer4', () => {
  alert('The answer is incorrect')
})