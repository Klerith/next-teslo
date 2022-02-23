import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { User } from '../../../models';
import { IUser } from '../../../interfaces';
import { isValidObjectId } from 'mongoose';


type Data = 
| { message: string }
| IUser[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch( req.method ) {
        case 'GET':
            return getUsers(req, res);

        case 'PUT':
            return updateUser(req, res);

        default:
            res.status(400).json({ message: 'Bad request' })
    }

}

const getUsers = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    await db.connect();

    const users = await User.find().select('-password').lean();

    await db.disconnect();

    return res.status(200).json( users );

}

const updateUser = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { userId = '', role = '' } = req.body;
    if ( !isValidObjectId( userId) ) {
        return res.status(400).json({ message: 'Bad request' });
    }

    const validRoles = ['admin','super-user','client'];
    if ( !validRoles.includes(role)  ) {
        return res.status(400).json({ message: 'Rol no es permitido' });
    }

    // Se puede verificar que solo administradores puedan hacer esto
    // se lee el role del usuario de la sesión
    await db.connect();
    const user = await User.findById( userId );

    if ( !user ) {
        await db.disconnect();
        return res.status(400).json({ message: 'Usuario no existe por ese id'});
    }
    
    user.role = role;
    await user.save();
    await db.disconnect();
    
    
    return res.status(200).json({ message: 'Usuario actualizado'});
}

