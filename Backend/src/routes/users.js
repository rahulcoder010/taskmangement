const { Router } = require("express");
const {
  allUsers,
  registerUser,
  login,
  updateUser,
  updatePassword,
  logout
} = require("../controller/user.js");
const router = Router();

const { protect } = require("../middleware/protect.js");

router
  .route("/")
  .get(allUsers)
  .post(registerUser)
  .put(protect, updateUser);

router.post("/login", login);
router.put("/updatePassword", protect, updatePassword)
router.delete("/logout", protect, logout)

module.exports = router;
