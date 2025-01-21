import { Request, Response } from 'express';

export const root = async (req: Request, res:Response) : Promise<void> => { 
    res.status(200).json({message: "hello world from gateway"}) 
}