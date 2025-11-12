// All global styles should be imported here for easier maintenance
import "@liquity2/uikit/index.css";

import type { Metadata, Viewport } from "next";
import { type ReactNode } from "react";

import { About } from "@/src/comps/About/About";
import { AppLayout } from "@/src/comps/AppLayout/AppLayout";
import { Blocking } from "@/src/comps/Blocking/Blocking";
import content from "@/src/content";
import { VERCEL_ANALYTICS } from "@/src/env";
import { Ethereum } from "@/src/services/Ethereum";
import { ReactQuery } from "@/src/services/ReactQuery";
import { StoredState } from "@/src/services/StoredState";
import { TransactionFlow } from "@/src/services/TransactionFlow";
import { UiKit } from "@liquity2/uikit";
import { Analytics } from "@vercel/analytics/react";
import { GeistSans } from "geist/font/sans";
import { ModalProvider, ModalRoot } from "@/src/services/ModalService";
import Script from "next/script";

export const metadata: Metadata = {
  title: content.appName,
  icons: "/favicon.svg",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function Layout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      {/* gtag loader */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=G-5EVBD6WBY7`}
        strategy="afterInteractive"
      />
      {/* gtag init */}
      <Script id="gtag-init" strategy="afterInteractive">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer && dataLayer.push(arguments);}
            gtag('js', new Date());
            // Disable the automatic page_view so we can control SPA route views:
            gtag('config', 'G-5EVBD6WBY7', { send_page_view: false });
          `}
      </Script>
      {/* <!-- Addressable Pixel base code --> */}
      <Script>
        {`
          !function(w, d){
              w.__adrsbl = {
                  queue: [],
                  run: function(){
                      this.queue.push(arguments);
                  }
              };
              var s = d.createElement('script');
              s.async = true;
              s.src = 'https://tag.adrsbl.io/p.js?tid=d36fe9c31b254acea36b5005094a0891';
              var b = d.getElementsByTagName('script')[0];
              b.parentNode.insertBefore(s, b);
          }(window, document);
        `}
      </Script>
      <body className={GeistSans.className}>
        <UiKit>
          <ReactQuery>
            <StoredState>
              <Ethereum>
                <Blocking>
                  <TransactionFlow>
                    <About>
                      <ModalProvider>
                        <AppLayout>
                          {children}
                        </AppLayout>
                        <ModalRoot />
                      </ModalProvider>
                    </About>
                  </TransactionFlow>
                </Blocking>
              </Ethereum>
            </StoredState>
          </ReactQuery>
        </UiKit>
        {VERCEL_ANALYTICS && <Analytics />}
      </body>
    </html>
  );
}