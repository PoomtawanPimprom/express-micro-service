import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;

const user = {
  id: "u123",
  email: "admin@test.com",
  passwordHash: bcrypt.hashSync("123456", 10),
  role: "ADMIN",
  permissions: ["ORDER_READ", "ORDER_WRITE"],
};

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (email !== user.email) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    {
      sub: user.id,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "8d" }
  );
  console.log("login check");
  res.json({ accessToken: token });
});

app.listen(3001, () => {
  console.log("Auth Service (Bun) running on 3001");
});
