const variables = {
  port: process.env.PORT || 3000,
  baseUrl: process.env.BASE_URL || 'http://localhost',
  saltRounds: process.env.SALT_ROUNDS || 15,
  secretKey: process.env.SECRET_KEY || "abacates",
};

export default variables;