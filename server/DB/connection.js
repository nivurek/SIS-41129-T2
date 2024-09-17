import { MongoClient, ServerApiVersion } from "mongodb";
import bcrypt from 'bcrypt';  // For password hashing
import jwt from 'jsonwebtoken';  // For generating JWT
const uri = "mongodb+srv://La****:*******@chromaux.tbtnm.mongodb.net/users?retryWrites=true&w=majority"
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectDB() {
try {
  // Connect the client to the server
  await client.connect();
  // Send a ping to confirm a successful connection
  await client.db("admin").command({ ping: 1 });
  console.log(
   "Pinged your deployment. You successfully connected to MongoDB!"
  );
} catch(err) {
  console.error(err);
}
}

connectDB();
let db = client.db("chromaDB");
export default db;