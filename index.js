const express = require('express'); 
const app = express();
const stripe = require('stripe');
var path = require('path');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;

var app_path = '/public';

//Mise en place des autorisation pour palier au problement d'accessibilité liée au CORS.
app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Header', 'Origin, X-requested-With, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow','GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static(__dirname+app_path));

app.post('/charge',(req, res)=>{
    console.log(req.body.stripeToken);
    console.log(req.body.email);
    console.log(req.body.name);
    try{
        stripe.customers.create({
            name: req.body.name,
            email: req.body.email,
            source: req.body.stripeToken
        })
        .then( customers => {
            stripe.charges.create({
                amount: req.body.amount * 100,
                currency: 'eur',
                customers: customers.id
            })
            .then(()=> res.sendFile(path.join(__dirname+app_path+'/success.html')))
            .catch(error =>console.log(error));
        })
    }
    catch(err){
        res.send(err);
    }
})

app.get('/*', (req, res)=>{
    res.sendFile(path.join(__dirname+app_path+'/index.html'));
});
app.listen(PORT,()=>console.log(`Listen on ${PORT}`));
