import express from "express"
import cors from "cors"
import 'dotenv/config'
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rvz6g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {

    const tasksCollection = client.db("To-Do").collection("Tasks") ; 

    app.get("/tasks/user" , async(req, res) => {
      const email = req.query.email ;
    //   console.log(email);
      const filter = {author : email} ;
      const result = await tasksCollection.find(filter).toArray();
      res.send(result)
    })

    app.get("/tasks/:id" , async (req, res) => {
        const id = req.params.id ;
        const filter = {_id : new ObjectId(id)} ;
        const result = await tasksCollection.findOne(filter) ;
        res.send(result) ;
    })

    app.patch("/tasks/:id" , async (req , res) => {
        const id = req.params.id ; 
        const filter = {_id : new ObjectId(id)} ;
        const options = {upsert : true} ;
        const updatedDoc = req.body ;
        // console.log(updatedDoc , id);
        const task = {
            $set : {
               title : updatedDoc.updatedTitle, 
               description : updatedDoc.updatedDescription
            }
        }
        const result = await tasksCollection.updateOne(filter, task , options)
        res.send(result)
    })

    app.post("/tasks" , async (req , res) => {
      const newTask = req.body ; 
    //   console.log(newTask);
      const result = await tasksCollection.insertOne(newTask)
    //   console.log(result);
      res.send(result)
    })

    app.delete("/tasks/:id" , async (req, res) => {
        const id = req.params.id ; 
        const filter = {_id : new ObjectId(id)}
        const result = await tasksCollection.deleteOne(filter) ;
        res.send(result)
    })




    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get("/", (req, res) => {
    res.send("successfully connected")
})

app.listen(port, () => {
    console.log(`port is running at : ${port}`);
})