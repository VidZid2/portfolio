import { useState } from "react";
import {
  DEFAULT_LLM_MODELS,
  ModelSelectorPrompt,
  type ModelConfiguration,
} from "./model-selector-prompt";

export function PromptComposer() {
  const [modelValue, setModelValue] = useState("claude-fable-5");
  const [configurations, setConfigurations] = useState<
    Record<string, ModelConfiguration>
  >({});
  const [prompt, setPrompt] = useState("");

  return (
    <ModelSelectorPrompt
      configurations={configurations}
      models={DEFAULT_LLM_MODELS}
      onConfigurationChange={(_, __, nextConfigurations) => {
        setConfigurations(nextConfigurations);
      }}
      onModelChange={(model) => {
        setModelValue(model.value);
      }}
      onPromptChange={setPrompt}
      onSubmit={({ model, configuration, prompt }) => {
        // @ts-ignore
        submitPrompt({ model, configuration, prompt });
      }}
      prompt={prompt}
      value={modelValue}
    />
  );
}
