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

async function getValidArtworkList(departmentId = null) {
    try {
        let objectIDsUrl = `${MET_API_URL}/objects`;
        if (departmentId) {
            objectIDsUrl += `?departmentIds=${departmentId}`;
        }

        const response = await axios.get(objectIDsUrl);
        const objectIDs = response.data.objectIDs;

        if (!objectIDs || objectIDs.length === 0) {
            throw new Error("No artworks found for this category.");
        }

        return objectIDs;
    } catch (error) {
        console.error("Error fetching artwork list:", error.message);
        return [];
    }
}

async function getRandomArtwork(departmentId = null, retries = 10) {
    try {
        const objectIDs = await getValidArtworkList(departmentId);
        if (objectIDs.length === 0) {
            throw new Error("No artworks found.");
        }

        for (let i = 0; i < retries; i++) {
            const randomID = objectIDs[Math.floor(Math.random() * objectIDs.length)];
            const artworkResponse = await axios.get(`${MET_API_URL}/objects/${randomID}`);
            const artwork = artworkResponse.data;

            if (artwork.primaryImage && artwork.artistDisplayName) {
                return artwork;
            }
        }
        throw new Error("Could not find a valid artwork after multiple retries.");
    } catch (error) {
        console.error("Error fetching artwork:", error.message);
        return null;
    }
}

async function getRandomArtists(correctArtist) {
    const artists = ["Pablo Picasso", "Leonardo da Vinci", "Claude Monet", "Vincent van Gogh", "Rembrandt", "Michelangelo", "Caravaggio", "Jackson Pollock"];
    return artists.filter(artist => artist !== correctArtist).sort(() => 0.5 - Math.random()).slice(0, 3);
}

app.get("/", async (req, res) => {
    try {
        const departmentId = req.query.departmentId || "";
        const artwork = await getRandomArtwork(departmentId);

        if (!artwork) {
            return res.render("index", {
                image: null,
                title: "No valid artwork found!",
                choices: [],
                correct: "",
                departmentId: departmentId
            });
        }

        const wrongArtists = await getRandomArtists(artwork.artistDisplayName);
        const choices = [...wrongArtists, artwork.artistDisplayName].sort(() => 0.5 - Math.random());

        res.render("index", {
            image: artwork.primaryImage,
            title: artwork.title,
            choices: choices,
            correct: artwork.artistDisplayName,
            departmentId: departmentId,
        });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).send("Error fetching artwork.");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
