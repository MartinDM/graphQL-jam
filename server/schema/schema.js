const graphql = require('graphql');

// Describes types and relations between them
const { GraphQLObjectType, GraphQLSchema, GraphQLString } = graphql;

// Dummy data
const books = [
    {name: 'Name of the Wind', genre: 'Fantasy', id: '1'},
    {name: 'The Final Empire', genre: 'Fantasy', id: '2'},
    {name: 'The Long Earth', genre: 'Sci-Fi', id: '3'}
];

// New type for a 'Book'
const BookType = new GraphQLObjectType({
    name: 'Book',
    // Define a function to fetch other data points
    // fields methiod returns an object of GraphQl types
    // Define data types using GraphQL's types imported above
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        genre: { type: GraphQLString }
    })
})

/* Define root queries (jump into graph)
Describes how a user can return the data from an entry point
Allows us to query from 'book'
*/
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    // Types of Root query:
    // Could be for an author, an id or a title?
    // Expect user to pass one of these named args to find a book
    fields: {
        // When querying 'book' use this query...
        // Return a book type, and these are the args to use that are passed in with the query
        // Resolve method run on the result
        book: {
            type: BookType,
            args: { id: { type: GraphQLString } },
            // Resolve is what returns the result.
            resolve(parent, args) {
                // Do the searching on books array. Return results
                return books.find(book => book.id == args.id);
            }
        }
    }
});

// Specify which query to use
module.exports = new GraphQLSchema({
    query: RootQuery
});

/* 
Example query from front-end
book(id: '123'){
    name
    genre
} */