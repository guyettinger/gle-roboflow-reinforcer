"use client"
import { useState } from "react";
import { MdHelp } from "react-icons/md";
import { MdSettings } from "react-icons/md"
import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";
import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverHeading,
    PopoverTrigger
} from "gle-components";
import { ReinforcerOptionsForm } from "@/components/ReinforcerOptionsForm";

const NavContainer = styled.div`
  display: flex;
  justify-content: normal;
  align-items: center;
  padding: 1rem 20px 1rem 0;
  color: #efefef;
  background-color: #1D1E20;
`

const NavSpacer = styled.div`
  display: flex;
  flex: 1
`

const NavImage = styled(Image)`
  margin: -14px 0
`

const NavLogo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
`

const HelpPopoverContent = styled(PopoverContent)`
  color: black;
`

const NavIconContainer = styled.div`
  flex: auto;
  max-width: 64px;
`

const HelpIcon = styled(MdHelp)`
  font-size: 32px;
  margin-right: 4px;
  vertical-align: text-top;

  &:hover {
    color: white;
  }
`

const OptionsPopoverContent = styled(PopoverContent)`
  color: black;
  width: 350px;
`

const OptionsIcon = styled(MdSettings)`
  font-size: 32px;
  margin-right: 4px;
  vertical-align: text-top;

  &:hover {
    color: white;
  }
`

export const Navbar = () => {
    const [helpOpen, setHelpOpen] = useState(false);
    const [optionsOpen, setOptionsOpen] = useState(false);
    return (
        <NavContainer>
            <NavLogo>
                <NavImage src='./images/avatar.png' className="profile-img" width={48} height={48} alt="Guy's Avatar"/>
                <Link href="/">
                    Roboflow Reinforcer
                </Link>
            </NavLogo>
            <NavSpacer/>
            <Popover open={optionsOpen} onOpenChange={setOptionsOpen}>
                <PopoverTrigger asChild={true} onClick={() => setOptionsOpen((v) => !v)}>
                    <NavIconContainer><OptionsIcon/></NavIconContainer>
                </PopoverTrigger>
                <OptionsPopoverContent>
                    <PopoverHeading>Options</PopoverHeading>
                    <ReinforcerOptionsForm/>
                </OptionsPopoverContent>
            </Popover>
            <Popover open={helpOpen} onOpenChange={setHelpOpen}>
                <PopoverTrigger asChild={true} onClick={() => setHelpOpen((v) => !v)}>
                    <NavIconContainer><HelpIcon/></NavIconContainer>
                </PopoverTrigger>
                <HelpPopoverContent>
                    <PopoverHeading>Directions</PopoverHeading>
                    <PopoverDescription>
                        Reinforce Roboflow Annotations using an existing model
                    </PopoverDescription>
                </HelpPopoverContent>
            </Popover>
        </NavContainer>
    )
}