import express from "express";

const app = express();

function authorize() {
  return (req, res, next) => {
    const user = JSON.parse(req.headers["x-user"] || "{}");
    console.log("Authorized user:", user);
    req.user = user;
    next();
  };
}

app.get("/orders", authorize(), (req, res) => {
  console.log("order check");
  res.json({
    orders: [
      { id: 1, item: "MacBook Pro" },
      { id: 2, item: "iPhone" },
    ],
    requestedBy: req.user.sub,
  });
});

app.listen(3003, () => {
  console.log("Order Service (Bun) running on 3003");
});
