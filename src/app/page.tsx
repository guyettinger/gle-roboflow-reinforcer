"use client"
import { useEffect, useState } from "react";
import styled from "styled-components";
import {
    waitForRoboflowModule,
    RoboflowAuthParams,
    RoboflowApiProvider,
    RoboflowClientProvider
} from "gle-roboflow-components"
import { ReinforcerCam } from "@/components/ReinforcerCam/ReinforcerCam";
import { Loading } from "@/components/Loading";
import { useReinforcerOptionsContext } from "@/context";

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 10%
`

const HelpParagraph = styled.p`
  font-size: 18px;
  text-align: center;
  margin: 20px 0;
`

export default function Home() {
    const [roboflowReady, setRoboflowReady] = useState(false)
    const reinforcerOptions = useReinforcerOptionsContext()
    const publishableApiKey = reinforcerOptions.publishableApiKey
    const areOptionsReady = reinforcerOptions.publishableApiKey !== '' && reinforcerOptions.apiKey !== '' && reinforcerOptions.detectionModel !== '' && reinforcerOptions.detectionModelVersion !== '' && reinforcerOptions.projectId !== ''

    // authorization
    const roboflowAuthParams: RoboflowAuthParams = {
        publishable_key: publishableApiKey
    }

    // detection model
    const reinforcerDetectionModel = reinforcerOptions.detectionModel
    const reinforcerDetectionModelVersion = reinforcerOptions.detectionModelVersion

    useEffect(() => {
        waitForRoboflowModule().then(() => {
            setRoboflowReady(true)
        })
    }, []);

    return (
        <HomeContainer>
            {roboflowReady && areOptionsReady &&
                <RoboflowApiProvider roboflowAuthParams={roboflowAuthParams}>
                    <RoboflowClientProvider>
                        <ReinforcerCam reinforcerCamDetectionModel={reinforcerDetectionModel}
                                       reinforcerCamDetectionModelVersion={reinforcerDetectionModelVersion}
                        />
                    </RoboflowClientProvider>
                </RoboflowApiProvider>
            }
            {!roboflowReady && !areOptionsReady &&
                <Loading/>
            }
            {!areOptionsReady &&
                <HelpParagraph>Please configure options</HelpParagraph>
            }
        </HomeContainer>
    )
}
