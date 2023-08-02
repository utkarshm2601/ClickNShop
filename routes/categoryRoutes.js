const express = require('express');
const { isAdmin, requireSignIn } = require('../middlerwares/authMiddleware');
const { createCategoryController, updateCategoryController, getAllCategoryController, singleCategoryController, deleteCategoryController } = require('../controllers/categoryController');
const router = express.Router();

//routes

//create category
router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  createCategoryController,
);

//update category
router.put(
  "/update-category/:id",
  requireSignIn,
  isAdmin,
  updateCategoryController,
);

//get all category -> no signin requires
router.get(
  "/get-category",
  getAllCategoryController,
);

//single category -> no signin requires
router.get(
  "/single-category/:slug",
  singleCategoryController,
);

//delete category
router.delete(
  "/delete-category/:id",
  requireSignIn,
  isAdmin,
  deleteCategoryController,
);

module.exports = router;