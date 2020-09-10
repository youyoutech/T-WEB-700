const express = require('express');
const router = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const axios = require('axios');

let PressReview = require('../models/press_review');
 
router.use(cors());

function filterResult(result){
    return result;
}

router.get('/', async (req, res) => {
    res.json(await axios.get("https://cryptocontrol.io/api/v1/public/news",{headers:
    {
        'x-api-key': 'e5fac5a19389904ee481a7e0396d185e'
    }
    }).then((result) => {
        return result.data;
    }).catch((err) => {
        return err;
    }));
});

router.get('/:id', async (req, res) => {
    res.json(await axios.get("https://cryptocontrol.io/api/v1/public/news",{headers:
    {
        'x-api-key': 'e5fac5a19389904ee481a7e0396d185e'
    }
    }).then((result) => {
        let final = result.data.filter(article => article._id == req.params.id)
        return final;
    }).catch((err) => {
        return err;
    }));
});
module.exports = router;