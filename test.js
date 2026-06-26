require('dotenv/config');
const { inngestRouter } = require('./apps/api/src/server');
console.log(process.env.INNGEST_DEV);
