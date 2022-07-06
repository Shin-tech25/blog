import React from "react"
import Header from "./Header"
import Main from "./Main"
import Sidebar from "./Sidebar"
import Footer from "./Footer"

export default ({ page = "default", children }) => (
  <>
    <Header page={page} />
    <Main sidebar={<Sidebar />}>{children}</Main>
    <Footer />
  </>
)
