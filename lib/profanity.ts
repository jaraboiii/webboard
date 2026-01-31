
import { Filter } from 'bad-words';

const filter = new Filter();

// Preliminary Thai Bad Words List (Expand as needed for production)
const thaiBadWords = [
  'กู', 'มึง', 'สัส', 'เหี้ย', 'เย็ด', 'ควย', 'หี', 'แตด', 'พ่อมึงตาย', 'แม่มึงตาย', 
  'ไอ้สัตว์', 'ไอ้ควาย', 'ดอกทอง', 'ร่าน', 'เลว', 'ชั่ว', 'นรก', 'ระยำ', 'ถุย'
];

filter.addWords(...thaiBadWords);

export function cleanText(text: string): string {
  if (!text) return "";
  return filter.clean(text);
}

export function isProfane(text: string): boolean {
  if (!text) return false;
  // Check default filter (English) + manual Thai check (bad-words might not catch Thai well without spaces)
  if (filter.isProfane(text)) return true;

  // Manual strict check for Thai substrings
  const lowerText = text.toLowerCase();
  for (const word of thaiBadWords) {
      if (lowerText.includes(word)) return true;
  }
  return false;
}
