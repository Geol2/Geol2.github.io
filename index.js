const express = require('express')
const app = express()
const ejs = require('ejs');

app.set('views', __dirname + '/views');
app.set("view engine", "ejs");
app.engine("html", ejs.renderFile);

app.use('/', express.static('./public'));

app.get('/', (req, res) => {
  res.render('index');
})

app.listen(5000)