declare module "*.module.css" {
  const className: { [className: string]: string };
  export = className;
}
