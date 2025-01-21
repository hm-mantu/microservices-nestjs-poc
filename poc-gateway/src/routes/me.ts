import { Request, Response } from 'express'

export const me = async (req: Request, res: Response): Promise<void> => {
  res.status(204).send()
}