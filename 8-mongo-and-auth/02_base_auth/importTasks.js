const { MongoClient } = require("mongodb");
const fs = require("fs");

const mongoUrl = "mongodb://127.0.0.1:27017";
const client = new MongoClient(mongoUrl);

async function run() {
  try {
    await client.connect();
    const db = client.db("site");
    const tasksCollection = db.collection("tasks");

    const tasks = JSON.parse(fs.readFileSync("tasks.json", "utf-8"));

    await tasksCollection.deleteMany();
    await tasksCollection.insertMany(tasks);

    console.log("Tasks imported successfully!");
  } catch (err) {
    console.error("Import failed:", err);
  } finally {
    await client.close();
  }
}

run();
