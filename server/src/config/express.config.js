const express = require('express');
const route = require('./router.config');
const cors = require('cors')
const helmet = require('helmet')
const {rateLimit} = require('express-rate-limit')
require('./mongoose.config');

const app = express();

app.use(cors({
    origin: 'http://localhost:5173'
}))

const limiter = rateLimit({
    windowMs: 15 * 60 * 60 * 1000,
	limit: 10000,
})

app.use(limiter)

app.use(helmet())

app.use(express.urlencoded({
    extended: true,
    limit: '10mb'
}));

app.use(express.json({
    limit: '2mb'
}));

app.use('/api/', route);

//Routing handling for the invalid urls 
app.use((req, res, next) => {
    res.json({
        data: '',
        code: 404, 
        status: "Invalid Url",
        message: "Entered Url is invalid one check it again",
        options: null
    })
});

//Global Middleware
app.use((error, req, res, next) => {
    let data = error.data || null;
    let code = error.code || 500;
    let status = error.status || "Server Timeout";
    let message = error.message || "Connection failed. Try again after sometime";
    let options = error.options || null;

    res.status(code).json({
        data: data, 
        status: status,
        message: message, 
        options: options
    })
})

module.exports = app;