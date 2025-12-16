import express, { Request, Response } from 'express';
import { handleOrder } from './order/order-handler';

const app = express();
const PORT: number = 4000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Express server works!' });
});

app.post('/order', handleOrder);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});

