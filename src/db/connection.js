// Packages
import mongoose from 'mongoose'
import * as dotenv from 'dotenv'

// Setup dotenv
dotenv.config()


const DATABASE_URI = process.env.DATABASE_URI
const ENVIRONMENT = process.env.ENVIRONMENT


// Setup database
let db = mongoose.connection


// db config  
let mongooseConfig = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

console.log(`Environment: ${ENVIRONMENT}`);
if (ENVIRONMENT === "prod") {
    mongoose.connect(DATABASE_URI, mongooseConfig)
    console.log(`Connected to: ${DATABASE_URI}`);
}
// Connect to your local db
else {
    mongoose.connect(`mongodb://127.0.0.1:27017`, mongooseConfig)
    console.log(`Connected to: Local MongoDB`);
}

export default db