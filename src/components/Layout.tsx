import React from 'react'
import { useOpacity } from 'store/AppState'
import Footer from './Footer'

const Layout: React.FC<React.PropsWithChildren<LayoutProps>> = ({ children }) => {
  const [不透明度] = useOpacity()

  return (
    <div className={`h-screen w-full pb-4 flex flex-col items-center`} style={{ opacity: 不透明度 }}>
      {children}
      <Footer />
    </div>
  )
}

Layout.displayName = 'Layout'

export default Layout

export type LayoutProps = {}
