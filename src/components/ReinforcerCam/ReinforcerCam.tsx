import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import styled from "styled-components"
import {
    RoboflowLoadParams,
    RoboflowModel,
    RoboflowObjectDetection,
    useRoboflowClientContext,
    RoboflowWebcam,
    RoboflowObjectDetectionCanvas
} from "gle-roboflow-components";
import {
    BoundingBoxModel,
    Difficult,
    ObjectModel,
    PascalVocModel,
    Segmented,
    SizeModel,
    SourceModel,
    toXML,
    Truncated
} from "gle-pascal-voc";
import { ReinforcerSummary } from "@/components/ReinforcerSummary/ReinforcerSummary";
import { ReinforcerCamProps } from "@/components/ReinforcerCam/ReinforcerCam.types";
import { BlobUtilities } from "gle-roboflow-rest-client";
import { useReinforcerApiContext, useReinforcerOptionsContext } from "@/context";

const ReinforcerCamContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 1rem 0;
`

const ReinforcerCamContent = styled.div`
  position: relative;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: #1D1E20;
  border-radius: 4px;
`

const ReinforcerCamVideoContent = styled.div`
  position: relative;
`

export const ReinforcerCam = (
    {
        reinforcerCamDetectionModel,
        reinforcerCamDetectionModelVersion
    }: ReinforcerCamProps) => {
    const webcamRef = useRef<Webcam>(null)
    const [objectDetections, setObjectDetections] = useState<RoboflowObjectDetection[]>([])
    const [webcamInitialized, setWebcamInitialized] = useState<boolean>(false)
    const [webcamWidth, setWebcamWidth] = useState(0)
    const [webcamHeight, setWebcamHeight] = useState(0)
    const roboflowClient = useRoboflowClientContext()
    const isReadyForCanvas = (webcamInitialized && webcamWidth > 0 && webcamHeight > 0)
    const reinforcerOptions = useReinforcerOptionsContext()
    const reinforcerApi = useReinforcerApiContext()

    const detect = async (model: RoboflowModel) => {
        if (!webcamInitialized) return

        const webcam = webcamRef.current
        if (!webcam) return

        const video = webcam.video
        if (!video) return

        //  get detections
        try {
            const detections = await model.detect(video)
            console.log('roboflow detected', detections)
            setObjectDetections(detections)
            processObjectDetections(detections)
        } catch (e) {
            const error = e as Error
            if (!error) return
            console.error(error.message)
        }
    }

    useEffect(() => {
        if (webcamInitialized) {
            // load the model
            const roboflowLoadParams: RoboflowLoadParams = {
                model: reinforcerCamDetectionModel,
                version: reinforcerCamDetectionModelVersion
            }
            roboflowClient.load(roboflowLoadParams).then(() => {
                // start inference
                roboflowClient.startInference(detect)
            })
        }
    }, [webcamInitialized])

    const handleRoboflowWebcamInitialized = () => {
        setWebcamInitialized(true)
        console.log('roboflow webcam initialized')
    }

    const handleRoboflowWebcamSizeChange = (width: number, height: number) => {
        setWebcamWidth(width)
        setWebcamHeight(height)
        console.log('roboflow webcam size change', width, height)
    }

    const processObjectDetections = (detections: RoboflowObjectDetection[]) => {
        if (detections.length) {
            const confidentDetections = detections.filter((detection) => {
                return detection.confidence >= reinforcerOptions.confidenceThreshold
            })
            if(confidentDetections.length){
                uploadImageAnnotation(confidentDetections)
            }
        }
    }

    const getImageBlob = (): Blob | null => {
        if (!webcamInitialized) return null

        const webcam = webcamRef.current
        if (!webcam) return null

        const screenshot = webcam.getScreenshot();
        if (!screenshot) return null

        const imageBlob = BlobUtilities.dataURItoBlob(screenshot);
        return imageBlob
    }

    const uploadImageAnnotation = (detections: RoboflowObjectDetection[]) => {
        let date = new Date().toISOString().replace(/:/g, "_")
        let imageName = `${date}_image.jpg`
        let annotationName = `${date}_annotation.xml`
        let folder = ''
        let fileName = imageName
        let path = imageName
        let source = new SourceModel()
        let size = new SizeModel(webcamWidth, webcamHeight)
        let segmented = Segmented.Linear
        let objects: ObjectModel[] = []

        detections.forEach((objectDetection: RoboflowObjectDetection) => {
            let name: string = objectDetection.class
            let pose: string = 'Unspecified'
            let truncated: Truncated = Truncated.FullyVisible
            let difficult: Difficult = Difficult.Easy
            let bbox = objectDetection.bbox
            let xMin = bbox.x - bbox.width / 2
            let xMax = bbox.x + bbox.width / 2
            let yMin = bbox.y - bbox.height / 2
            let yMax = bbox.y + bbox.height / 2
            let boundingBoxModel: BoundingBoxModel = new BoundingBoxModel(xMin, yMin, xMax, yMax)
            let objectModel = new ObjectModel(name, pose, truncated, difficult, boundingBoxModel)
            objects.push(objectModel)
        })

        const vocModel: PascalVocModel = new PascalVocModel(folder, fileName, path, source, size, segmented, objects)
        let annotationData = toXML.pascalVOCToXML(vocModel)
        let imageBlob = getImageBlob()
        if (!imageBlob) return

        reinforcerApi.uploadImageAnnotation({
            imageName: imageName,
            imageBlob: imageBlob,
            annotationName: annotationName,
            annotationData: annotationData
        })
    }

    return (
        <ReinforcerCamContainer>
            <ReinforcerCamContent>
                <ReinforcerCamVideoContent>
                    <RoboflowWebcam
                        ref={webcamRef}
                        onInitialized={handleRoboflowWebcamInitialized}
                        onSizeChange={handleRoboflowWebcamSizeChange}
                    >
                        {isReadyForCanvas &&
                            <RoboflowObjectDetectionCanvas
                                width={webcamWidth}
                                height={webcamHeight}
                                objectDetections={objectDetections}
                            />
                        }
                    </RoboflowWebcam>
                </ReinforcerCamVideoContent>
                {!!objectDetections && <ReinforcerSummary detections={objectDetections}/>}
            </ReinforcerCamContent>
        </ReinforcerCamContainer>
    )
}
