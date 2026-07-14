/**
 * Root HTML document for the web build (Expo Router static rendering). Beyond the
 * default reset, it wires the PWA bits — web-app manifest, theme colour and a
 * service worker — so Android Chrome offers a real "Install app" (standalone
 * WebAPK), not just a browser shortcut. Paths are RELATIVE so they resolve under
 * the GitHub Pages sub-path (/ainulindale/) without hard-coding it.
 */
import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

const registerSW = `
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('sw.js').catch(function () {});
  });
}
`;

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no, viewport-fit=cover"
        />

        <meta name="theme-color" content="#0a0e24" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Arda" />
        <link rel="manifest" href="manifest.json" />
        <link rel="apple-touch-icon" href="icon-192.png" />

        <ScrollViewStyleReset />
        <script dangerouslySetInnerHTML={{ __html: registerSW }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
