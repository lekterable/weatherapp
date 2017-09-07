const bodyParser = require('body-parser')
const path = require('path')
const http = require('http')

const express = require('express')
const app = express()

//Silnik szablonów
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
//Body Parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
//Folder publiczny
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res)=>{
  res.render('index')
})
app.get('/users/login', (req, res)=>{
  res.send('Do zrobienia Logowanie')
})
app.get('/users/register', (req, res)=>{
  res.send('Do zrobienia Rejestracja')
})

app.post('/', (req, res)=>{
  http.request({
    host: 'api.openweathermap.org',
    path: '/data/2.5/weather?q='+req.body.city.replace(" ", "+")+'&APPID=06e5fdd3ecb076d68f8f8e9eefbd492d&units=metric'
  }, (weather)=>{
    weatherData = ''
    weather.on('data', (chunk)=>{
      weatherData+=chunk
    })
    weather.on('end', ()=>{
      data = JSON.parse(weatherData)
      res.render('index', {
        weather:data.main.temp,
        city: req.body.city
      })
    })
  }).end()
})

app.listen(3000, ()=>{
  console.log('Serwer uruchomiony na porcie 3000')
})
