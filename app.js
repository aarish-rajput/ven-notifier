const nodemailer = require("nodemailer");
const axios = require("axios");
require("dotenv").config();
const express = require("express");

const PORT = 3000;

const app = express();

const url = "http://koioi.com"; // Replace with the URL of the website you want to check
const siteName = "VentraInc"; // Replace with the Name of the website you want to check

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "aarish@bbits.solutions",
    pass: process.env.EMAIL_PASS,
  },
});

let today = new Date();
let currentDate = today.toLocaleDateString();
let currentTime = today.toLocaleTimeString();

const mailOptions = {
  from: "aarish@bbits.solutions",
  to: "aarish.angel@gmail.com", // Replace with the recipient's email address
  subject: `${siteName} down Alert`,
  html: `
  <div style="text-align:center"> 
   <img src="https://www.onlygfx.com/wp-content/uploads/2020/05/alert-stamp-1.png" height="200px" width="200px"></img>
   </div> <br>
  <p style="font-size:18px"> ${url} is facing down time at <b>Date:</b> ${currentDate} and <b>Time:</b> ${currentTime}<br> Please take necessary actions</p>`,
};

async function checkWebsiteStatus() {
  axios
    .get(url)
    .then((response) => {
      const statusCode = response.status;
      console.log(`Status code: ${statusCode}`);
      if (
        statusCode === 200 ||
        statusCode === 201 ||
        statusCode === 202 ||
        statusCode === 300 ||
        statusCode === 301 ||
        statusCode === 302 ||
        statusCode === 307 ||
        statusCode === 308
      ) {
        console.log("Website is up");
      } else {
        console.log("Website is down");
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error sending email: " + error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
      }
    })
    .catch((error) => {
      console.error(`Error: ${error.message}`);
      console.log("site is down");
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email: " + error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    });
}

(function () {
  checkWebsiteStatus();

  setInterval(function () {
    checkWebsiteStatus();
  }, 600000);
})();

app.get("/", (req, res) => {
  res.send({ data: "app is working" });
});

app.listen(PORT, function (err) {
  if (err) console.log("Error in server setup");
  console.log("Server listening on Port", PORT);
});
