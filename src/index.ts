import app from './server'
import dotenv from 'dotenv'
dotenv.config()
import config from './config'
app.listen(config.port,() => {
    console.log(`server running in ${config.port}`)
})