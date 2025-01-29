import express from "express";
import axios from "axios";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors()); 
app.use(express.static("public")); 
app.set("view engine", "ejs"); 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("views", path.join(__dirname, "views")); 

const MET_API_URL = "https://collectionapi.metmuseum.org/public/collection/v1";

async function getRandomArtwork() {
    try {
        const randomID = Math.floor(Math.random() * 900000);
        const response = await axios.get(`${MET_API_URL}/objects/${randomID}`);

        if (!response.data || !response.data.artistDisplayName || !response.data.primaryImage) {
            return getRandomArtwork(); 
        }

        return response.data;
    } catch (error) {
        return getRandomArtwork();
    }
}

async function getRandomArtists(correctArtist) {
    const artists = ["Pablo Picasso", "Leonardo da Vinci", "Claude Monet", "Vincent van Gogh", "Rembrandt", "Michelangelo", "Caravaggio", "Jackson Pollock"];
    return artists.filter(artist => artist !== correctArtist).sort(() => 0.5 - Math.random()).slice(0, 3);
}

app.get("/", async (req, res) => {
    try {
        const artwork = await getRandomArtwork();
        const wrongArtists = await getRandomArtists(artwork.artistDisplayName);
        const choices = [...wrongArtists, artwork.artistDisplayName].sort(() => 0.5 - Math.random());

        res.render("index", {
            image: artwork.primaryImage,
            title: artwork.title,
            choices: choices,
            correct: artwork.artistDisplayName,
        });
    } catch (error) {
        res.status(500).send("Error fetching artwork.");
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
