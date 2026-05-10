require("dotenv").config();

const axios = require("axios");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 PUT YOUR GEMINI API KEY HERE
const API_KEY = process.env.GEMINI_API_KEY;

const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
const BASE_ID = process.env.BASE_ID;
const TABLE_NAME = process.env.TABLE_NAME;

app.post("/chat", async (req, res) => {
  console.log("📩 REQUEST RECEIVED:", req.body);

  const userMsg = req.body.message;

  try {
    const response = await fetch(
  "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=" + API_KEY,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: userMsg }]
        }
      ]
    })
  }
);

    const data = await response.json();

    console.log("🤖 GEMINI RESPONSE:", JSON.stringify(data, null, 2));

    if (data.error) {
      return res.json({ reply: "❌ API ERROR: " + data.error.message });
    }

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ AI not responding";

    res.json({ reply });

  } catch (err) {
    console.error("🔥 SERVER ERROR:", err);
    res.json({ reply: "Server error 😢" });
  }
});



app.post("/book", async (req, res) => {

  
  const { name, phone, date, guests, note } = req.body;


  if (!name || !phone || !date || !guests) {
    return res.json({
      success: false,
      message: "All fields required"
    });
  }

  try {

    const response = await axios.post(
      `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`,
      {
        fields: {
          Name: name,
          Phone: phone,
          Date: date,
          Guests: guests,
          Note: note
        }
      },
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("✅ Airtable Booking Saved:", response.data);

    res.json({
      success: true,
      message: "Reservation saved!"
    });

  } catch (err) {

    console.error(
      "🔥 Airtable Error:",
      err.response?.data || err.message
    );

    res.json({
      success: false,
      message: "Airtable save failed"
    });

  }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
