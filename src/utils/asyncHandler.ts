import { Request, Response, NextFunction } from "express";

// Higher-order functions are functions that take a function as an argument and return a function
const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await fn(req, res, next);
  } catch (error: any) {
   
      res.status(error.code|| 500).json({
        status: "failure",
        message: error.message,
      });
  
  }
};
