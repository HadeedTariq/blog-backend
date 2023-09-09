import { connect } from "mongoose";

export const connectDb = async (url) => {
  await connect(url);
};
