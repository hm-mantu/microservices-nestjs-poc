import {Request, Response} from 'express';

export const validateAuthToken = (authToken: string): void => {
    if(!authToken)throw new Error('Missing the token')
    if(!authToken.toString().toLocaleLowerCase().startsWith('bearer ')) throw new Error(`Auth token missing valid type "bearer"`)
}

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const authToken = req.headers['authorization'] as string;
    
        validateAuthToken(authToken)

        
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error})
    }
}

export const mapRegisterUserResponse = (userDto: any, data: any) => {
    for (const key of Object.keys(data)) {
      if (userDto[key]) {
        userDto[key] = data[key]
      } else {
        userDto.customClaims ??= {}
        userDto.customClaims[key] = data[key]
      }
    }
  }