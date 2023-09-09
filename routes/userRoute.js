import { Router } from "express";
import {
  authenticateUser,
  createUser,
  deleteUser,
  getUserDetails,
  updateUserDetails,
  updateUserPassword,
} from "../controllers/userController.js";
import limitter from "express-rate-limit";

const router = Router();
const Limmiter = limitter({
  max: 20,
  windowMs: 60 * 1000,
  message: {
    code: 429,
    message: "There are no more requests available",
  },
});

router.post("/create", Limmiter, createUser);
router.post("/login", Limmiter, authenticateUser);
router.post("/", getUserDetails);
router.delete("/delete", deleteUser);
router.put("/update", updateUserDetails);
router.put("/updatePassword", updateUserPassword);

export { router as userRouter };
