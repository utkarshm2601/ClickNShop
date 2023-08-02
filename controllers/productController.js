const productModel = require('../models/productModel');
const categoryModel = require('../models/categoryModel');
const orderModel = require('../models/orderModel');

const fs = require('fs');
const slugify = require('slugify');
const braintree = require("braintree");
const dotenv = require('dotenv');


dotenv.config();

//payment gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});
//create a product
exports.createProductController = async (req, res) => {
  try {
    //fetch data from fields
    //fetch photo from files
    //validation -> fields missing
    //create entry in DB
    //insert photo in local file 
    //return response

    //fetch data from fields
    const { name, description, price, category, quantity, shipping } = req.fields;

    //fetch photo from files
    const { photo } = req.files;
    //validation -> fields missing
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }
    //create entry in DB
    const products = new productModel({ ...req.fields, slug: slugify(name) });
    //insert photo in local file 
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    //return response
    res.status(201).send({
      success: true,
      message: 'Product Created Successfully',
      products,
    });

  } catch (error) {
    console.log("Error in Creating Product : ", error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in crearing product",
    });
  }
}
//get all products
exports.getProductController = async (req, res) => {
  //get all product -> list of 12 products
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });

    //return respose
    return res.status(200).send({
      success: true,
      countTotal: products.length,
      message: "All Products",
      products,
    });
  } catch (error) {
    console.log("Error in Getting products : ", error);
    res.status(500).send({
      success: false,
      message: "Erorr in getting products",
      error: error.message,
    });
  }
}

//get single product
exports.getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .find({ slug: req.params.slug })
      .select("-photo")
      .populate("category");

    console.log("Product Fetched : ", product);
    //return respinse
    return res.status(200).json({
      success: true,
      message: "Single Product Fetched",
      product,
    })
  } catch (error) {
    console.log("Error in get single product Controller: ", error);
    res.status(500).send({
      success: false,
      message: "Error while getitng single product",
      error,
    });
  }
}

//get Photo
exports.productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr while getting photo",
      error,
    });
  }
}

//delete controller
exports.deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: 'Product Deleted Successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
}

//update product controller
exports.updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    //alidation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Updte product",
    });
  }
}

//product Filter Controller
exports.productFilterController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length > 0) args.price = { $gte: radio[0], $lte: radio[1] }
    const product = await productModel.find(args);
    console.log("product Details : ", product);
    return res.status(200).json({
      sucess: true,
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error While Filtering Products",
      error,
    });
  }
}

//product count Controller
exports.productCountController = async (req, res) => {
  try {
    const total = await productModel.find({})
      .estimatedDocumentCount();
    return res.status(200).json({
      success: true,
      total,
    })
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in product count",
      error,
      success: false,
    });
  }
}

//product list based on page
exports.productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: 'Product fetched sucessfully',
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
}

//search product Controller
exports.searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");

    res.json({
      success: true,
      message: 'Searched Successfully',
      results,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Search Product API",
      error,
    });
  }
}

//similar products -> related-products
exports.relatedProductController = async (req, res) => {
  try {
    //productId(exclude) , CategroyId(include)
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");

    return res.status(200).json({
      sucess: true,
      products,
    });

  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error while geting related product",
      error,
    });
  }
}

//get Product by Category
exports.productCategoryController = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await categoryModel.find({ slug: slug });
    console.log(typeof (category));
    console.log("categoryId", typeof (category[0]._id));

    const products = await productModel.find({ category }).populate("category");
    // console.log("Category: ", category);
    //console.log("Product: ", products);
    return res.status(200).json({
      success: true,
      message: "fetched Successfully",
      category,
      products,
    });

  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error While Getting products",
    });
  }

};

//payment gateway api
//token
exports.braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

//payment
exports.brainTreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};