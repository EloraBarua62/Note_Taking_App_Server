const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000; 
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ddwoo.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function main(){
    try{
        await client.connect();
        const notesCollection = client.db("NoteFriend").collection("notes");



        // Existing notes view API
        app.get('/all_notes/:email', async (req, res) => {
            const email = req.params.email;
            const query = {email:email}
            const cursor = notesCollection.find(query);
            const allNotes = await cursor.toArray();
            console.log(query);
            res.send(allNotes.reverse());
        })


        // New note store API
        app.post('/new_note',async(req,res) => {
            const newNote = req.body;
            const result = await notesCollection.insertOne(newNote);
            // console.log(result)
            // res.send(result);
            // const query = {email: newNote.email}
            // const cursor = notesCollection.find(query);
            // const allNotes = await cursor.toArray();
            // console.log(query);
            // res.send(allNotes.reverse());
            res.send(result)
        })


        // New note store API
        app.put('/update_note/:id',async(req,res) => {
            const id = req.params.id;
            const note_details = req.body;
            const filter = { _id: ObjectId(id) };
            const options = {upsert:true};
            const updateDoc = {
                $set: note_details
            }
            const result = await notesCollection.updateOne(filter , updateDoc , options);
            res.send(result)

            // const query = { email: note_details.email }
            // const cursor =  notesCollection.find(query);
            // const allNotes = await cursor.toArray();
            // console.log(query);
            // res.send(allNotes.reverse());
        })


        // New note store API
        app.delete('/delete_note/:id',async(req,res) => {
            // const id = JSON.parse(req.params.id);
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const result = await notesCollection.deleteOne(query);
            // console.log(result)
            res.send(result);
            // const search = req.body
            // console.log(search)
            // const cursor =  notesCollection.find(search);
            // const allNotes = await cursor.toArray();
            // console.log(result);
            // res.send(allNotes.reverse());
        })

        
    }
    finally{

    }
}
main().catch(console.dir);




// API 
app.get('/' , (req,res) => {
    res.send('NoteFriend server is running');
});

app.listen( port , ()=>{
    console.log('NoteFriend app port is',port);
})