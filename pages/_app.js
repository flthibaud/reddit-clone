import '../styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import Header from '../src/components/Header'
import { ApolloProvider } from '@apollo/client'
import { Toaster } from 'react-hot-toast'
import {ThemeProvider} from 'next-themes'

import client from '../apollo-client'

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <SessionProvider session={pageProps.session}>
        <ThemeProvider attribute="class">
          <Toaster />
          <div className='h-screen overflow-y-scroll bg-slate-200 dark:bg-[#030303]'>
            <Header />
            <Component {...pageProps} />
          </div>
        </ThemeProvider>
      </SessionProvider>
    </ApolloProvider>
  )
}

export default MyApp
