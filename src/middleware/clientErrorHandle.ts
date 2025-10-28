import type { NextFunction } from "express";

export const clientErrorHandler = (
  err: any,
  req: any,
  res: any,
  next: NextFunction
) => {
  if (req && req.xhr) {
    res.status(500).send({ error: "Something failed!" });
  } else {
    next(err);
  }
};
