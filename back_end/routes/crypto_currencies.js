const express = require('express');
const router = express.Router();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const axios = require('axios');

let crypto =  require('../models/crypto_currency');
let User = require('../models/user')
const host = "https://api.coincap.io/v2";

router.use(cors());

router.get('/preferences', async (req, res) => {
    let monais = [];
    console.log(req.headers.token)
    jwt.verify(req.headers.token, 'secretkey', (err, info) => {

        if (err) {
            res.json({"status": err})
        } else {
            User.findOne({username : info.payload.username}).then(usera=> {

                monais = usera.preferences
            })
        }
    })

    let reponse = await axios.get(host+"/assets");
    if (reponse.status == 200){
        let final = [];
        reponse.data.data.filter(i =>{
            if(monais.length)
            monais.forEach(m => {
                if (m == i.id){
                    i._id = m;
                    final.push(i);
                    return;
                }
        })});
        console.log(final)
        res.json(final);
    } else {
        res.json({"error": reponse.data});
    }
});

function retrieveToken(req, res, next) {
    const authorizationHeader = req.headers['authorization'];

    if (typeof authorizationHeader !== 'undefined') {
        const bearerAuthorisation = authorizationHeader.split(' ');
        req.token = bearerAuthorisation[1];
        next();
    } else {
        res.sendStatus(403);
    }
}
function jsonToList(cmids){ // {eza,aze} => ["eza", "aze"]
    let qlist = cmids;
    if (!qlist || qlist == "")
       return [];
    else{
        qlist = qlist.replace(" ", "");
        qlist = qlist.replace("{", "");
        qlist = qlist.replace("}", "");
        qlist = qlist.split(",");
    }

    return qlist;
}

router.get('/', async (req, res) => {
    let monais = [];

    qlist = jsonToList(req.query.cmids);
    let q = qlist;
    crypto.find({fullName: new RegExp(q, 'i')}, function(err, tmp) {
            monais = tmp;
     });
    let reponse = await axios.get(host+"/assets");
    if (reponse.status == 200){
        let final = [];
        reponse.data.data.filter(i =>{
            monais.forEach(m => {
                if (m.fullName == i.id){
                    i._id = m._id;
                    if (!final.includes(i))
                        if (qlist.length != 0)
                            final.push(i);
                        else if (qlist == 0)
                            final.push(i);
                    return;
                }
        })});
        res.json(final);
    } else {
        res.json({"error": reponse.data});
    }
});

router.get('/:cmid', async (req, res) => {
    // verifier dans la db qu'il est pressent 
    console.log('erreur')
    try{
        let reponse = await axios.get(host+"/assets/"+req.params.cmid);
        if (reponse.status == 200){
            console.log(reponse.data.data)
            res.json(reponse.data.data)
        } else {
            res.json({"error": reponse.data});
        }
    }
    catch(e){
        res.json({"error": e});
    }
});

router.get('/:cmid/history/:period', async (req, res) => {
    try {
        
        let now = new Date().getTime();
        let cmd = ""
        switch (req.params.period){
            case 'daily': 
                let dmois = new Date();
                dmois.setMonth(dmois.getMonth() - 2);
                dmois.setHours(dmois.getHours() + 24);
                cmd = "h2&end="+now+"&start="+dmois.getTime(); //h6 ou h12 pour moins de dates;
                break;
            case 'hourly':
                let djours = new Date();
                djours.setHours(djours.getHours() - 48);
                cmd = "m15&end="+now+"&start="+djours.getTime();
                break;
            case 'minute':
                let dheures = new Date();
                dheures.setHours(dheures.getHours() - 2);
                cmd = "m1&end="+now+"&start="+dheures.getTime();
            break;
            default:
                throw "Invald arguments";
        }
        console.log(host+"/assets/"+req.params.cmid+"/history?interval="+cmd);
        let reponse = await axios.get(host+"/assets/"+req.params.cmid+"/history?interval="+cmd);

        if (reponse.status == 200){
            console.log(reponse.data.data.length)
            res.json(reponse.data.data)
        } else {
            res.json({"error": reponse.data});
        }
    } catch (e){
        res.json({"error": e});
    }
    
});


router.post('/', (req, res) => {
    // Ajouter une nouvelle monaie dans la db pressent dans : host+/assets 
    
    jwt.verify(req.headers.token, 'secretkey', (err, infos) => {
        if (err) {
            res.json({"status": err});
        } else if (jwt.decode(req.headers.token).payload.role === 'USER') {
            res.json({"status": "vous n'êtes pas administrateur"});
        } else {
            const monnaie = {
                fullName: req.body.fullName
            };
            crypto.create(monnaie).then(moneyCreated =>
                res.json({"Money created": moneyCreated})
            ).catch(err => {
                res.json({"status": err})
            });
        }
    });
});

router.delete('/:cmid', (req, res) => {
    // retirer une monaie de la db 
    jwt.verify(req.headers.token, 'secretkey', (err, infos) => {
        if (err) {
            res.json({"status": err});
        } else {
            if (jwt.decode(req.headers.token).payload.role === 'USER') {
                res.json({"status": "Vous n'êtes pas administrateur"})
            } else {
                crypto.deleteMany({fullName: req.params.cmid}, (err) => {
                    if (err) {
                        res.json({"status": err});
                    } else {
                        res.json({"status": "ok"});
                    }
                })
            }
        }
    });
});



module.exports = router;