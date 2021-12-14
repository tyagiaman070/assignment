// creating ans saving the token in cookie

const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();
  const expires = new Date(
    Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
  );
  // ? options for cookie
  const options = {
    expires,
    httpOnly: true,
  };

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      token,
      user: {
        name: user.name,
        avatar: user.avatar,
        email: user.email,
        role: user.role,
      },
      expires: Date.now() + process.env.COOKIE_EXPIRE,
    });
};

module.exports = sendToken;
