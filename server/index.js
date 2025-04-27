require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const connectDB = require('./db');
const typeDefs = require('./graphql/schemas'); 
const resolvers = require('./graphql/resolvers');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Start Apollo Server
async function startServer() {
    const server = new ApolloServer({ typeDefs, resolvers  ,  context: ({ req }) => {
        const token = req.headers.authorization || ''; 
        return { token }; 
      }});
    await server.start();
    server.applyMiddleware({ app });
    await connectDB();

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}${server.graphqlPath}`);
    });
}

startServer();
