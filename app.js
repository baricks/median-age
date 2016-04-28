var express = require('express');
var app = express();

app.use(express.static('public'));

app.listen(process.env.PORT || 3001, function() {
    console.log('Life expectancy app listening');

});