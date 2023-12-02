const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const portfolioRoutes = require('./src/routes');

app.use(express.json());

app.get("/",(req,res)=>{
    res.send("hello gus");
})

app.use('/api/v1/portfolio',portfolioRoutes);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});