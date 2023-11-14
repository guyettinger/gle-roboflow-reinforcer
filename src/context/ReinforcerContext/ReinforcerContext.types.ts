import { ReactNode } from "react";

export interface ReinforcerOptions {
    apiKey: string
    publishableApiKey: string
    detectionModel: string
    detectionModelVersion: string
    projectId: string
    confidenceThreshold: number
}

export interface ReinforcerUploadImageAnnotationOptions {
    imageName: string
    imageBlob: Blob
    annotationName: string
    annotationData: string
}

export interface ReinforcerOptionsProviderProps {
    reinforcerOptions?: ReinforcerOptions,
    children?: ReactNode
}