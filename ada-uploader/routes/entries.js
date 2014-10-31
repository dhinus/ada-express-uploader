var express = require('express');
var router = express.Router();

/*GET entries list */
router.get('/', function(req, res) {
	var db = req.db;
	db.collection('entries').find().toArray(function (err, entries) {
		res.json(entries);
	});
});

module.exports = router;

