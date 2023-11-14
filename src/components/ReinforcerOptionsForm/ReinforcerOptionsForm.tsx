import { ChangeEvent, FormEvent, useState } from "react";
import styled from "styled-components";
import { ReinforcerOptionsFormProps } from "./ReinforcerOptionsForm.types";
import { useReinforcerOptionsContext } from "@/context";
import { useReinforcerApiContext } from "@/context/ReinforcerContext/ReinforcerContext";

const OptionsForm = styled.form`
  display: flex;
  flex-direction: column;

  button {
    float: right;
    margin-left: auto;
  }
`

const OptionsRow = styled.div`
  margin: 10px;
  flex-wrap: nowrap;

  label {
    width: 100%
  }

  input {
    width: 100%
  }
`

export const ReinforcerOptionsForm = ({}: ReinforcerOptionsFormProps) => {
    const reinforcerOptions = useReinforcerOptionsContext()
    const reinforcerOptionApi = useReinforcerApiContext()
    const [formState, setFormState] = useState({...reinforcerOptions})

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target
        setFormState({...formState, [name]: value})
    }

    const handleConfidenceThresholdChange = (event: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target
        const numericValue = parseFloat(value)
        setFormState({...formState, [name]: numericValue})
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        reinforcerOptionApi.updateOptions(formState)
    }

    return (
        <OptionsForm onSubmit={handleSubmit}>
            <OptionsRow>
                <label htmlFor="apiKey">API Key</label>
                <input type="text"
                       id="apiKey"
                       name="apiKey"
                       value={formState.apiKey}
                       onChange={handleChange}
                />
            </OptionsRow>
            <OptionsRow>
                <label htmlFor="publishableApiKey">Publishable API Key</label>
                <input type="text"
                       id="publishableApiKey"
                       name="publishableApiKey"
                       value={formState.publishableApiKey}
                       onChange={handleChange}
                />
            </OptionsRow>

            <OptionsRow>
                <label htmlFor="detectionModel">Model</label>
                <input type="text"
                       id="detectionModel"
                       name="detectionModel"
                       value={formState.detectionModel}
                       onChange={handleChange}
                />
            </OptionsRow>

            <OptionsRow>
                <label htmlFor="detectionModelVersion">Version</label>
                <input type="text"
                       id="detectionModelVersion"
                       name="detectionModelVersion"
                       value={formState.detectionModelVersion}
                       onChange={handleChange}
                />
            </OptionsRow>

            <OptionsRow>
                <label htmlFor="projectId">Project to Reinforce</label>
                <input type="text"
                       id="projectId"
                       name="projectId"
                       value={formState.projectId}
                       onChange={handleChange}
                />
            </OptionsRow>

            <OptionsRow>
                <label htmlFor="confidenceThreshold">Confidence Threshold</label>
                <input type="range"
                       id="confidenceThreshold"
                       name="confidenceThreshold"
                       min={0}
                       max={1}
                       step={0.01}
                       value={formState.confidenceThreshold}
                       onInput={handleConfidenceThresholdChange}
                />
                <p><output>{formState.confidenceThreshold}</output></p>
            </OptionsRow>

            <button type="submit">Submit</button>
        </OptionsForm>
    )
}