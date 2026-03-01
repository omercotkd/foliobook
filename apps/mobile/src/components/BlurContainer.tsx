// https://gist.github.com/dutradotdev/50c82763fc621ab3c1bd5ba02180ce0d
// import React from "react";
// import WebView from "react-native-webview";

// export type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;

// export interface BlurContainerProps {
//   backgroundColor: RGBA;
//   blurRadius: number;
// }

// const BlurContainer = ({ backgroundColor, blurRadius }: BlurContainerProps) => {
//   return (
//     <WebView
//       style={[
//         tw("absolute inset-0 bg-white/0"),
//         { backgroundColor: "#00000000" },
//       ]}
//       source={{
//         html: `
//             <div style="position: absolute;
//             top: 0;
//             right:0;
//             bottom: 0;
//             left: 0;
//             background: ${backgroundColor};
//             -webkit-backdrop-filter: blur(${blurRadius}px);
//             backdrop-filter: blur(${blurRadius}px);"
//             />
//       `,
//       }}
//     />
//   );
// };

// export default BlurContainer;
