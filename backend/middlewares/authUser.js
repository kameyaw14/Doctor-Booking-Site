import jwt from "jsonwebtoken";

// user auth middleware

const AuthUser = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.json({
        success: false,
        message: "Not authorised Login again",
      });
    }
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    req.body.userId = tokenDecode.id;

    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default AuthUser;
