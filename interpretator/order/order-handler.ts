import { Request, Response } from 'express';
import { ActionFactory } from '../actions/action-factory';
import { Command } from './command';

const actionFactory = new ActionFactory();
const command = new Command(actionFactory);

export const handleOrder = (req: Request, res: Response): void => {
    const { id, action, ...parameters } = req.body;

    if (!action) {
        res.status(400).json({ error: 'There is no action' });
        return;
    }

    const order: { action: string; id?: number;[key: string]: any } = {
        action,
        ...parameters
    };

    if (id !== undefined) {
        order.id = id;
    }

    const result = command.execute(order);

    if (!result.success) {
        const statusCode = result.error?.includes('not found') ? 400 : 500;
        res.status(statusCode).json({
            error: result.error || 'Failed to execute action'
        });
        return;
    }

    res.json({
        success: true,
        orderId: id,
        action: action,
        message: `Action "${action}" executed successfully`
    });
};

