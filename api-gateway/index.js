import express from "express";
import jwt from "jsonwebtoken";
import axios from "axios";

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;

function authenticate(req, res, next) {
  console.log("authenticate check");
  const header = req.headers.authorization;
  if (!header) return res.sendStatus(401);
  console.log(header);
  const token = header.split(" ")[1];
  console.log("token:", token);
  console.log(JWT_SECRET);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("decoded", decoded);
    req.user = decoded;
    next();
  } catch(err){
    console.error(err);
    return res.sendStatus(403);
  }
}

app.get("/orders", authenticate, async (req, res) => {
  console.log("gateway check");
  try {
    const response = await axios.get("http://api-order:3003/orders", {
      headers: {
        "x-user": JSON.stringify(req.user),
      },
    });

    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Order service error" });
  }
});

app.listen(3000, () => {
  console.log("API Gateway (Bun) running on 3000");
});
