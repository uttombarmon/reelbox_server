import type { NextFunction } from "express";

export const logErrors = (err: any, req: any, res: any, next: NextFunction) => {
  console.error(err);
  next(err);
};