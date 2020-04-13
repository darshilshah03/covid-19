const express = require('express');
const axios  = require('axios');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

var url = 'https://covid19.mathdro.id/api';

var date;

app.get('/', async (req,res) =>  {
    
    var renderedData = await axios.get(url);
    var countries = await axios.get(`${url}/countries`);

    //console.log(countries);
    date = new Date( renderedData.data.lastUpdate);
    console.log(date);
    // var dailyData = await axios.get("https://pomber.github.io/covid19/timeseries.json");
    // console.log(dailyData.data.India.slice(Math.max(dailyData.data.India.length - 5, 0)));
    res.render('index',{
        'confirmed' : renderedData.data.confirmed.value,
        'recovered' : renderedData.data.recovered.value,
        'deaths' : renderedData.data.deaths.value,
        'name' : 'Global', 
        'countries' : countries.data.countries,
        'lastUpdate' : date
    })
    // fetch("https://pomber.github.io/covid19/timeseries.json").then(response => response.json())
    // .then(data => console.log(data));
    

    
});

app.post('/country',async (req,res) => {
    var country = req.body.country;
    var countries = await axios.get(`${url}/countries`);
   
    if(country=='Global')
    {
        var renderedData = await axios.get(url);
        var obj = {
            'confirmed' : renderedData.data.confirmed.value,
            'recovered' : renderedData.data.recovered.value,
            'deaths' : renderedData.data.deaths.value,
            'name' : 'Global', 
            'countries' : countries.data.countries,
            'lastUpdate' : date,
            'global' : true
        };
    }
    else{
        
        var renderedData = await axios.get(`${url}/countries/${country}`);
        var dailyData = await axios.get("https://pomber.github.io/covid19/timeseries.json");
  //  console.log(dailyData.data.India.slice(Math.max(dailyData.data.India.length - 5, 0)));
        var finalArray = dailyData.data.India.slice(Math.max(dailyData.data.India.length - 5, 0));
        finalArray.reverse();
        console.log(finalArray);
        var obj = {
            'confirmed' : renderedData.data.confirmed.value,
            'recovered' : renderedData.data.recovered.value,
            'deaths' : renderedData.data.deaths.value,
            'name' : country, 
            'countries' : countries.data.countries,
            'lastUpdate' : date,
            'global' : false
        };
    }

    res.render('index',obj);
})

var port = process.env.PORT || 3000;

app.listen(port,() => {
    console.log(port);
    console.log('Server started');
});