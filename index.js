const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// db.recipes.find().sort({ likes: -1 }).limit(6)


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster.gymft31.mongodb.net/?retryWrites=true&w=majority&appName=Cluster`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const recipeCollection = client.db("recipeDB").collection("recipes");
        const userCollection = client.db("recipeDB").collection("Users")
        const chefCollection = client.db("recipeDB").collection("chefs")
        const feedbackCollection = client.db("recipeDB").collection("feedback")

        app.get('/top-recipes', async (req, res) => {

            const topRecipes = await recipeCollection.find().sort({ like: -1 }).limit(6).toArray();
            res.send(topRecipes);

        });


        app.get('/recipes', async (req, res) => {
            const result = await recipeCollection.find().toArray();
            res.send(result)
        })

        app.get('/recipes/:id', async (req, res) => {
            const id = req.params.id;
            const quarry = { _id: new ObjectId(id) }
            const result = await recipeCollection.findOne(quarry);
            res.send(result);
        })

        app.get('/my-recipes', async (req, res) => {

            const result = await recipeCollection.find().toArray();
            res.send(result)

        })

        app.post('/recipes', async (req, res) => {
            const newRecipe = req.body;
            const result = await recipeCollection.insertOne(newRecipe);
            res.send(result)

        })

        app.get('/chefs', async (req, res) => {
            const result = await chefCollection.find().toArray();
            res.send(result)
        })

        app.post('/chefs', async (req, res) => {
            const newChef = req.body;
            const result = await chefCollection.insertOne(newChef);
            res.send(result);
        })


        app.delete('/chefs/:id', async (req, res) => {
            const id = req.params.id;
            const quarry = { _id: new ObjectId(id) }
            const result = await chefCollection.deleteOne(quarry);
            res.send(result);
        })


        app.post('/feedback', async(req,res)=>{
            const newFeedback = req.body;
            const result = await feedbackCollection.insertOne(newFeedback);
            res.send(result);
        })

        app.put('/recipes/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedRecipe = req.body;
            const updateDoc = {
                $set: updatedRecipe
            }
            const result = await recipeCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })


        app.put('/recipes/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateRecipe = req.body;
            const updateDoc = {
                $set: updateRecipe.like
            }
            const result = await recipeCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })

        app.delete('/recipes/:id', async (req, res) => {
            const id = req.params.id;
            const quarry = { _id: new ObjectId(id) }
            const result = await recipeCollection.deleteOne(quarry);
            res.send(result);
        })

        // API......

        app.get('/users', async (req, res) => {
            const result = await userCollection.find().toArray();
            res.send(result)
        })

        app.post('/users', async (req, res) => {
            const userProfile = req.body;
            // console.log(userProfile);
            const result = await userCollection.insertOne(userProfile);
            res.send(result);
        })

        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);











app.get('/', (req, res) => {
    res.send('hello server')
})


app.listen(port, () => {
    console.log(`this site port on ${port} `)
})