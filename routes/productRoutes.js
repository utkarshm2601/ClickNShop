const express = require('express');
const formidable = require('express-formidable');
const { requireSignIn, isAdmin } = require('../middlerwares/authMiddleware');
const { brainTreePaymentController,braintreeTokenController, createProductController, updateProductController, getProductController, getSingleProductController, productPhotoController, productFilterController, productCountController, productListController, searchProductController, relatedProductController, productCategoryController, deleteProductController } = require('../controllers/productController');
const { deleteCategoryController } = require('../controllers/categoryController');
const router = express.Router();

//********************************************* */
//******************Routes********************* */
//********************************************* */
//Formidale() ->A Node.js module for parsing form data, especially file uploads.
//createProduct
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController,
);
//updateProduct
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController,
);

//get products
router.get(
  "/get-product", getProductController,
);

//get single product
router.get(
  "/get-product/:slug",
  getSingleProductController,
);
//get-photo
router.get(
  "/product-photo/:pid",
  productPhotoController,
);
//delete rproduct
router.delete("/delete-product/:pid", deleteProductController);

//filter product
router.post("/product-filters", productFilterController);

//product count
router.get("/product-count", productCountController);

//product per page
router.get("/product-list/:page", productListController);

//search product
router.get("/search/:keyword", searchProductController);

//similar product
router.get("/related-product/:pid/:cid", relatedProductController);

//category wise product
router.get("/product-category/:slug", productCategoryController);

//Payment routes -> 
//token
router.get("/braintree/token", braintreeTokenController);

//payments
router.post("/braintree/payment", requireSignIn, brainTreePaymentController);

module.exports = router;