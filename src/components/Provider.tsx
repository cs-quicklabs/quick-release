'use client'

import React, { FC, ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'

interface ProviderProps {
    children : ReactNode
}

const queryClient = new QueryClient()

const Provider: FC<ProviderProps> = ({children}) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

export default Provider