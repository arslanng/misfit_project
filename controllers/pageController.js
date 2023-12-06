const nodemailer = require("nodemailer");
const User = require("../models/User");
const Course = require("../models/Course");

exports.getIndexPage = async (req, res) => {
  const trainers = await User.find({ role: "trainer" });
  const totalCourses = await Course.countDocuments();
  const totalStudents = await User.countDocuments({ role: "student" });
  const totalTrainers = await User.countDocuments({ role: "trainer" });
  res.status(200).render("index", {
    trainers,
    totalCourses,
    totalStudents,
    totalTrainers,
  });
};
exports.getAboutPage = (req, res) => {
  res.status(200).render("about");
};
exports.getContactPage = (req, res) => {
  res.status(200).render("contact");
};
exports.getGalleryPage = (req, res) => {
  res.status(200).render("gallery");
};
exports.getTrainerPage = async (req, res) => {
  const courses = await Course.find({}).populate("user");
  const trainers = await User.find({ role: "trainer" });
  const admins = await User.find({ role: "admin" });
  const totalTrainers = [...trainers, ...admins];

  res.status(200).render("trainer", {
    courses,
    trainers: totalTrainers,
  });
};
exports.getRegisterPage = (req, res) => {
  res.status(200).render("register");
};
exports.getLoginPage = (req, res) => {
  res.status(200).render("login");
};
exports.sendEmail = async (req, res) => {
  try {
    const outputMessage = ` 
    <h1>Mail Details</h1> 
    <ul> 
        <li>Name: ${req.body.name}</li> 
        <li>Email: ${req.body.email}</li> 
    </ul> 
    <h1>Message</h1> 
    <p>${req.body.message}</p> 
    `;

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "drmuratgokduman@gmail.com",
        pass: "eqocuuyuqcrxxyhc",
      },
    });

    let info = await transporter.sendMail({
      from: '"Misfit Contact Form" <drmuratgokduman@gmail.com>',
      to: "drmuratgokduman@gmail.com", //  alan adres
      subject: "Misfit Contact Form New Message ✔", //  konu
      html: outputMessage, // mesajın gövdesi: yukarıda oluşturmuştuk
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    req.flash("success", "We received your message successfully");
    res.status(200).redirect("contact");
  } catch (error) {
    req.flash("error", "Something happaned!");
    res.status(200).redirect("contact");
  }
};
