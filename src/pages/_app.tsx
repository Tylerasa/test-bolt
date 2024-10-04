import { type AppType } from "next/dist/shared/lib/utils";

import "~/styles/globals.css";
import RootLayout from "./pokedex/layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "~/components/ui/sonner";


const queryClient = new QueryClient();
const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <RootLayout>
        <Component {...pageProps} />
        <Toaster />
      </RootLayout>
    </QueryClientProvider>
  );
};

export default MyApp;
