/* const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js")
const Review = require("../models/review.js")
const Listing = require("../models/listing.js");
const {isReviewAuthor, isLoggedIn} = require("../middleware.js");

const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}

const reviewController = require("../controllers/reviews.js");

//Reviews Post route
router.post("/", validateReview,wrapAsync(reviewController.createReview));

//Delete Review route
router.delete(
    "/:reviewId",
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview)
)

module.exports = router; */
const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review");
const Listing = require("../models/listing");
const { isReviewAuthor, isLoggedIn } = require("../middleware");
const reviewController = require("../controllers/reviews");

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

// Create new review
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// Delete review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;
