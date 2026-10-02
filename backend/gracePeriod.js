// const revokedAt = token.revokedAt;
// const gracePeriod = 30 * 1000;
// const withinGracePeriod = Date.now() - revokedAt <= gracePeriod;
// if ((token.revoked && !withinGracePeriod) || token.expiresAt < Date.now()) {
//   throw new Error("Invalid token");
// }

// if (token.revoked && withinGracePeriod) {
//   const replacementToken = await RefreshToken.findById(
//     token.replacedByToken,
//   );
//   if (!replacementToken) {
//     throw new Error("Invalid token");
//   }
//   return res
//     .status(200)
//     .cookie("refreshToken", replacementToken, {
//       httpOnly: true,
//       sameSite: "lax",
//     })
//     .json({ token: accessToken });
// }
