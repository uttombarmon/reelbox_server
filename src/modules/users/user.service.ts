
import { User, type IUser } from "./user.model";

export const getAllUsers = async (): Promise<IUser[]> => {
  return await User.find();
};

export const createUser = async (data: Partial<IUser>): Promise<IUser> => {
  const user = new User(data);
  return await user.save();
};
