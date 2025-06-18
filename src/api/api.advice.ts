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
      model: 'gemini-2.0-flash',
      contents: '주접떨면서 칭찬하는 글 하나 만들어줘, 대상의 이름이나 이런걸 넣을 필요 없어. 그냥 익명으로',
    });

    // @ts-ignore
    return response.candidates[0]?.content.parts[0]?.text;
  }

}

