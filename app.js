const http = require('http');

const hostname = '127.0.0.1';
const port = 3004;

const express = require('express');
const app = express();

const es6renderer = require ('express-es6-template-engine');
app.engine('html', es6renderer)
app.set('views', 'templates');
app.set('view engine','html');

const server = http.createServer(app);

const db = require ('./db');


app.get('/', (req, res) => {
    res.render('home', {
        locals: {
            title: "Celebrity Dogs"
        },
        partials: {
            head: '/partials/head'
        }
    });
});

app.get('/dog', (req, res) => {
    console.log("request path is: "+ req.path);
    res.render('breed-list', {
        locals: {
            dog: db,
            path: req.path,
            title: "Breed List",

        },
        partials: {
            head: '/partials/head',
            dogPartial: '/partials/dog-image'
        }
    });
});

app.get("/dog/:breed", (req, res) => {
    console.log(req.params.breed);
    var {breed} = req.params;

    var dog = db.find(thisDog => thisDog.breed === breed);
    if (dog) {
        res.render('dog', {
            locals: {
                dog: dog,
                title: "Dog",
                dogImage: dog.image

            },
            partials: {
                head: '/partials/head',
                dogPartial: '/partials/dog-image'
            }
        });                         
    } else {
        res.status(404);
        res.send('There is no dog by that breed');
    }  
})

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
