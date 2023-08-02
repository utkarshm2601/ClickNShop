const categroyModel = require('../models/categoryModel');
const slugify = require('slugify');
//create Category
exports.createCategoryController = async (req, res) => {
  try {
    //fetch categoryName
    //validation
    //is alreadyExist
    //create catregory
    //return response

    //fetch categoryName
    const { name } = req.body;
    //validation
    if (!name) {
      return res.status(401).json({
        success: false,
        message: "Category Already Exist",
      });
    }
    //is alreadyExist->Improvement
    const existingCategory = await categroyModel.findOne({ slug: slugify(name) });
    if (existingCategory) {
      return res.status(200).json({
        sucess: false,
        message: "Category Already Exist",
      });
    }

    //create catregory
    const newCategory = await categroyModel.create({
      name: name,
      slug: slugify(name),
    });
    //return response
    return res.status(201).json({
      success: true,
      message: 'New Category Created',
      newCategory,
    });


  } catch (error) {
    console.log("Error in Creating Category : ", error);
    res.status(500).send({
      success: false,
      error,
      message: "Errro in Category",
    });
  }
}

//update Category
exports.updateCategoryController = async (req, res) => {
  try {
    //fetch name req body
    //fetch id from req.params
    //update in DB
    //return response
    console.log("requiest in  controller");
    //fetch name req body
    const { name } = req.body;
    //fetch id from req.params
    const { id } = req.params;
    console.log("name", name);
    console.log("Id : " + id);

    //find the id exist or not
    //update in DB
    const updatedCategory = await categroyModel.findByIdAndUpdate(
      id,
      {
        name: name,
        slug: slugify(name),
      },
      { new: true },
    );
    console.log("updated Category", updatedCategory);
    //return response
    return res.status(200).json({
      success: true,
      message: "Category Updated Successfully",
      updatedCategory,
    });
  }
  catch (error) {
    console.log("Error in updating category: ", error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while updating category",
    });
  }
}

//get all category
exports.getAllCategoryController = async (req, res) => {
  try {
    //find all details from DB
    const allCategory = await categroyModel.find({});
    //return response
    return res.status(200).json({
      success: true,
      message: "All Categories List",
      allCategory,
    })

  } catch (error) {
    console.log("Error in getting all category: ", error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting all categories",
    });
  }
}

//get category details on basis of name/slug
exports.singleCategoryController = async (req, res) => {
  try {
    //fetch slug
    console.log("Entered In Sngle Category")
    const { slug } = req.params;
    //find entry in database
    const category = await categroyModel.findOne({ slug: slug });
    //return response
    console.log("Category : ", category);
    return res.status(200).json({
      success: true,
      message: 'Get Single Category Successfully',
      category,
    });
  } catch (error) {
    console.log("Error While getting Single Category:", error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While getting Single Category",
    });
  }
}

//delete category -> id from params
exports.deleteCategoryController = async (req, res) => {
  try {
    //fetch  id
    //find and delete
    //return resposne
    //fetch  id
    const { id } = req.params;
    //find and delete
    await categroyModel.findByIdAndDelete(id);
    //return resposne
    return res.status(200).json({
      success: true,
      message: 'Category Deleted Successfully',
    });
  } catch (error) {
    console.log("Error in deleting Category : ", error);
    res.status(500).send({
      success: false,
      message: "error while deleting category",
      error,
    });
  }
}
