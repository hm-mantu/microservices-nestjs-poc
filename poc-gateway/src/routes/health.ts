import { Request, Response } from 'express'

export const health = async (req: Request, res: Response): Promise<void> => {
  res.status(204).send()
}