const express = require('express');
const mysql = require('mysql');

const app = express();

app.set('port', (process.env.PORT || 3001));

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production')
{
    app.use(express.static('client/build'));
}

const db_root = 'ao';

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'admin',
  database : db_root
});

connection.connect(function(err) {
    if (err) { throw err; }
    console.log('You are now connected...');
});

const root_prefix = db_root + '_';
const slideshow_table = root_prefix + 'slideshows';
const slides_table = root_prefix + 'slides';

var query = 
    'CREATE TABLE IF NOT EXISTS `' + slideshow_table +'` (' +
    '`id` int(11) unsigned NOT NULL AUTO_INCREMENT,' +
    '`file` VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,' +
    '`date_creation` datetime NULL DEFAULT NULL,' +
    '`date_modified` datetime NULL DEFAULT NULL,' +
    'UNIQUE (`file`),' +
    'PRIMARY KEY (`id`)' +
    ') ENGINE=MyISAM DEFAULT CHARSET=utf8;';

connection.query(query, function(err, rows, fields) {
    if (err) { throw err; }
});

var query =
    'CREATE TABLE IF NOT EXISTS `' + slides_table +'` (' +
    '`id` int(11) unsigned NOT NULL AUTO_INCREMENT,' +
    '`slideshow_id` int(11) unsigned NOT NULL,' +
    '`index` int(11) unsigned NOT NULL DEFAULT "0",' +
    '`data` TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,' +
    'PRIMARY KEY (`id`)' +
    ') ENGINE=MyISAM DEFAULT CHARSET=utf8;';

connection.query(query, function(err, rows, fields) {
    if (err) { throw err; }
});

app.get('/api/', (req, res) => 
{
    const param = req.query.q;

    if (!param)
    {
        res.json({
            error: 'Missing required parameter `q`',
        });
        return;
    }

    connection.query(param, function( err, rows, fields)
    {
        if (err) { throw err; }

        if (rows)
        {
            res.json(rows);
        }
        else
        {
            res.json([]);
        }
    });
});

app.get('/', (req, res) => {
    res.send("Server");
});

app.listen(app.get('port'), () => {
    console.log(`Find the server at: http://localhost:${app.get('port')}/`);
});

function exitHandler(options, err)
{
    connection.end();
    if (options.cleanup)
        console.log('clean');
    if (err)
        console.log(err.stack);
    if (options.exit)
        process.exit();
}

//do something when app is closing
//process.on('exit', exitHandler.bind(null, {cleanup: true}));
