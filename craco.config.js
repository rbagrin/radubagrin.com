// craco.config.js
const CracoAlias = require("craco-alias");
const { join, resolve } = require("node:path");

module.exports = {
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: "tsconfig",
        baseUrl: "./src",
        tsConfigPath: "./tsconfig.paths.json",
      },
    },
  ],
  webpack: {
    // basePath: ".",
    // alias: {
    //   "@": join(resolve(__dirname, "./src")),
    // },
    configure: (webpackConfig) => {
      // Find the rule that handles SVGs
      const svgRuleIndex = webpackConfig.module.rules.findIndex(
        (rule) => rule.test && rule.test.toString().includes("svg")
      );

      // Overwrite the SVG rule
      if (svgRuleIndex >= 0) {
        webpackConfig.module.rules[svgRuleIndex] = {
          test: /\.svg$/,
          use: ["@svgr/webpack"],
        };
      }

      return webpackConfig;
    },
  },
};
