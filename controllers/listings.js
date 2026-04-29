const Listing = require("../models/listing");

module.exports.index = async(req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", {allListings});
};

module.exports.renderNewForm = (req,res) =>{
    res.render("listings/new.ejs")
}

module.exports.showListing = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({
        path: "reviews",
        populate:{
            path: "author",
        },
    }).populate("owner");
    if(!listing){
        req.flash("error","Listing does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/show", {listing});
};

module.exports.createListing = async(req,res,next)=>{
    const newListing = new Listing(req.body.listing);
    if (req.body.listing.image) {
        newListing.image = { 
            // 1. URL comes from the user's form input
            url: req.body.listing.image, 
            
            // 2. FILENAME is a required dummy value for your schema
            //    Using a unique timestamp is a good placeholder.
            filename: `user-url-${Date.now()}` 
        };
    }
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
};

module.exports.updateListing = async(req,res) => {
    let{id} = req.params;
    let listingData = {...req.body.listing};
    
    // 🌟 FIX: Manually structure the image data for update 🌟
    // Check if the input image data is a simple string (a URL from the form)
    if (typeof listingData.image === 'string') {
        // If it's a string (URL), structure it as the object your schema expects
        listingData.image = { 
            url: listingData.image, 
            filename: `user-url-update-${Date.now()}` // Set a dummy filename
        };
    }
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async(req,res) =>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};
