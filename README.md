# NASA Space Quiz
<img width="1390" alt="Schermafbeelding 2022-07-06 om 19 58 42" src="https://user-images.githubusercontent.com/70690100/177613755-d9e21d4b-d51a-4720-9aee-fc8cdcbbf211.png">

## De opdracht
Voor Real Time Web heb ik een real-time webapplicatie gemaakt waarbij er een open connectie is tussen de client en server side door middel van 
websockets. De webapplicatie is multi user supported en er wordt data gebruikt uit een externe data bron. 

## Mijn concept
Voor Real Time Web heb ik de NASA Space quiz ontwikkeld. De NASA Space quiz is een quiz waarbij meerdere gebruikers de juiste namen van vier verschillende
planeten moeten raden. De foto's die bij de planeten worden gerenderd zijn afkomstig van de NASA Photo and Video library API. Met deze API kon ik de 
meest prachtige foto's gebruiken voor de quiz. Bij elk goed antwoord verschijnt er een melding en worden alle gebruikers doorverwezen naar de volgende
pagina.

## De API
Voor mijn project heb ik de NASA Photo and Video library API gebruikt. Ik had aan het begin best wel veel problemen met de API en vind dan ook dat de 
documentatie van NASA erg vaag en vaak onjuist was. De base url was al gauw duidelijk alleen waren de te gebruiken endpoints zoals q= heel erg 
onduidelijk of werkte niet juist.

````
GET https://images-api.nasa.gov
````

Volgens NASA waren er verschillende endpoints waarbij je gemakkelijk specifiek naar foto's zou kunnen zoeken. Dit was echter niet het geval. De meeste
endpoints waren niet juist en kwamen er rare resultaten terug bij het proberen te fetchen van de data.
Dit waren de beschikbare endpoints:
<img width="342" alt="Schermafbeelding 2022-07-06 om 20 10 10" src="https://user-images.githubusercontent.com/70690100/177615499-87c92078-28ea-4d38-9d32-b6ab395a3485.png">

Om uiteindelijk één specifieke foto te kunnen renderen per planeet moest ik via ee NASA id zoeken zodat er maar een bepaalde foto zou terug komen. 
Op de website van de API kon ik gemakkelijk browsen tussen verschillende prachtige foto's van de planeten. Door de beschikbare id's kon ik via
het id endpoint zoeken naar één bepaalde foto.

Endpoint gebruikt voor foto planeet Jupiter:
````
const baseURLapi = 'https://images-api.nasa.gov/asset/PIA01492'
````
Echter was er een zware tegenvaller. Ik kwam er namelijk achter dat de id's meerdere foto's teruggaven na het fetchen van de data. Ik vond dit erg
apart omdat een id's meestal voor een specifiek object is. Dit heb ik gelukkig makkelijk kunnen oplossen door elke keer met een index alleen de 
eerste foto op te halen en alleen deze te renderen.

### Conclusie NASA Photo and Video library API
Voor een Amerikaanse overheidsinstantie vind ik de API zwaar tegenvallen. Ik vind dat de documentatie onjuist en vaag is. Hierdoor kost het 
veel tijd om uberhaupt iets van data te kunnen ophalen. Ik zou niet zo snel deze API meer gebruiken ongeacht de prachtige content die je eruit kan
krijgen. Als experiment heb ik eerder de picture of the day api gebruikt van NASA. Deze API was super makkelijk te gebruiken en had deze situatie daarom
niet verwacht.

## Database Mongodb
Voor de NASA Space quiz heb ik besloten om een database te gebruiken, dit omdat de API die ik gebruik alleen een foto levert als data. Dit terwijl 
de vragen die ik gebruik meer content zoals een een titel, hint en antwoord moeten hebben. Om van elke vraag daadwerkelijk een object te maken heb ik 
daarom besloten om al deze informatie op te slaan als een object in de database. Zo kan ik gemakkelijk per vraag de juiste data ophalen en renderen. 
Door het gebruik van de database is de juiste informatie aan de juiste vraag gekoppeld en heb ik hier gemakkelijk toegang tot.

### Connectie maken met de database
Voordat er data in de database kan worden gezet moet er eerst een connectie zijn met de database. Om makkelijk te communiceren met de database heb
ik gebruik gemaakt van Mongoose. Wat communiceren gemakkeijker maakt. 
````
const mongoose = require('mongoose');
const Question = require('./models/Question.js')
const { getEnvironmentData } = require('worker_threads')
const dbURI = 'mongodb+srv://<username>:<password>@nasaspacequiz.zrhfg.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) =>  console.log('Mongodb connected'))
  .catch((error) => console.log(error + 'has occured'))

