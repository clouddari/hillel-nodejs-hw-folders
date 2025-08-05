const mongoose = require("mongoose");
const connectDB = require("../db/db");
const Item = require("../models/Item");
const data = require("../data/books_movies_data.json");

async function seedItems() {
  try {
    await connectDB();

    let updated = 0;
    let created = 0;

    for (const newItem of data) {
      const existing = await Item.findOne({ id: newItem.id });

      if (existing) {
        await Item.findByIdAndUpdate(existing._id, newItem, { new: true });
        updated++;
        console.log(`Updated: ${newItem.name}`);
      } else {
        await Item.create(newItem);
        created++;
        console.log(`Added ${newItem.name}`);
      }
    }

    const finalCount = await Item.countDocuments();

    console.log(
      `\n Seed finished\n Updated: ${updated} \n Added: ${created}\n Total: ${finalCount}`
    );
  } catch (err) {
    console.error("error seeding items" + err);
  } finally {
    mongoose.disconnect();
  }
}

seedItems();
