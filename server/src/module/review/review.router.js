const authValidator = require("../../middleware/validation.middleware");
const reviewCtrl = require("./review.controller");
const reviewValidation = require("./review.validation");

const reviewRouter = require("express").Router();

reviewRouter.post(
  "/review",
  authValidator(reviewValidation),
  reviewCtrl.createReview
);

reviewRouter.get("/listreview", reviewCtrl.listReview);

reviewRouter
  .route("/review/:id")
  .put(reviewCtrl.updateReview)
  .get(reviewCtrl.listSingleReview)
  .delete(reviewCtrl.deletedReview);

module.exports = reviewRouter;
