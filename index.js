import express from "express"
import cors from "cors"
import 'dotenv/config'

const app = express() ; 
const port = process.env.PORT || 5000 ;  

app.use(cors()) ; 
app.use(express.json()) ;

app.get("/" , (req , res) => {
    res.send("successfully connected")
})

app.listen(port, () => {
    console.log(`port is running at : ${port}`);
})