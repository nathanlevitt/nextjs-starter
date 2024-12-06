import { ImageResponse } from "next/og";

import { Icons } from "@/components/icons";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        tw="flex items-center justify-center bg-white text-black rounded-lg"
        style={{
          width: size.width,
          height: size.height,
        }}
      >
        <Icons.logo fill="currentColor" width="90%" height="90%" />
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported icons size metadata
      // config to also set the ImageResponse's width and height.
      ...size,
    },
  );
}
