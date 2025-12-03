const express = require('express');

const PORT = 4000;

const app = express();

const { router } = require('./router');

app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  console.log(`JWT server running on http://localhost:${PORT}`);
});

