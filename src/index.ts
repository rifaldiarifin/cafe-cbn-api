import createServer from './utils/server'
import connectAndStartingServer from './utils/connectDB'

// Prepare Server
const app = createServer()

// Connect to Database then start the server
connectAndStartingServer(app)
