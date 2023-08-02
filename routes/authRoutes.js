const express = require("express");
const {
  registerController,
  loginController,
  testController,
  forgetPasswordController,
  updateProfileController,
  getOrderController,
  getAllOrdersController,
  orderStatusController,
} = require("../controllers/authController");
const {
  requireSignIn,
  isAdmin,
  isUser,
} = require("../middlerwares/authMiddleware");
const router = express.Router();

//routes->
//REGiSTER || POST
router.post("/register", registerController);
//Login || POST
router.post("/login", loginController);
//test route
router.get("/test", requireSignIn, isAdmin, testController);
//Forget Password || POST
router.post("/forgot-password", forgetPasswordController);

//protect routes for auth
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});
//protected routes for admin
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});
//update profile
router.put("/profile", requireSignIn, updateProfileController);
//orders -> for users
router.get("/orders", requireSignIn, getOrderController);
//all orders -> all orders for admin
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

//order status update -> for admin only -> yet not tested
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);

module.exports = router;
