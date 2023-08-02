const { hashPassword, comparePassword } = require("../helpers/authHelper");
const userModel = require("../models/userModel");
const orderModel = require("../models/orderModel");
const JWT = require("jsonwebtoken");

exports.registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;
    //validation
    if (!name || !email || !password || !phone || !address) {
      return res.send({ message: "All fields are Requires" });
    }
    //check existingUser
    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "User Already Register. Please login",
      });
    }
    //hash the password
    const hashedPassword = await hashPassword(password);
    //create Entry in database
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      answer,
    });

    return res.status(201).send({
      success: true,
      message: "User is Registered Successfully.",
      user,
    });
  } catch (error) {
    console.log("Error in registrations : ", error);
    return res.status(500).send({
      success: false,
      message: "Error in Registration",
      error,
    });
  }
};

//POST LOGIN
exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "All Fields are Required",
      });
    }
    //check user
    const user = await userModel.findOne({ email });
    //console.log("User is login successfully");
    //console.log("UserDetails : ", user);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registerd",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }
    //token
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};
//test controllers
exports.testController = async (req, res) => {
  try {
    res.send("Protected Route");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};

// forget password controller
exports.forgetPasswordController = async (req, res) => {
  try {
    //fetch data
    //validation -> check userExist
    //hashPassword
    //updatePassword in DB
    //return response

    //fetch data
    const { email, answer, newPassword } = req.body;
    //validation -> check userExist
    if (!email || !answer || !newPassword) {
      res.status(400).send({
        message: "All Fields are Required",
      });
    }
    const user = await userModel.findOne({ email, answer });
    if (!user) {
      return res.status(404).send({
        sucess: false,
        message: "Email or Answer is Wrong",
      });
    }
    //hashPassword
    const hashedPassword = await hashPassword(newPassword);
    //updatePassword in DB
    await userModel.findByIdAndUpdate(user._id, { password: hashedPassword });
    //return response
    return res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log("Error in forget Password Controller: ", error);
    res.status(500).send({
      success: false,
      message: "Something Went Wrong",
      error,
    });
  }
};

//updateProfileController
exports.updateProfileController = async (req, res) => {
  try {
    //fetch data from req.body
    //validation if password -> len >= 6
    //hash password
    //update user in DB
    //return resposne

    //fetch data from req.body
    const { name, email, password, address, phone } = req.body;
    //geting userId from token that was inserted as req.user = token login controller
    const user = userModel.findById(req.user._id);

    //validation if password -> len >= 6
    if (password && password.length < 6) {
      return res.json({
        error: "Password is required and must be atleast 6 character",
      });
    }

    //hash password
    const hashedPassword = password ? await hashPassword(password) : undefined;
    //update user in DB
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    //return resposne

    return res.status(200).send({
      success: true,
      message: "Profile Updated Successfully",
      updatedUser,
    });
  } catch (error) {
    console.log("Error in updateProfile Controller : ", error);
    res.status(400).send({
      success: false,
      message: "Error While Updating profile",
      error,
    });
  }
};

//get Orders Controllers -> for user
exports.getOrderController = async (req, res) => {
  try {
    //fetch data on req.user._id -> token
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    //return response
    res.status(200).json({
      success: true,
      message: "all orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.log("Error in getOrderController : ", error);
    res.status(500).send({
      success: false,
      message: "Error While Getting Orders",
      error,
    });
  }
};

//get all order -> controller -> for admin
exports.getAllOrdersController = async (req, res) => {
  try {
    //just find all orders
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    //return orders in res
    return res.json({
      success: true,
      message: "Orders fetched Successfully",
      orders,
    });
  } catch (error) {
    console.log("Error in getAllOrderController: ", error);
    res.status(500).send({
      success: false,
      message: "Error While Getting Orders",
      error,
    });
  }
};

//order status -> controller

exports.orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    return res.json(orders);
  } catch (error) {
    console.log("Error in orderStatusController : ", error);
    res.status(500).send({
      success: false,
      message: "Error in get Status",
      error,
    });
  }
};
