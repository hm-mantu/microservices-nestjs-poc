import { Request, Response } from 'express';

export const logout = async (req: Request, res:Response) : Promise<void> => { 
    res.clearCookie('auth-cookie', {domain:'http://localhost:3000', path:"/"})
    res.status(200).json({message: "hello world from gateway"}) 
}