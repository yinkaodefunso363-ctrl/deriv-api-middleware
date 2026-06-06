const WebSocket = require('ws');
const express = require('express');
const app = express();

app.get('/candles', (req, res) => {
  const symbol = req.query.symbol || 'R_75';
  const granularity = parseInt(req.query.granularity) || 86400;
  const count = parseInt(req.query.count) || 10;

  const ws = new WebSocket('wss://ws.binaryws.com/websockets/v3?app_id=1089');

  ws.on('open', () => {
    ws.send(JSON.stringify({
      ticks_history: symbol,
      adjust_start_time: 1,
      count: count,
      end: 'latest',
      granularity: granularity,
      style: 'candles'
    }));
  });

  ws.on('message', (data) => {
    const response = JSON.parse(data);
    if (response.candles) {
      ws.close();
      res.json({ candles: response.candles });
    }
  });

  ws.on('error', (err) => {
    res.status(500).json({ error: err.message });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
