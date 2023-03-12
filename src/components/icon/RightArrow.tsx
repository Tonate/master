import { SVGProps } from "react";

export const RightArrow = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="24px"
    height="24px"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#a)">
      <path
        d="M17.248 10.012 7.53.275A.937.937 0 0 0 6.204 1.6l9.717 9.737a.939.939 0 0 1 0 1.327L6.204 22.4a.937.937 0 1 0 1.327 1.325l9.716-9.736a2.815 2.815 0 0 0 0-3.977Z"
        fill="#fff"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
