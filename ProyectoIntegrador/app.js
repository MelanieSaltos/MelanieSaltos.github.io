const express =require('express');
const path =require('path');
const bodyParser =require('body-parser');
const app= express();

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User   = require('./user ');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

app.use(express.static(path.join(__dirname, 'public')))

const mongo_urli= 'mongodb+srv://msaltosv:melanie12345@cluster0.qgyrcfv.mongodb.net/?retryWrites=true&w=majority'

mongoose.connect(mongo_urli, function(err){
    if (err){
        throw err;
    }else {
        console.log(`Successfully connected to ${mongo_urli} `);
    }
});

app.post('/register', (req,res)=>{
    const{username, password}=req.body;

    const user= new User({username, password});
    user.save(err=>{
        if (err) {
            res.status(500).send('ERROR AL REGISTRAR EL USER')
        } else {
            res.status(200).send(' USUARIO REGISTRAR CORRECTAMENTE')
        }
    });
});

app.post('/authenticate', (req,res)=>{
    const{username, password}=req.body;
    User.FindOne({username}, (err,user)=>{
        if (err) {
            res.status(500).send('ERROR AL AUTENTIFICAR AL USUARIO')
        } else if(!user){
            res.status(200).send(' EL USUARIO EXISTE')
        }else{
            user.isCorrectPassword(password, (err, result)=>{
                if (err) {
                    res.status(500).send('ERROR AL AUTENTIFICAR AL USUARIO')
                }else  if(result){
                    res.status(200).send(' USUARIO AUTENTIFICADO CORRECTAMENTE')
                }else{
                    res.status(500).send('USUARIO O CONTRASEÑA INCORRECTA')
                }
            });
        }
    })
});

app.listen(3000,() =>{
    console.log('server started');
});
module.exports=app