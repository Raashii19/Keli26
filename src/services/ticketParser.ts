export interface ParsedScanResult {
  ticketId?: string;
  phone?: string;
  rawText: string;
  confidence: 'high' | 'medium' | 'low';
}

export function normalizeId(id: string): string {
  return id.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

function extractIdCandidates(text: string): string[] {
  const upper = text.toUpperCase();
  const candidates: string[] = [];

  const kelidPattern = /KELI26[0-9]+/g;
  let match: RegExpExecArray | null;
  while ((match = kelidPattern.exec(upper)) !== null) {
    candidates.push(match[0]);
  }

  const genericIdPattern = /[A-Z]{2,}[-\s]?[0-9]{3,}/g;
  while ((match = genericIdPattern.exec(upper)) !== null) {
    candidates.push(match[0]);
  }

  return [...new Set(candidates)];
}

function extractPhoneCandidates(text: string): string[] {
  const candidates: string[] = [];

  const phonePatterns = [
    /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
    /\b\d{10,12}\b/g,
    /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{3}\b/g,
  ];

  for (const pattern of phonePatterns) {
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text)) !== null) {
      candidates.push(match[0]);
    }
  }

  return [...new Set(candidates)];
}

export function parseScanText(text: string): ParsedScanResult {
  const trimmed = text.trim();
  const idCandidates = extractIdCandidates(trimmed);
  const phoneCandidates = extractPhoneCandidates(trimmed);

  const bestId = idCandidates.length > 0 ? normalizeId(idCandidates[0]) : undefined;
  const bestPhone = phoneCandidates.length > 0 ? normalizePhone(phoneCandidates[0]) : undefined;

  let confidence: 'high' | 'medium' | 'low' = 'low';
  if (bestId && bestPhone) confidence = 'high';
  else if (bestId) confidence = 'medium';
  else if (bestPhone) confidence = 'medium';

  return {
    ticketId: bestId,
    phone: bestPhone,
    rawText: trimmed,
    confidence,
  };
}

export function resolveTicketId(
  parsed: ParsedScanResult,
  registry: Map<string, { ticketId: string; phone?: string }>
): string | undefined {
  if (parsed.ticketId) {
    const exactMatch = registry.get(parsed.ticketId);
    if (exactMatch) return exactMatch.ticketId;

    const normalized = normalizeId(parsed.ticketId);
    if (normalized !== parsed.ticketId) {
      const normMatch = registry.get(normalized);
      if (normMatch) return normMatch.ticketId;
    }

    const numericSuffix = parsed.ticketId.replace(/^[^0-9]*/, '');
    if (numericSuffix.length >= 3) {
      for (const [, entry] of registry) {
        const entrySuffix = entry.ticketId.replace(/^[^0-9]*/, '');
        if (entrySuffix === numericSuffix || entrySuffix.endsWith(numericSuffix)) {
          return entry.ticketId;
        }
      }
    }
  }

  if (parsed.phone) {
    for (const [, entry] of registry) {
      if (entry.phone && normalizePhone(entry.phone) === parsed.phone) {
        return entry.ticketId;
      }
    }
  }

  return undefined;
}