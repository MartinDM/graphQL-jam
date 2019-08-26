const express = require('express');
const app = express();

// Allows Express to understand GrphQl queries
// Requires an endpoint in Express that serves graphQL requests
const graphqlHTTP = require('express-graphql');
const schema =  require('./schema/schema');

// Express endpoint for GraphQL
// Pass in a schema to tell graph QL how the data will look
// Enable 'graphiql'
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))

app.listen(4000, () => {
    console.log('now listening for requests on port 4000');
});
