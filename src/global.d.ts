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

declare module "*.png" {
  const src: string;
  export default src;
}
declare module "*.jpg" {
  const src: string;
  export default src;
}
declare module "*.jpeg" {
  const src: string;
  export default src;
}
declare module "*.gif" {
  const src: string;
  export default src;
}
declare module "*.svg" {
  const src: string;
  export default src;
}
declare module "*.webp" {
  const src: string;
  export default src;
}
