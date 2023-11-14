'use client'
import { ReactNode } from "react";
import styled from "styled-components";
import { AppStyleProvider } from "@/styles/AppStyleProvider";
import { Navbar } from "@/components/Navbar/Navbar";
import { Footer } from "@/components/Footer/Footer";
import { ReinforcerProvider } from "@/context";

const PageBody = styled.body`
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  font-family: Roboto, serif;
`

const PageMain = styled.main`
  flex: 1;
`

export const PageLayout = ({children}: { children: ReactNode }) => {
    return (
        <PageBody>
            <AppStyleProvider>
                <ReinforcerProvider>
                    <Navbar/>
                    <PageMain>
                        {children}
                    </PageMain>
                    <Footer/>
                </ReinforcerProvider>
            </AppStyleProvider>
        </PageBody>
    )
}