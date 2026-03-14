import favouriteModel from "../models/favourite.model.js";


async function addfavouriteController(req,res) {
    const { tmdb_id, media_type } = req.body;

      
    const user = req.user; // from auth middleware

    await favouriteModel.create({
        tmdb_id,
        media_type,
        user: user.id
    })

    res.status(201).json({ message: "Added to favourites" });

}

async function removefavouriteController(req,res) {
    const { tmdb_id } = req.params;
    const user = req.user; // from auth middleware

    await favouriteModel.findOneAndDelete({
        tmdb_id,
        user: user.id
    })

    res.json({ message: "Removed from favourites" });
}

async function getfavouritesController(req,res) {
    const user = req.user; // from auth middleware  
    
    const favourites = await favouriteModel.find({ user: user.  id }).select("-user -__v").lean();

    res.json({ favourites });
}

async function checkfavouriteController(req,res) {
    const { tmdb_id } = req.params;
    const user = req.user; // from auth middleware
    const favourite = await favouriteModel.findOne({
        tmdb_id,
        user: user.id
    })

    res.json({ isFavourited: !!favourite });
}

export { addfavouriteController, removefavouriteController, getfavouritesController, checkfavouriteController }