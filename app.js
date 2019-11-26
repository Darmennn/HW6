var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mysql = require('mysql');

var app = express();

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.set('view engine', 'ejs');
app.set('Views', path.join(__dirname, 'Views'));

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "database"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});


//all users
app.get('/users', function(req, res) {
    con.query("SELECT * FROM user_table", function(error, result) {
        res.render('index', { result: result });
    });
});

//add user
app.get('/user/add', function(req, res) {
    res.render('add');
});

app.post('/user/add', urlencodedParser, function(req, res) {
    con.query("INSERT INTO user_table (name,surname,email) VALUES (?,?,?)", [req.body.name, req.body.surname, req.body.email], function(error, result) {
        if (error) {
            res.send(error);
        } else {
            res.send("User " + req.body.name + " " + req.body.surname + " successfully added!");
        }
    });
});

//edit user
app.get('/user/edit/:id', function(req, res) {
    con.query("SELECT * FROM user_table WHERE id=?", [req.params.id], function(error, result) {
        res.render('edit', { update: result });
    });
});

app.post('/user/edit/:id', urlencodedParser, function(req, res) {
    con.query("UPDATE user_table SET name = ?,surname = ?, email = ? where id = ?", [req.body.edit_name, req.body.edit_surname, req.body.edit_email, req.params.id], function(error, result) {
        if (error) {
            res.send(error);
        }else{
          res.send("User with id: " + req.params.id + " successfully updated!");
        }
    });
});

//delete user
app.get('/user/delete/:id', function(req, res) {
    con.query("DELETE FROM user_table WHERE id=?", [req.params.id], function(error, result) {
        if (error) {
            res.send(error);
        } else {
            res.send("User with id: " + req.params.id + " successfully deleted");
        }
    });
});
app.listen(7000);