http.listen(port, () => {
  console.log('Socket io application is running on ' + port)
})
````
Om een connectie te maken wordt eerst Mongoose geninstalleerd en tot een variabele gemaakt in de app.js. Tevens is het juiste datamodel nodig. 
In het volgende kopje wordt dit geheel uitgelegd. En als allerlaatst is de data base URI nodig, die de standaard naam dbURI heeft. Deze URI kan
gemakkelijk opgevraagd worden vanuit het Mongodb dashboard op het internet. Door middel van mongoose.connect wordt er uiteindelijk een connectie met
de database gemaakt. 

### Data Schema voor de quiz vragen
Om de data juist gestructureerd in de database te krijgen moet er in een Javascript bestand een Schema voor de quiz vragen worden opgesteld.
Dit Schema bepaald wat voor soort content er in de database moet worden geplaatst.

#### Question Schema
````
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    hint: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    }
})

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;
````
````
const Question = require('./models/Question.js')
````
In het Schema wordt er aangegeven dat elke vraag een titel, hint, foto en antwoord nodig heeft. Elk veld is een string en ze zijn ze allemaal een 
verplicht veld die nodig zijn voor het opstellen van een vraag. Om het Schema te koppelen aan een variabele wordt deze onder aan de pagina gedeclareerd door middel van mongoose.model. Dit geeft aan dat onder de naam Question het questionSchema hoort. Om het Schema te exporteren wordt module.export gebruikt en wordt deze later opgehaald in de app.js.

### Quiz vragen in database zetten
Om daadwerkelijk de quiz vragen in de database te zetten heb ik besloten om een simpele admin pagina te maken die een formulier bevat. Dit formulier
heeft voor elk dataveld een invoerveld waarin de juiste content kan worden geplaatst. 
<img width="1383" alt="Schermafbeelding 2022-07-06 om 20 56 44" src="https://user-images.githubusercontent.com/70690100/177622841-ff24bf95-ed4e-4b6d-a3c4-8b2ee53749cd.png">
````
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
````
In de app.post van de admin pagina wordt alle informatie van het formulier opgehaald. Met body-parser kon ik gemakkelijk door middel van req.body.'name'
de waardes van alle invoervelden ophalen. Op deze pagina wordt er vervolgens een nieuwe Question aangemaakt. Deze nieuwe vraag bevat het Question Schema 
waarbij alle waarden van de invoervelden aan de juiste datavelden worden gekoppeld. Nadat de data in het Schema is gezet wordt de data opgeslagen door 
middel van .save(). Daarna wordt de promise afgehandeld en wordt het resultaat in de console.log( ) gezet. Tevens wordt de admin pagina gerendert.

### Resultaat Mongodb Dashboard
<img width="1205" alt="Schermafbeelding 2022-07-06 om 21 04 39" src="https://user-images.githubusercontent.com/70690100/177624162-c273ff2c-22b5-4c1e-932e-5a5ea3cdbe42.png">

## Renderen van vragen
Voor het renderen van de vragen wordt gelijk in de app.get alle data vanuit de database opgehaald en hierbij de juiste foto opgehaald vanuit de NASA api door de meegegeven url
````
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
````
Bij elke vraag wordt er eerst gezocht in de database naar de bijbehorende titel. Als de titel is opgehaald dan wordt er ee variabele gemaakt van de url die nodig is om zometeen de juiste foto op te halen voor de vraag. Deze variabele wordt meegeven in he fetch( ) event. Na het fetchen van de data wordt in de .then meteen gezocht naar de data voor de volgende vraag. Zo wordt er in een stuk door per vraag gezocht naar de juiste data. Na het ophalen van de data van de laatste vraag wordt de index pagina gerendert en worden alle vragen als objecten meegegeven.

## Real Time Events
Voor de NASA Space Quiz zijn er verschillende real time events. Deze worden hieronder besproken en uitgelegd.

### Connection
Het connectie event wordt uitgevoerd wanneer er een gebruiker connect met de server. Als de gebruiker een verbinding maakt met de server krijgt.

