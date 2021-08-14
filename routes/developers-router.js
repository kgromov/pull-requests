const express = require("express");
const router = express.Router();

const Developer = require("./../model/developer").Developer;

router.get("/", async (req, res) => { 
    const developers = await Developer.find({}).sort({name: 1});
    res.render('developers', {developers: developers});  
});

router.post("/", async (req, res) => { 
    const devName = req.body.name;
    const newDev = new Developer({name: devName});
    const result = await newDev.save();
    console.log(`New dev ${result} created`);
    res.redirect('/'); 
});

router.get("/:developerId", async (req, res) => { 
    const developerId = req.params.developerId;   
    const developers = await Developer.findById(developerId);
    // TODO: another view with submit form - count of prs (sprint specified explicitly or last sprint)
    // res.render('developers', {developers: developers});  
});

module.exports = router;