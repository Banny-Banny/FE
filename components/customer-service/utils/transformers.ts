/**
 * components/customer-service/utils/transformers.ts
 * API 응답 형식 변환 유틸리티
 * camelCase ↔ snake_case 변환 함수
 */

import { ChatMessage, Inquiry } from '../types';

/**
 * camelCase 문자열을 snake_case로 변환하는 헬퍼 함수
 */
function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/**
 * 객체의 키를 camelCase에서 snake_case로 변환하는 헬퍼 함수
 */
function transformKeysToSnakeCase<T extends Record<string, any>>(obj: T): Record<string, any> {
  const result: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = camelToSnake(key);
    
    // null 또는 undefined는 그대로 전달
    if (value === null || value === undefined) {
      result[snakeKey] = value;
      continue;
    }
    
    // 배열인 경우 재귀적으로 처리
    if (Array.isArray(value)) {
      result[snakeKey] = value.map((item) => {
        if (typeof item === 'object' && item !== null) {
          return transformKeysToSnakeCase(item);
        }
        return item;
      });
      continue;
    }
    
    // 객체인 경우 재귀적으로 처리
    if (typeof value === 'object') {
      result[snakeKey] = transformKeysToSnakeCase(value);
      continue;
    }
    
    // 기본 타입은 그대로 전달
    result[snakeKey] = value;
  }
  
  return result;
}

/**
 * Inquiry 타입을 camelCase에서 snake_case로 변환
 * API 요청 시 사용
 * 
 * @param inquiry camelCase 형식의 Inquiry 객체
 * @returns snake_case 형식의 Inquiry 객체
 */
export function transformInquiryToSnakeCase(inquiry: Inquiry): Record<string, any> {
  return transformKeysToSnakeCase(inquiry);
}

/**
 * ChatMessage 타입을 camelCase에서 snake_case로 변환
 * API 요청 시 사용
 * 
 * @param message camelCase 형식의 ChatMessage 객체
 * @returns snake_case 형식의 ChatMessage 객체
 */
export function transformMessageToSnakeCase(message: ChatMessage): Record<string, any> {
  return transformKeysToSnakeCase(message);
}

/**
 * Inquiry 배열을 camelCase에서 snake_case로 변환
 * API 요청 시 사용
 * 
 * @param inquiries camelCase 형식의 Inquiry 배열
 * @returns snake_case 형식의 Inquiry 배열
 */
export function transformInquiriesToSnakeCase(inquiries: Inquiry[]): Record<string, any>[] {
  return inquiries.map(transformInquiryToSnakeCase);
}

/**
 * ChatMessage 배열을 camelCase에서 snake_case로 변환
 * API 요청 시 사용
 * 
 * @param messages camelCase 형식의 ChatMessage 배열
 * @returns snake_case 형식의 ChatMessage 배열
 */
export function transformMessagesToSnakeCase(messages: ChatMessage[]): Record<string, any>[] {
  return messages.map(transformMessageToSnakeCase);
}
