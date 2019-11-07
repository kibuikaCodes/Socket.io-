const express = require('express');
const router = express.Router();


// listening for any incoming connection
router.get("/", (req, res) => {
    res.send({ response: "Hey there" }).status(200);
});

module.exports = router;