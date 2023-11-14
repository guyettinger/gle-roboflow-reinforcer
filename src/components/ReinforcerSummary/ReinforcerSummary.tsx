"use client"
import styled from "styled-components";
import { RoboflowObjectDetection } from "gle-roboflow-components";
import { ReinforcerCamSummaryProps } from "@/components/ReinforcerSummary/ReinforcerSummary.types";

const ReinforcerCamSummaryContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

const ReinforcerCamSummaryText = styled.div`
  text-align: center;
  margin: 1rem 0;
  width: 80%;

  @media screen and (max-width: 768px) {
    width: 100%;
  }
`

const ReinforcerCamSummaryHeader1 = styled.h1`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1rem;
`

const ReinforcerCamSummaryParagraph = styled.p`
  font-size: 1rem;
  font-weight: 400;
  margin-bottom: 1rem;
`

export const ReinforcerSummary = ({detections}: ReinforcerCamSummaryProps) => {

    if (detections) {
        detections.forEach((detection: RoboflowObjectDetection) => {

        })
    }

    return (
        <ReinforcerCamSummaryContainer>
            <ReinforcerCamSummaryText>
                <ReinforcerCamSummaryHeader1>
                    Summary
                </ReinforcerCamSummaryHeader1>
                <ReinforcerCamSummaryParagraph>

                </ReinforcerCamSummaryParagraph>
            </ReinforcerCamSummaryText>
        </ReinforcerCamSummaryContainer>
    )
}