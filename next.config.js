module.exports = {
  serverRuntimeConfig: {
    secret:
      "asdkjaslkdjoad8a76d687a5sd5ada8s7d0a7d87as6d76atdasyd98saud[aiajkguayisrd56wdq0909z87cz",
  },
  publicRuntimeConfig: {
    apiUrl:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/api" // development api
        : "http://localhost:3000/api", // production api
  },
};
