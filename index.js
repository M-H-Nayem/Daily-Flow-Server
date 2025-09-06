const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@practiceproject.bqp75eo.mongodb.net/?retryWrites=true&w=majority&appName=PracticeProject`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const db = client.db("Daily-Flow"); // database name
    const schedulesCollection = db.collection("schedules");
    const transactionsCollection = db.collection("transactions");
    const qnaCollection = db.collection("qna");
    const tasksCollection = db.collection("tasks");

    app.get("/", (req, res) => {
      res.send("Daily Flow Server Site is running");
    });

    app.get("/schedule", async (req, res) => {
      let { email } = req.query;
      let query = { user_email: email };

      let result = await schedulesCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/schedule", async (req, res) => {
      try {
        let newClass = req.body;
        // console.log("DATA FROM BODY", newClass);
        let result = await schedulesCollection.insertOne(newClass);
        res.status(201).send(result);
      } catch (error) {
        console.error("Error adding new class:", error);
        res.status(500).send({ message: "Failed to add new class." });
      }
    });

    app.put("/schedule/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        
        // Remove the immutable _id field from the updatedData
        delete updatedData._id;

    

        const result = await schedulesCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedData }
        );
        if (result.matchedCount === 0) {
            return res.status(404).send("Class not found.");
        }
        res.status(200).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to update class.");
    }
});


    app.delete("/schedule/:id", async (req, res) => {
      const id = req.params.id;

    //   console.log(id);
      const result = await schedulesCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

 app.get("/transactions", async (req, res) => {
      let { email } = req.query;
      let query = { user_email: email };

      let result = await transactionsCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/transactions", async (req, res) => {
      try {
        let newTransaction = req.body;
        // console.log("DATA FROM BODY", newTransaction);
        let result = await transactionsCollection.insertOne(newTransaction);
        res.status(201).send(result);
      } catch (error) {
        // console.error("Error adding new class:", error);
        res.status(500).send({ message: "Failed to add new class." });
      }
    });

    app.put("/transactions/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        
        delete updatedData._id;

        // console.log(`Updating class with ID: ${id}`);
        // console.log('Received data:', updatedData);

        const result = await transactionsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedData }
        );
        if (result.matchedCount === 0) {
            return res.status(404).send("Class not found.");
        }
        res.status(200).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to update class.");
    }
});



    app.delete("/transactions/:id", async (req, res) => {
      const id = req.params.id;

    //   console.log(id);
      const result = await transactionsCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });




    app.get("/qna", async (req, res) => {
  try {
    const { type, difficulty,  } = req.query;

    let filter = {};

    if (type) {
      filter.type = type;
    }

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    let result = await qnaCollection.find(filter).toArray();

    res.send(result);
  } catch (error) {
    console.error("Error fetching Q&A data:", error);
    res.status(500).send("An error occurred while fetching data.");
  }
});


app.get('/tasks', async (req, res) => {
    let {email} = req.query
    let query = {user_email:email}
  try {
    const tasks = await tasksCollection.find(query).toArray();
    res.send(tasks);
  } catch (error) {
    res.status(500).send('Error fetching tasks.');
  }
});

// 2. Add a new task
app.post('/tasks', async (req, res) => {
  try {
    const newTask = req.body;
    const result = await tasksCollection.insertOne(newTask);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).send('Error adding task.');
  }
});

// 3. Update a task by ID
app.put('/tasks/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updatedTask = req.body;
    const filter = { _id: new ObjectId(id) };
    const updateDoc = { $set: updatedTask };
    const result = await tasksCollection.updateOne(filter, updateDoc);
    if (result.matchedCount === 0) {
      return res.status(404).send('Task not found.');
    }
    res.json(result);
  } catch (error) {
    res.status(500).send('Error updating task.');
  }
});

// 4. Delete a task by ID
app.delete('/tasks/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await tasksCollection.deleteOne(query);
    if (result.deletedCount === 0) {
      return res.status(404).send('Task not found.');
    }
    res.json(result);
  } catch (error) {
    res.status(500).send('Error deleting task.');
  }
});



  } finally {
  }
}
run().catch(console.dir);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
