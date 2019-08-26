const graphql = require('graphql');

// Describes types and relations between them
// GraphQLID allows string or int type
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList
} = graphql;

// Dummy data - connected to each other.
// USe authorID to connect to the book
const books = [
    {name: 'The Long Earth', genre: 'Fantasy', id: '2', authorID: '1'},
    {name: 'Status Anxiety', genre: 'Fiction', id: '1', authorID: '2'},
    {name: 'Undercover Economist', genre: 'Business', id: '3', authorID: '3'},
    {name: 'Adapt', genre: 'Business', id: '4', authorID: '3'}
];
const authors = [
    {name: 'Terry Pratchet', age: 45, id: '1'},
    {name: 'Alain de Botton', age: 50, id: '2'},
    {name: 'Tim Harford', age: 42, id: '3'}
];

// New type for a 'Book'
const BookType = new GraphQLObjectType({
    name: 'Book',
    // Define a function to fetch other data points
    // fields methiod returns an object of GraphQl types
    // Define data types using GraphQL's types imported above
    fields: () => ({
        // ID becomes a string inside the function
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: { 
            type:  AuthorType,
            resolve( parent, args ) {
                // If use requests author inside book query, reolve the associated author
                return books.find(book => book.authorId == args.authorId);
            }
        },
    })
})

// New type for a 'Author'
const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        // ID becomes a string inside the function using this type
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt }
    })
})

/* Define root queries (jump into graph)
Describes how a user can return the data from an entry point
Allows us to query from 'book' or 'author'
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
            args: { id: { type: GraphQLID } },
            // Resolve is what returns the result.
            resolve(parent, args) {
                console.log( typeof(args.id) );
                // Do the searching on books array. Return results
                return books.find(book => book.id == args.id);
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            // Resolve method is what returns the result.
            resolve(parent, args) {
                // Do the searching on authors array. Return results
                return authors.find(author => author.id == args.id);
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
}

Book request:
{
    book(id:2){
        name
        genre
        Author {
            name
        }
    }
}
*/