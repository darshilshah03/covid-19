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
    res.render('index',{
        'confirmed' : renderedData.data.confirmed.value,
        'recovered' : renderedData.data.recovered.value,
        'deaths' : renderedData.data.deaths.value,
        'name' : 'Global', 
        'countries' : countries.data.countries,
        'lastUpdate' : date
    })
    
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
            'lastUpdate' : date
        };
    }
    else{
        var renderedData = await axios.get(`${url}/countries/${country}`);
        var obj = {
            'confirmed' : renderedData.data.confirmed.value,
            'recovered' : renderedData.data.recovered.value,
            'deaths' : renderedData.data.deaths.value,
            'name' : country, 
            'countries' : countries.data.countries,
            'lastUpdate' : date
        };
    }

    res.render('index',obj);
})

var port = process.env.PORT || 3000;

app.listen(port,() => {
    console.log(port);
    console.log('Server started');
});