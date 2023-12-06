const Category = require("../models/Category");
const Course = require("../models/Course");

exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);

    res.status(201).redirect("/users/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.deleteCategory = async (req, res) => {
  console.log(req.params.id);
  try {
    await Course.deleteMany({ category: req.params.id });
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).redirect("/users/dashboard")
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};
