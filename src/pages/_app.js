import { Provider } from "react-redux";
import { store } from "@/redux/stores";
import { NextAbstractWalletProvider } from "@/components/agw-provider";
import { Toaster } from "@/components/ui/sonner";
import ToastProvider from "@/components/ToastProvider";

// import global style
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <NextAbstractWalletProvider>
      <Provider store={store}>
        <ToastProvider>
          <Component {...pageProps} />
          <Toaster />
        </ToastProvider>
      </Provider>
    </NextAbstractWalletProvider>
  );
}
