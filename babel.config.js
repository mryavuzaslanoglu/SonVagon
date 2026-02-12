module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@": "./src",
          },
        },
      ],
      ["react-native-unistyles/plugin", { root: __dirname }],
      "react-native-reanimated/plugin", // Must be last
    ],
  };
};