#### Server side, connectie van gebruiker met server
deze zijn eigen persoonlijke user id.
````
io.on('connection', (socket) => {
  console.log('a user connected')
  console.log(socket.id)
 ````
 
### Name
Het tweede socket event is op name. Dit event wordt uitgevoerd wanneer iemand een gebruikersnaam voor de quiz aanmaakt. Wanneer
dit gedaan is wordt het formulier vanuit de client side gesubmit. Hier wordt door socket.emit aangegeven dat het 'name' event op de server moet worden uitgevoerd. Op de server wordt er van de data van de gebruiker een object gemaakt, deze wordt in een array gezet. Door middel van io.emit wordt het object meegegeven aan de clientside Javascript. In de clientside javascript wordt data van de gebruiker gerendert.

#### Client side, submit van gebruikersnaam
````
usernameForm.addEventListener('submit', event => {
    event.preventDefault();
    if(usernameInput.value) {
        socket.emit('name', usernameInput.value);
        usernameSection.classList.add('invisible');
        quizSection.classList.remove('invisible');
        usernameListSection.classList.remove('invisible');
    }
})
````
#### Server side, gebruikersdata in een object samenvoegen
````
socket.on('name', (name) => {
    let object = {username: name , id: socket.id, points: 0}
    users.push(object)
    io.emit('name', {username: name , id: socket.id, points: 0})
  })
````
#### Client side, renderen van de gebruikersdata
````
socket.on('name', user => {
    usernameList.insertAdjacentHTML('beforeend', 
    `<li id="text${user.id}"> 
        <p>${user.username}</p>
        <p>${user.points}</p>
    </li>`)
})  
````
### Answer events
Het answer event is opgedeeld in de events answer een tot en met vier. Ik had graag efficientere code willen gebruiken maar daar
ben ik door tijdsgebrek helaas niet meer aan toe gekomen. Het answer event is het event dat alle ingevulde antwoorden van de gebruikers controleerd om te kijken welke de juiste is. Het answer event vergelijkt de input met het antwoord van de vraag.
Bij een goed antwoord wordt het event correctAnswer op de client side uitgevoerd. Bij een fout antwoord wordt het event 
wrongAnswer uitgevoerd. Voor elke vraag werkt de code in principe het zelfde, de code wordt dus voor een vraag uitgelegd.

#### Client side, versturen van het antwoord
````
const answerForm = document.querySelector('#chat-form');
let input1 = document.querySelector('#quiz-input')

answerForm.addEventListener('submit', (event) => {
  event.preventDefault();
  let answerValue = input1.value;
  console.log(answerValue)
  socket.emit('answer', answerValue)
  answerValue = '';
})
````
In de client side van mijn webapp wordt de submit van het antwoord formulier allereerst afgehandeld. Op het submit event wordt er een variabele aangemaakt die de waarde van het invoerveld opslaat. Door middel van socket.emit wordt aangegeven dat het answer event moet worden uitgevoerd, hierbij wordt het answerValue meegegeven en kan deze variabele in de server side worden gebruikt.

#### Server side, ontvangen en controleren van antwoorden
````

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
 ````
Op de server worden de antwoorden van de gebruikers opgehaald en gecontroleerd met het antwoord van de vraag. Allereerst wordt 
de vraag in de database gezocht door middel van .findOne({)}. Het resultaat hiervan wordt in een variabele opgeslagen waarin wordt aangegeven dat het om het result.answer gaat. Met een if else statement wordt het goede antwoord vergeleken met de input van de gebruiker. Als dit zo is dan wordt door middel van io.emit het correctAnswer event op de clientside uitgevoerd. Is het antwoord fout? Dan wordt het event wrongAnswer op de client side uitgevoerd.

#### Client side, correctAnswer event
````
socket.on('correctAnswer1', (answerValue) => {
  alert(`The answer: ${answerValue} is correct!`)
  question1.classList.remove('question1');
  question1.classList.add('invisible')

  
  question2.classList.remove('invisible');
  question2.classList.add('question1')
})
````
Als de gebruiker de vraag goed heeft dan wordt er een melding naar alle gebruikers gestuurd met dat het antwoord goed is. Ook wordt
de vraag met client side javascript en css weggehaald en wordt de volgende vraag voor elke gebruiker zichtbaar gemaakt. De gebruikers worden doorverwezen naar de volgende vraag en gaan zo verder met de quiz.

#### Client side, wrongAnswer event
````
socket.on('wrongAnswer1', () => {
  alert(`The answer is not correct`)
})
````
Als het antwoord fout is krijgen alle gebruikers alleen een melding dat het antwoord niet goed is. De zelfde vraag blijft voor de gebruikers zichtbaar tot dat wél het goede antwoord is gegeven.

## Data Life Cycle
![datamodel](https://user-images.githubusercontent.com/70690100/177752446-7b48721e-6bb1-4757-a70f-e5b2e7a7f2a6.png)

## Data modeling
![datamodelling](https://user-images.githubusercontent.com/70690100/177754057-4e5f9792-7f5b-41ab-9e5a-3a5bf7eb70a9.png)

## Dependencies
* Node js
* Nodemon
* Node-fetch
* Express
* Mongoose
* body-parser

## Features
* Open connectie tussen server en client
* Foto's van planeten worden opgehaald uit NASA API
* Quizvragen opgeslagen in Mongodb database
* Aanmaken van username en id
* Samen een quiz spelen
* Antwoorden worden gecontroleerd

## Wishlist
* Efficientere code voor ophalen en renderen van alle quizvragen
* Efficientere code voor het controleren op het juiste antwoord
* Leaderboord die punten bij houdt per gebruiker
















