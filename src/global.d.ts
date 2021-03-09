type Classes = { readonly [key: string]: string };

declare module "*.module.css" {
  const classes: Classes;
  export default classes;
}
declare module "*.module.sass" {
  const classes: Classes;
  export default classes;
}
declare module "*.module.scss" {
  const classes: Classes;
  export default classes;
}
