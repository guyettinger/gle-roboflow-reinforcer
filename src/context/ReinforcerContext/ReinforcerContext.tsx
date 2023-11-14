import { createContext, Dispatch, useContext } from "react";
import { useImmerReducer } from "use-immer";
import { RoboflowRestApi, UploadImageResponse } from "gle-roboflow-rest-client";
import {
    ReinforcerOptions,
    ReinforcerOptionsProviderProps,
    ReinforcerUploadImageAnnotationOptions
} from "./ReinforcerContext.types";

const defaultReinforcerOptions: ReinforcerOptions = {
    apiKey: '',
    publishableApiKey: '',
    detectionModel: '',
    detectionModelVersion: '',
    projectId: '',
    confidenceThreshold: 1
}
export const ReinforcerOptionsContext = createContext<ReinforcerOptions>(defaultReinforcerOptions)

export const useReinforcerOptionsContext = () => {
    return useContext(ReinforcerOptionsContext)
}

enum ReinforcerReducerActionTypes {
    UpdateOptions = 'update options',
    UploadImageAnnotation = 'UploadImageAnnotation'
}

type ReinforcerOptionsUpdateAction = {
    type: ReinforcerReducerActionTypes.UpdateOptions
    value: ReinforcerOptions
}

type ReinforcerUploadAction = {
    type: ReinforcerReducerActionTypes.UploadImageAnnotation
    value: ReinforcerUploadImageAnnotationOptions
}

type ReinforcerReducerAction =
    | ReinforcerOptionsUpdateAction
    | ReinforcerUploadAction

const reinforcerReducer = (reinforcerOptions: ReinforcerOptions, action: ReinforcerReducerAction): void => {
    switch (action.type) {
        case ReinforcerReducerActionTypes.UpdateOptions: {
            reinforcerOptions.apiKey = action.value.apiKey
            reinforcerOptions.publishableApiKey = action.value.publishableApiKey
            reinforcerOptions.detectionModel = action.value.detectionModel
            reinforcerOptions.detectionModelVersion = action.value.detectionModelVersion
            reinforcerOptions.projectId = action.value.projectId
            reinforcerOptions.confidenceThreshold = action.value.confidenceThreshold
            break
        }
        case ReinforcerReducerActionTypes.UploadImageAnnotation: {
            const apiKey = reinforcerOptions.apiKey
            const roboflowRestApi = new RoboflowRestApi(apiKey)
            roboflowRestApi.client.interceptors.request.use((config) => {
                config.headers = config.headers || {}
                config.headers["Access-Control-Allow-Credentials"] = "true"
                return config
            })
            const projectId = reinforcerOptions.projectId
            const imageName = action.value.imageName
            const imageBlob = action.value.imageBlob
            const annotationName = action.value.annotationName
            const annotationData = action.value.annotationData
            roboflowRestApi.uploadImage(projectId, imageName, imageBlob).then((uploadImageResponse: UploadImageResponse) => {
                return roboflowRestApi.uploadAnnotation(projectId, uploadImageResponse.id, annotationName, annotationData)
            })
            break
        }
    }
}

export interface ReinforcerApi {
    updateOptions: (value: ReinforcerOptions) => void
    uploadImageAnnotation: (value: ReinforcerUploadImageAnnotationOptions) => void
}

const createReinforcerApi = (dispatch: Dispatch<ReinforcerReducerAction>): ReinforcerApi => {

    const updateOptions = (value: ReinforcerOptions) => {
        const updateAction: ReinforcerOptionsUpdateAction = {
            type: ReinforcerReducerActionTypes.UpdateOptions,
            value: value
        }
        return dispatch(updateAction)
    }

    const uploadImageAnnotation = (value: ReinforcerUploadImageAnnotationOptions) => {
        const uploadAction: ReinforcerUploadAction = {
            type: ReinforcerReducerActionTypes.UploadImageAnnotation,
            value: value
        }
        return dispatch(uploadAction)
    }

    return {
        updateOptions: updateOptions,
        uploadImageAnnotation: uploadImageAnnotation
    }

}

export const ReinforcerApiContext = createContext<ReinforcerApi>({
    updateOptions(value): void {
    },
    uploadImageAnnotation(value): void {
    }
})

export const useReinforcerApiContext = () => {
    return useContext(ReinforcerApiContext)
}

export const ReinforcerProvider = (
    {
        reinforcerOptions = defaultReinforcerOptions,
        children
    }: ReinforcerOptionsProviderProps) => {
    const [value, dispatch] = useImmerReducer<ReinforcerOptions, ReinforcerReducerAction>(reinforcerReducer, reinforcerOptions)
    const api = createReinforcerApi(dispatch)
    return (
        <ReinforcerOptionsContext.Provider value={value}>
            <ReinforcerApiContext.Provider value={api}>
                {children}
            </ReinforcerApiContext.Provider>
        </ReinforcerOptionsContext.Provider>
    )
}