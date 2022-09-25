

    const express = require('express');
    var app=express();
    const router = express.Router();
    const bodyParser=require('body-parser');
    const path=require('path');

    const fetch = (...args) =>
        import('node-fetch').then(({default: fetch}) => fetch(...args));


       


        let config={
            temperature : null,
            wind_speed : null,
            weather : null,
            humidity : null,
            url: null,
            cityname: null
        }

        app.use(express.static(__dirname));
        app.use(bodyParser.urlencoded({extended: true}));   
        app.set('view engine','ejs');
        app.set('views', path.join(__dirname, '/views'));


        app.get('/',(req,res)=>{
            const url ='https://api.openweathermap.org/data/2.5/weather?q=Brampton&appid=${apikey}';
            const options = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Host': 'api.openweathermap.org/data/2.5/weather',
                    'X-RapidAPI-Key': 'apikey'
                }
            };
            
            fetch(url, options)
                .then(res => res.json())
                .then(d => {
                    var weather=d['weather']['0']['main'];
                    var temp=1.8*(d['main']['temp']-273)+32;
                    temp=temp.toFixed(2);
                    var wind_speed=d['wind']['speed'];
                    var humidity=d['main']['humidity'];
                    var iconCode=d['weather']['0']['icon'];
                    var name=d['name'];

                    config.weather =weather;
                    config.temperature=temp+' °F';
                    config.wind_speed="Wind-Speed: "+ wind_speed +" mph";
                    config.humidity='Humidity: '+ humidity +" %";
                    config.url="http://openweathermap.org/img/wn/"+iconCode+"@2x.png";
                    config.cityname=name;
                    res.render('weather',config);
                })

            
         })

        app.post('/',function (req, res) {
            var city=req.body.yourcity;
        
            var city=String(city);
            const url ='https://api.openweathermap.org/data/2.5/weather?q='+city+'&appid=${apikey}';
            const options = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Host': 'api.openweathermap.org/data/2.5/weather',
                    'X-RapidAPI-Key': 'apikey'
                }
            };
            
            fetch(url, options)
                .then(res => res.json())
                .then(d => {
                    var weather=d['weather']['0']['main'];
                    var temp=1.8*(d['main']['temp']-273)+32;
                    temp=temp.toFixed(2);
                    var wind_speed=d['wind']['speed'];
                    var humidity=d['main']['humidity'];
                    var iconCode=d['weather']['0']['icon'];
                    var name=d['name'];

                    config.weather =weather;
                    config.temperature=temp+' °F';
                    config.wind_speed="Wind: "+ wind_speed +" mph";
                    config.humidity='Humidity: '+ humidity +" %";
                    config.url="http://openweathermap.org/img/wn/"+iconCode+"@2x.png";
                    config.cityname=name;
                    res.render('weather',config);
                         
                })
                .catch(err => console.error('error:' + err));
        });

    app.use('/',router);
    app.listen(process.env.port || 3000);
    module.exports = router;
    
