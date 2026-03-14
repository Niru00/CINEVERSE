import express from "express";
import authUser from "../middlewares/authuser.middleware.js";
import { addHistory, getHistory,deleteHistoryItem,clearAllHistory } from "../controllers/history.controller.js";

export const HistoryRouter = express.Router();

HistoryRouter.post("/",authUser,addHistory)
HistoryRouter.get("/",authUser,getHistory)
HistoryRouter.delete("/clear",authUser,clearAllHistory)
HistoryRouter.delete("/:id",authUser,deleteHistoryItem)