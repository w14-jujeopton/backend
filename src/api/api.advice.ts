import { GoogleGenAI } from "@google/genai";
import { Injectable } from '@nestjs/common';
import * as console from 'node:console';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiAdvice {

  constructor(private configService: ConfigService) {
  }

  async getAdvice() {
    const ai = new GoogleGenAI({ apiKey: this.configService.get<string>('API_KEY') });
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: "nestJS에 대해서 설명해줘",
    });
    console.log(response.text);
  }

}

