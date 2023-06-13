const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const port = 3000;

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
})

app.post('/', (req, res) => {
    const FNAME = req.body.fname
    const LNAME = req.body.lname
    const email = req.body.email
    const password = req.body.password

    const data = {
        members: [{
            email_address: email,
            password: password,
            status: "subscribed",
            merge_fields: {
                FNAME: FNAME,
                LNAME: LNAME,
            }
        }]
    }
    var Jsondata = JSON.stringify(data);

    const url = "https://us9.api.mailchimp.com/3.0/lists/f43350f7a6"
    const Option = {
        method: "POST",
        auth: "Anish:" + "d1b6e4" + "793c0eb" + "734d15a1" + "5610fc9ab" + "d5-us9"                
    }
    const request = https.request(url, Option, (response) => {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html")
        }
        else {
            res.sendFile(__dirname + "/failure.html")
        }


        response.on("data", (data) => {
            console.log(JSON.parse(data));
        })
    })
    request.write(Jsondata);
    request.end();
});

app.post('/failure', (req, res) => {
    res.redirect("/")
})

app.listen(process.env.PORT || port, () => {
    console.log("Server is running at port 3000");
})
