const express = require('express');
const axios  = require('axios');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();
const Chart = require('chart.js');

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
    var date2 = new Date( renderedData.data.lastUpdate);
    date = date2.toString();
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
            'global' : false
        };
    }
    else{
        
        var renderedData = await axios.get(`${url}/countries/${country}`);
        var dailyData = await axios.get("https://pomber.github.io/covid19/timeseries.json");
  //  console.log(dailyData.data.India.slice(Math.max(dailyData.data.India.length - 5, 0)));
        
        var finalArray = dailyData.data[`${country}`].slice(Math.max(dailyData.data[`${country}`].length - 5, 0));
        finalArray.reverse();
        
        var obj = {
            'confirmed' : renderedData.data.confirmed.value,
            'recovered' : renderedData.data.recovered.value,
            'deaths' : renderedData.data.deaths.value,
            'name' : country, 
            'countries' : countries.data.countries,
            'lastUpdate' : date,
            'global' : true,
            'dailyData' : finalArray
        };
    }

    res.render('index',obj);
})

var port = process.env.PORT || 3000;

app.listen(port,() => {
    console.log(port);
    console.log('Server started');
});
