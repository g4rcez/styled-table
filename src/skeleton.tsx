import React, { useMemo } from "react";

export type SkeletonProps = React.SVGAttributes<SVGElement> & {
  animate?: boolean;
  backgroundColor?: string;
  backgroundOpacity?: number;
  baseUrl?: string;
  foregroundColor?: string;
  foregroundOpacity?: number;
  gradientRatio?: number;
  interval?: number;
  speed?: number;
  title?: string;
};

export const Skeleton: React.FC<SkeletonProps> = ({
  animate = true,
  backgroundColor = "#ffffff",
  backgroundOpacity = 1,
  baseUrl = "",
  children,
  foregroundColor = "#fbfbfc",
  foregroundOpacity = 1,
  gradientRatio = 2,
  id = null,
  interval = 0.25,
  speed = 1.2,
  style = {},
  title = "Loading...",
  ...props
}) => {
  const fixedId = useMemo(() => Math.random().toString(36).substring(0, 8), []);
  const idClip = useMemo(() => `${fixedId}-diff`, [fixedId]);
  const idGradient = useMemo(() => `${fixedId}-animated-diff`, [fixedId]);
  const idAria = useMemo(() => `${fixedId}-aria`, [fixedId]);

  const keyTimes = useMemo(() => `0; ${interval}; 1`, [interval]);
  const dur = useMemo(() => `${speed}s`, [speed]);

  const Title = useMemo(() => (title ? <title id={idAria}>{title}</title> : null), [title, idAria]);

  return (
    <svg aria-labelledby={idAria} role="img" style={style} {...props}>
      {Title}
      <rect
        role="presentation"
        x="0"
        y="0"
        width="100%"
        height="100%"
        clipPath={`url(${baseUrl}#${idClip})`}
        style={{ fill: `url(${baseUrl}#${idGradient})` }}
      />
      <defs role="presentation">
        <clipPath id={idClip}>{children}</clipPath>
        <linearGradient id={idGradient}>
          <stop offset="0%" stopColor={backgroundColor} stopOpacity={backgroundOpacity}>
            {animate && (
              <animate
                attributeName="offset"
                values={`${-gradientRatio}; ${-gradientRatio}; 1`}
                keyTimes={keyTimes}
                dur={dur}
                repeatCount="indefinite"
              />
            )}
          </stop>
          <stop offset="50%" stopColor={foregroundColor} stopOpacity={foregroundOpacity}>
            {animate && (
              <animate
                attributeName="offset"
                values={`${-gradientRatio / 2}; ${-gradientRatio / 2}; ${1 + gradientRatio / 2}`}
                keyTimes={keyTimes}
                dur={dur}
                repeatCount="indefinite"
              />
            )}
          </stop>
          <stop offset="100%" stopColor={backgroundColor} stopOpacity={backgroundOpacity}>
            {animate && (
              <animate
                attributeName="offset"
                values={`0; 0; ${1 + gradientRatio}`}
                keyTimes={keyTimes}
                dur={dur}
                repeatCount="indefinite"
              />
            )}
          </stop>
        </linearGradient>
      </defs>
    </svg>
  );
};
