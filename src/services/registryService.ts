import type { TicketData } from '../types/event';

const REGISTRY_KEY = 'keli26_ticket_registry';
const IMPORTED_FLAG_KEY = 'keli26_registry_imported';

interface RegistryEntry extends TicketData {
  phone?: string;
}

function getRegistryFromStorage(): Map<string, RegistryEntry> {
  try {
    const stored = localStorage.getItem(REGISTRY_KEY);
    if (!stored) return new Map();
    const parsed: Array<[string, RegistryEntry]> = JSON.parse(stored);
    return new Map(parsed);
  } catch {
    return new Map();
  }
}

function saveRegistryToStorage(registry: Map<string, RegistryEntry>): void {
  localStorage.setItem(REGISTRY_KEY, JSON.stringify(Array.from(registry.entries())));
  localStorage.setItem(IMPORTED_FLAG_KEY, 'true');
}

export function isRegistryImported(): boolean {
  return localStorage.getItem(IMPORTED_FLAG_KEY) === 'true';
}

export function getRegistry(): Map<string, RegistryEntry> {
  return getRegistryFromStorage();
}

export function getRegistrySize(): number {
  return getRegistryFromStorage().size;
}

export function findById(ticketId: string): RegistryEntry | undefined {
  const registry = getRegistryFromStorage();
  const normalized = normalizeId(ticketId);
  for (const [, entry] of registry) {
    if (normalizeId(entry.ticketId) === normalized) return entry;
  }
  return undefined;
}

export function findByPhone(phone: string): RegistryEntry | undefined {
  const registry = getRegistryFromStorage();
  const normalized = normalizePhone(phone);
  for (const [, entry] of registry) {
    if (entry.phone && normalizePhone(entry.phone) === normalized) return entry;
  }
  return undefined;
}

export function clearRegistry(): void {
  localStorage.removeItem(REGISTRY_KEY);
  localStorage.removeItem(IMPORTED_FLAG_KEY);
}

function normalizeId(id: string): string {
  return id.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

function parseCsv(text: string): RegistryEntry[] {
  const lines = text.trim().split('\n').filter((l) => l.trim());
  if (lines.length < 2) return [];

  const headerLine = lines[0];
  const headers = headerLine.split(',').map((h) => h.trim().toLowerCase());

  const fieldMap: Record<string, number> = {};
  headers.forEach((h, i) => {
    const key = h.replace(/[^a-z0-9]/g, '');
    fieldMap[key] = i;
  });

  const getField = (row: string[], names: string[]): string => {
    for (const name of names) {
      const idx = fieldMap[name.replace(/[^a-z0-9]/g, '')];
      if (idx !== undefined && row[idx] !== undefined) {
        return row[idx].trim();
      }
    }
    return '';
  };

  const entries: RegistryEntry[] = [];
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(',');
    if (row.length < 2) continue;

    const ticketId = getField(row, ['id', 'ticketid', 'ticket_id']);
    const studentName = getField(row, ['name', 'studentname', 'fullname']);
    const department = getField(row, ['department', 'dept']);
    const passType = getField(row, ['ticket_type', 'tickettype', 'passtype', 'type']);
    const phone = getField(row, ['phone_number', 'phonenumber', 'phone']);

    if (!ticketId || !studentName) continue;

    entries.push({
      ticketId: ticketId.toUpperCase(),
      studentName,
      department: department || undefined,
      passType: passType || 'General',
      paidStatus: 'Complimentary',
      phone: phone || undefined,
    });
  }

  return entries;
}

export async function importRegistryFromCsvUrl(url: string): Promise<{ count: number; preview: RegistryEntry[] }> {
  const cleanUrl = normalizeSheetUrl(url);
  const response = await fetch(cleanUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`);
  }
  const text = await response.text();
  const entries = parseCsv(text);
  if (entries.length === 0) {
    throw new Error('No valid rows found in CSV. Check headers: ID, Name, Department, Ticket Type, Phone');
  }

  const registry = new Map<string, RegistryEntry>();
  for (const entry of entries) {
    registry.set(entry.ticketId, entry);
  }
  saveRegistryToStorage(registry);

  return { count: entries.length, preview: entries.slice(0, 5) };
}

export async function importRegistryFromCsvText(csvText: string): Promise<{ count: number; preview: RegistryEntry[] }> {
  const entries = parseCsv(csvText);
  if (entries.length === 0) {
    throw new Error('No valid rows found in CSV text. Check headers.');
  }

  const registry = new Map<string, RegistryEntry>();
  for (const entry of entries) {
    registry.set(entry.ticketId, entry);
  }
  saveRegistryToStorage(registry);

  return { count: entries.length, preview: entries.slice(0, 5) };
}

function normalizeSheetUrl(url: string): string {
  const trimmed = url.trim();
  if (trimmed.includes('/edit')) {
    return trimmed.replace(/\/edit.*$/, '/export?format=csv');
  }
  if (trimmed.includes('/pub') && trimmed.includes('output=csv')) {
    return trimmed;
  }
  if (trimmed.includes('/spreadsheets/d/') && !trimmed.includes('/export')) {
    return trimmed.replace(/\/edit.*$/, '').replace(/\/$/, '') + '/export?format=csv';
  }
  return trimmed;
}

export function getTotalAttendees(): number {
  const imported = isRegistryImported();
  if (imported) return getRegistrySize();
  return 1000;
}