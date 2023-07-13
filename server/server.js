const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const mongoUrl = 'mongodb+srv://JdData:badal.123@jddata.0w8cjsn.mongodb.net//';
const dbName = 'jdData';
const collectionName = 'positionData';

// Helper function to establish a connection to MongoDB
const connectToDatabase = async () => {
  const client = new MongoClient(mongoUrl, { useUnifiedTopology: true });
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(collectionName);
  return collection;
};

// Create a new item
app.post('/items', async (req, res) => {
  try {
    const collection = await connectToDatabase();
    const newItem = req.body;
    const result = await collection.insertOne(newItem);
    res.json(result.ops[0]);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Error creating item' });
  }
});

// Read all items
app.get('/items', async (req, res) => {
  try {
    const collection = await connectToDatabase();
    const items = await collection.find().toArray();
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Error fetching items' });
  }
});

// Read a single item
app.get('/items/:id', async (req, res) => {
  try {
    const collection = await connectToDatabase();
    const itemId = req.params.id;
    const item = await collection.findOne({ _id: ObjectId(itemId) });
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ error: 'Error fetching item' });
  }
});

// Update an item
app.put('/items/:id', async (req, res) => {
  try {
    const collection = await connectToDatabase();
    const itemId = req.params.id;
    const updatedItem = req.body;
    const result = await collection.updateOne(
      { _id: ObjectId(itemId) },
      { $set: updatedItem }
    );
    if (result.modifiedCount === 1) {
      res.json({ message: 'Item updated successfully' });
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Error updating item' });
  }
});

// Delete an item
app.delete('/items/:id', async (req, res) => {
  try {
    const collection = await connectToDatabase();
    const itemId = req.params.id;
    const result = await collection.deleteOne({ _id: ObjectId(itemId) });
    if (result.deletedCount === 1) {
      res.json({ message: 'Item deleted successfully' });
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Error deleting item' });
  }
});

// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});