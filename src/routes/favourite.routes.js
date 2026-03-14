import express from "express";
import authUser from "../middlewares/authuser.middleware.js";
import { addfavouriteController,removefavouriteController,getfavouritesController,checkfavouriteController } from "../controllers/favourite.controller.js";


export const FavouriteRouter = express.Router();

FavouriteRouter.post("/",authUser,addfavouriteController)
FavouriteRouter.delete("/:tmdb_id",authUser,removefavouriteController)
FavouriteRouter.get("/",authUser,getfavouritesController)
FavouriteRouter.get("/check/:tmdb_id",authUser,checkfavouriteController)

