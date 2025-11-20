const ReviewModel = require("./review.model");

class ReviewService {
  createReview = async (data) => {
    try {
      const review = new ReviewModel(data);
      return await review.save();
    } catch (error) {
      console.log("error on adding the review", error);
      throw error;
    }
  };

  getSingleReview = async (id) => {
    try {
      const singleReview = await ReviewModel.findById(id)
        .populate("product")
        .populate("user", "name email");

      return singleReview;
    } catch (error) {
      console.log("error on getting  your review", error);
      throw error;
    }
  };
  
  getAllReview = async () => {
    try {
      const getAllReview = await ReviewModel.find()
        .populate("product")
        .populate("user", "name email");

      return getAllReview;
    } catch (error) {
      console.log("error on getting review", error);
      throw error;
    }
  };

  updateReview = async (id, data) => {
    try {
      const updated = await ReviewModel.findByIdAndUpdate(id, data, {
        new: true,
      });
      return updated;
    } catch (error) {
      console.log("error on updating data");
      throw error;
    }
  };

  deleteReview = async (id) => {
    try {
      const deleted = await ReviewModel.findByIdAndDelete(id);
      return deleted;
    } catch (error) {
      console.log("error on deleting review", error);
      throw error;
    }
  };
}

const reviewSvc = new ReviewService();
module.exports = new reviewSvc();
