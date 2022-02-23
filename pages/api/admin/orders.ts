import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { Order } from '../../../models';
import { IOrder } from '../../../interfaces/order';

type Data = 
| { message: string }
| IOrder[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch( req.method ) {
        case 'GET':
            return getOrders(req, res);
        
        default:
            res.status(400).json({ message: 'Bad request' })
    }

    
}

const getOrders = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    await db.connect();
    const orders = await Order.find()
        .sort({ createdAt: 'desc' })
        .populate('user','name email')
        .lean();
    await db.disconnect();



    
    res.status(200).json(orders)
}
