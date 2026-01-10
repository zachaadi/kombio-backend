import express from 'express';
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.use(express.static(__dirname));

router.use("/favicon.ico", express.static("public/favicon.svg"));

router.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "../../index.html"));
});

export default router;
