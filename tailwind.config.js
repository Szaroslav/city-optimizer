import TailwindForms from "@tailwindcss/forms";

/** @type {import("tailwindcss").Config} */
export default {
  darkMode: [ "media" ],
  content:  [ "src/templates/**/*.ejs" ],
  theme:    {},
  plugins:  [ TailwindForms ],
};
