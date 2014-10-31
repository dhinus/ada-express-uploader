var express = require('express');
var router = express.Router();

/*POST to submitentries */
router.post('/submitentries', function(req, res) {
    var db = req.db;
    console.log('Entries data: ' + JSON.stringify(req.body, null, 2));
    db.collection('entries').insert(req.body, function(err, result) {
        res.send(
            (err === null) ? {msg: ''} : {msg: err} 
        );
    });
    console.log('Called submitentries');
});

module.exports = router;
