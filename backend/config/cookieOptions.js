const isProduction = process.env.NODE_ENV === "production";

const refreshCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
};

module.exports = refreshCookieOptions;
