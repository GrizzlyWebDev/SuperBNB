module.exports = {
  productionSourceMap: false,
  transpileDependencies: ["vuetify"],
  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "@/sass/web.scss"`,
      },
    },
  },
  pages: {
    index: {
      // entry for the page
      entry: "src/main.js",
      // the source template
      template: "public/index.html",
      // output as dist/index.html
      filename: "index.html",
      // when using title option,
      // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
      title: "SuperBNB Dashboard",
      // chunks to include on this page, by default includes
      // extracted common chunks and vendor chunks.
      chunks: ["chunk-vendors", "chunk-common", "index"],
    },
  },
  pwa: {
    name: "SuperBNB Dashboard",
    themeColor: "#021327",
    msTileColor: "#021327",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "#021327",
    manifestOptions: {
      background_color: "#021327"
    }
  }
};