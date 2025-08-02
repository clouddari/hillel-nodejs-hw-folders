const mongoose = require("mongoose");
const connectDB = require("../db/db");
const Page = require("../models/page");
const data = require("../data/page.json");

async function seedPages() {
  try {
    await connectDB();

    let updated = 0;
    let created = 0;

    for (const newPage of data) {
      const existing = await Page.findOne({ "caption.ua": newPage.caption.ua });

      if (existing) {
        await Page.findByIdAndUpdate(existing._id, newPage, { new: true });
        updated++;
        console.log(`updated ${newPage.caption.ua}`);
      } else {
        await Page.create(newPage);
        created++;
        console.log(`added ${newPage.caption.ua}`);
      }
    }

    const finalCount = await Page.countDocuments();
    console.log(
      `\n Stats: \n Updated: ${updated} \n  Added: ${created} \n TOTAL: ${finalCount}`
    );
  } catch (err) {
    console.error("error" + err);
  } finally {
    mongoose.disconnect();
  }
}

seedPages();
