import { NextResponse } from 'next/server';
import { DemoConfig, ParameterLocation } from '@/lib/types';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    // Read the ultravox-config.js file from your Twilio project
    const configPath = join(process.cwd(), '..', '..', 'twilio-incoming-advanced-js', 'ultravox-config.js');
    const configContent = await readFile(configPath, 'utf-8');
    
    // Extract the configuration by evaluating the module
    // This is a simple approach - we'll parse the exported object
    const configMatch = configContent.match(/export const ULTRAVOX_CALL_CONFIG = ({[\s\S]*?});/);
    
    if (!configMatch) {
      throw new Error('Could not find ULTRAVOX_CALL_CONFIG in ultravox-config.js');
    }
    
    // Extract the toolsBaseUrl
    const toolsBaseUrlMatch = configContent.match(/const toolsBaseUrl = ["']([^"']+)["']/);
    const toolsBaseUrl = toolsBaseUrlMatch ? toolsBaseUrlMatch[1] : 'http://localhost:3000';
    
    // Parse the configuration object (simplified approach)
    // In a real implementation, you might want to use a proper JS parser
    const configStr = configMatch[1];
    
    // Extract key values using regex (simplified parsing)
    const systemPromptMatch = configStr.match(/systemPrompt:\s*SYSTEM_PROMPT/);
    const modelMatch = configStr.match(/model:\s*['"]([^'"]+)['"]/);
    const voiceMatch = configStr.match(/voice:\s*['"]([^'"]+)['"]/);
    const temperatureMatch = configStr.match(/temperature:\s*([\d.]+)/);
    
    // Extract SYSTEM_PROMPT content
    const systemPromptContentMatch = configContent.match(/const SYSTEM_PROMPT = `([\s\S]*?)`;/);
    const systemPrompt = systemPromptContentMatch ? systemPromptContentMatch[1] : 'System prompt not found';
    
    // Extract selectedTools
    const selectedToolsMatch = configContent.match(/const selectedTools = (\[[\s\S]*?\]);/);
    let selectedTools = [];
    
    if (selectedToolsMatch) {
      // Convert the tools format for web interface
      // This is a simplified conversion - you might need to adjust based on your exact format
      selectedTools = [
        {
          "temporaryTool": {
            "modelToolName": "checkPricing",
            "description": "Gets pricing information for a taxi journey between two addresses",
            "dynamicParameters": [
              {
                "name": "sourceAddress",
                "location": ParameterLocation.BODY,
                "schema": {
                  "description": "Validated source address",
                  "type": "string",
                },
                "required": true,
              },
              {
                "name": "destinationAddress",
                "location": ParameterLocation.BODY,
                "schema": {
                  "description": "Validated destination address",
                  "type": "string",
                },
                "required": true,
              },
            ],
            "http": {
              "baseUrlPattern": `${toolsBaseUrl}/cromwell/checkPricing`,
              "httpMethod": "POST",
            },
          },
        },
        {
          "temporaryTool": {
            "modelToolName": "BookCab",
            "description": "Handles taxi bookings including create, update, get, and cancel operations",
            "dynamicParameters": [
              {
                "name": "operation",
                "location": ParameterLocation.BODY,
                "schema": {
                  "description": "Operation type: cabBooking, getBooking, updateBooking, cancelBooking, getDriverLocation",
                  "type": "string",
                },
                "required": true,
              },
              {
                "name": "companyId",
                "location": ParameterLocation.BODY,
                "schema": {
                  "description": "Company ID for Cromwell Cars",
                  "type": "string",
                },
                "required": false,
              },
              {
                "name": "jobNO",
                "location": ParameterLocation.BODY,
                "schema": {
                  "description": "Job number for existing bookings",
                  "type": "string",
                },
                "required": false,
              },
              {
                "name": "Phone",
                "location": ParameterLocation.BODY,
                "schema": {
                  "description": "Phone number for booking lookup",
                  "type": "string",
                },
                "required": false,
              },
              {
                "name": "passengerName",
                "location": ParameterLocation.BODY,
                "schema": {
                  "description": "Passenger name",
                  "type": "string",
                },
                "required": false,
              },
              {
                "name": "passengerEmail",
                "location": ParameterLocation.BODY,
                "schema": {
                  "description": "Passenger email",
                  "type": "string",
                },
                "required": false,
              },
              {
                "name": "passengerPhone",
                "location": ParameterLocation.BODY,
                "schema": {
                  "description": "Passenger phone number",
                  "type": "string",
                },
                "required": false,
              },
              {
                "name": "origin",
                "location": ParameterLocation.BODY,
                "schema": {
                  "description": "Pickup address",
                  "type": "string",
                },
                "required": false,
              },
              {
                "name": "destination",
                "location": ParameterLocation.BODY,
                "schema": {
                  "description": "Destination address",
                  "type": "string",
                },
                "required": false,
              },
              {
                "name": "date",
                "location": ParameterLocation.BODY,
                "schema": {
                  "description": "Booking date and time in YYYY-MM-DDTHH:mm:ss.SSSZ format",
                  "type": "string",
                },
                "required": false,
              },
              {
                "name": "vehicleTypeId",
                "location": ParameterLocation.BODY,
                "schema": {
                  "description": "Vehicle type ID",
                  "type": "string",
                },
                "required": false,
              },
              {
                "name": "customerPrice",
                "location": ParameterLocation.BODY,
                "schema": {
                  "description": "Price in pounds",
                  "type": "string",
                },
                "required": false,
              },
              {
                "name": "passengers",
                "location": ParameterLocation.BODY,
                "schema": {
                  "description": "Number of passengers",
                  "type": "string",
                },
                "required": false,
              },
              {
                "name": "bags",
                "location": ParameterLocation.BODY,
                "schema": {
                  "description": "Luggage details",
                  "type": "string",
                },
                "required": false,
              },
              {
                "name": "note",
                "location": ParameterLocation.BODY,
                "schema": {
                  "description": "Special notes for driver",
                  "type": "string",
                },
                "required": false,
              },
            ],
            "http": {
              "baseUrlPattern": `${toolsBaseUrl}/cromwell/bookCab`,
              "httpMethod": "POST",
            },
          },
        },
        {
          "temporaryTool": {
            "modelToolName": "address_validate",
            "description": "Validates UK addresses including postcodes and building numbers",
            "dynamicParameters": [
              {
                "name": "address_lines",
                "location": ParameterLocation.BODY,
                "schema": {
                  "description": "Array of address lines",
                  "type": "array",
                  "items": { "type": "string" }
                },
                "required": true,
              },
              {
                "name": "postcode",
                "location": ParameterLocation.BODY,
                "schema": {
                  "description": "UK postcode",
                  "type": "string"
                },
                "required": false,
              },
              {
                "name": "building",
                "location": ParameterLocation.BODY,
                "schema": {
                  "description": "Building number or name",
                  "type": "string"
                },
                "required": false,
              }
            ],
            "http": {
              "baseUrlPattern": `${toolsBaseUrl}/cromwell/validateAddress`,
              "httpMethod": "POST"
            }
          }
        }
      ];
    }
    
    const demoConfig: DemoConfig = {
      title: "Cromwell Cars",
      overview: "This agent is Alex, a professional dispatcher for Cromwell Cars taxi service in London. You can book a taxi, check existing bookings, get driver locations, or cancel bookings.",
      callConfig: {
        systemPrompt: systemPrompt,
        model: modelMatch ? modelMatch[1] : "fixie-ai/ultravox",
        languageHint: "en",
        selectedTools: selectedTools,
        voice: voiceMatch ? voiceMatch[1] : "a656a751-b754-4621-b571-e1298cb7e5bb",
        temperature: temperatureMatch ? parseFloat(temperatureMatch[1]) : 0.3
      }
    };
    
    console.log('✅ Loaded configuration from ultravox-config.js');
    console.log(`📡 Tools base URL: ${toolsBaseUrl}`);
    console.log(`🎯 Model: ${demoConfig.callConfig.model}`);
    console.log(`🎤 Voice: ${demoConfig.callConfig.voice}`);
    
    return NextResponse.json(demoConfig);
    
  } catch (error) {
    console.error('❌ Failed to load ultravox-config.js:', error);
    
    // Return a fallback configuration
    const fallbackConfig: DemoConfig = {
      title: "Cromwell Cars",
      overview: "Configuration loading failed. Using fallback configuration.",
      callConfig: {
        systemPrompt: "You are Alex, a dispatcher for Cromwell Cars taxi service.",
        model: "fixie-ai/ultravox",
        languageHint: "en",
        selectedTools: [],
        voice: "a656a751-b754-4621-b571-e1298cb7e5bb",
        temperature: 0.3
      }
    };
    
    return NextResponse.json(fallbackConfig, { status: 500 });
  }
}