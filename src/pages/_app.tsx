"use client"
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'
import {QueryClientProvider,QueryClient} from '@tanstack/react-query'

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});


 const queryClient = new QueryClient();

 


export default function App({ Component, pageProps }: AppProps) {
  
  return (
      <div className={inter.className}>
       <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId="34153810571-e2pir0h5jb10qa4e05o3e02mqn206kqe.apps.googleusercontent.com">
        <Component {...pageProps} />
        <Toaster />
        <ReactQueryDevtools/>
      </GoogleOAuthProvider>

      </QueryClientProvider>
   
  </div>
  );
    
}
