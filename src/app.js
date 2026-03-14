import express from "express"
import { AuthRouter } from "./routes/auth.routes.js"
import { FavouriteRouter } from "./routes/favourite.routes.js"
import { HistoryRouter } from "./routes/watchHistory.routes.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:"https://cineverse-of8b.onrender.com",
    credentials:true
}))

// routes
app.use("/api/auth",AuthRouter)
app.use("/api/favourites",FavouriteRouter)
app.use("/api/history",HistoryRouter)

app.use(express.static(path.join(__dirname, "../public")));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});




export default app