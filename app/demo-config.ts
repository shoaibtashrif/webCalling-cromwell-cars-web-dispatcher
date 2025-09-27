import { DemoConfig, ParameterLocation, SelectedTool } from "@/lib/types";

// This file imports the SAME ultravox-config.js used by Twilio
// Edit twilio-incoming-advanced-js/ultravox-config.js to update BOTH phone and web

// Dynamic import of your shared Twilio configuration
let ultravoxConfig: any = null;

async function loadUltravoxConfig() {
  if (!ultravoxConfig) {
    try {
      // Import the EXACT SAME config file used by Twilio service
      const configModule = await import('../../../twilio-incoming-advanced-js/ultravox-config.js');
      ultravoxConfig = configModule.ULTRAVOX_CALL_CONFIG;
      console.log('✅ Loaded shared config from twilio-incoming-advanced-js/ultravox-config.js');
    } catch (error) {
      console.error('❌ Failed to load shared ultravox-config.js:', error);
      throw new Error('Cannot load shared configuration file');
    }
  }
  return ultravoxConfig;
}

// Convert Twilio tool format to web format
function convertToolsForWeb(twilioTools: any[]): SelectedTool[] {
  if (!twilioTools) return [];
  
  return twilioTools.map(tool => {
    const twilioTool = tool.temporaryTool;
    
    return {
      temporaryTool: {
        modelToolName: twilioTool.modelToolName,
        description: twilioTool.description,
        dynamicParameters: twilioTool.dynamicParameters.map((param: any) => ({
          name: param.name,
          location: ParameterLocation.BODY,
          schema: param.schema,
          required: param.required
        })),
        http: twilioTool.http
      }
    };
  });
}

// Create demo config from the SAME Twilio configuration file
async function createDemoConfigFromSharedConfig(): Promise<DemoConfig> {
  const config = await loadUltravoxConfig();
  
  return {
    title: "Cromwell Cars",
    overview: "This agent uses the SAME configuration as the Twilio phone service. Edit twilio-incoming-advanced-js/ultravox-config.js to update both phone and web interfaces.",
    callConfig: {
      systemPrompt: config.systemPrompt,
      model: config.model,
      languageHint: "en",
      selectedTools: convertToolsForWeb(config.selectedTools),
      voice: config.voice,
      temperature: config.temperature
    }
  };
}

// Export the async loader
export const loadDemoConfig = createDemoConfigFromSharedConfig;

// Fallback synchronous config for initial render
const FALLBACK_SYSTEM_PROMPT = `
Loading shared configuration from twilio-incoming-advanced-js/ultravox-config.js...
This ensures both phone and web use the SAME agent configuration.
`;

// Fallback configuration for initial render
export const demoConfig: DemoConfig = {
  title: "Cromwell Cars",
  overview: "Loading shared configuration from twilio-incoming-advanced-js/ultravox-config.js...",
  callConfig: {
    systemPrompt: FALLBACK_SYSTEM_PROMPT,
    model: "fixie-ai/ultravox",
    languageHint: "en",
    selectedTools: [],
    voice: "a656a751-b754-4621-b571-e1298cb7e5bb",
    temperature: 0.3
  }
};

export default demoConfig;