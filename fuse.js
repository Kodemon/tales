const { FuseBox, EnvPlugin, CSSPlugin, JSONPlugin, WebIndexPlugin, QuantumPlugin } = require("fuse-box");
const { src, task, context } = require("fuse-box/sparky");
const path = require("path");

/*
 |--------------------------------------------------------------------------------
 | Context
 |--------------------------------------------------------------------------------
 */

context(
  class {
    getConfig() {
      return FuseBox.init({
        homeDir: "src/",
        output: "public/$name.js",
        target: "browser@es5",
        sourceMaps: {
          inline: true
        },
        debug: "development",
        sourcemaps: "development",
        hash: this.isProduction,
        plugins: [
          JSONPlugin(),
          CSSPlugin(),
          EnvPlugin({ NODE_ENV: process.env.NODE_ENV }),
          WebIndexPlugin({
            template: "index.html",
            target: "index.html",
            bundles: ["app"]
          }),
          this.isProduction &&
            QuantumPlugin({
              bakeApiIntoBundle: "app",
              uglify: false,
              //css: { clean: true },
              extendServerImport: true
            })
        ],
        alias: {
          Engine: "~/Engine",
          TweenLite: path.resolve("node_modules", "gsap/src/uncompressed/TweenLite.js"),
          TweenMax: path.resolve("node_modules", "gsap/src/uncompressed/TweenMax.js"),
          TimelineLite: path.resolve("node_modules", "gsap/src/uncompressed/TimelineLite.js"),
          TimelineMax: path.resolve("node_modules", "gsap/src/uncompressed/TimelineMax.js"),
          "animation.gsap": path.resolve("node_modules", "scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap.js"),
          "debug.addIndicators": path.resolve("node_modules", "scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators.js")
        }
      });
    }

    createBundle(fuse) {
      const app = fuse.bundle("app");
      app.instructions("> index.tsx");
      if (!this.isProduction) {
        app.watch();
      }
      return app;
    }
  }
);

/*
 |--------------------------------------------------------------------------------
 | Clean
 |--------------------------------------------------------------------------------
 */

task("clean", async () => {
  await src("public")
    .clean("public")
    .exec();
  await src(".fusebox")
    .clean(".fusebox")
    .exec();
});

/*
 |--------------------------------------------------------------------------------
 | Default
 |--------------------------------------------------------------------------------
 */

task("default", ["clean"], async context => {
  const fuse = context.getConfig();
  context.isProduction = false;
  fuse.dev({ port: process.env.PORT || 3000, fallback: "index.html" });
  context.createBundle(fuse);
  await fuse.run();
});

/*
 |--------------------------------------------------------------------------------
 | Distribution
 |--------------------------------------------------------------------------------
 */

task("dist", ["clean"], async context => {
  context.isProduction = true;
  const fuse = context.getConfig();
  context.createBundle(fuse);
  await fuse.run();
});
