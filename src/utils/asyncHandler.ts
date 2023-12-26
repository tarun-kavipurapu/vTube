import { Request, Response, NextFunction } from "express";
// const asyncHandler = (requestHandler) => {
//   return (req:Request, res:Response, next:NextFunction) => {
//       Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
//   }
// }


// export { asyncHandler }


// // Higher-order functions are functions that take a function as an argument and return a function
const asyncHandler = (fn: Function) => async (req: Request, res: Response, next: NextFunction) => {
  try {
   return  await fn(req, res, next);
  } catch (error: any) {
   
      res.status(error.code|| 500).json({
        status: "failure",
        message: error.message,
      });
  
  }
};

export  {asyncHandler};