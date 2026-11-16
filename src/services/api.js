const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/v1').replace(/\/$/, '');

export async function api(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || `API error (${response.status})`);
  }
  return response.status === 204 ? null : response.json();
}

export const loadModels = async () => (await api('/models/search?limit=100')).data;
export const loadInvoices = async (type) => (await api(`/invoices?type=${type}&limit=100`)).data;
export const loadPriceLists = () => api('/price-lists');

export async function createPriceList(name, prices) {
  const priceFields = toPriceFields(prices);
  return api('/price-lists', { method: 'POST', body: JSON.stringify({ name, ...priceFields }) });
}

export async function updatePriceList(name, prices) {
  const rows = await loadPriceLists();
  const row = rows.find((item) => item.name === name);
  if (!row) throw new Error(`Không tìm thấy bảng giá ${name}`);
  return api(`/price-lists/${row._id}`, {
    method: 'PUT',
    body: JSON.stringify({ name, ...toPriceFields(prices) }),
  });
}

function toPriceFields(prices) {
  return Object.fromEntries(['new', 'similar1', 'similar2', 'modular', 'modularSimilar', 'bonus'].map((field) => [field, {
    usd: Number(prices[field]?.usd) || 0,
    vnd: Number(prices[field]?.vnd) || 0,
  }]));
}

export async function deletePriceList(name) {
  const rows = await loadPriceLists();
  const row = rows.find((item) => item.name === name);
  if (row) await api(`/price-lists/${row._id}`, { method: 'DELETE' });
}

export function priceListToTables(rows) {
  return rows.reduce((tables, row) => {
    tables.client[row.name] = Object.fromEntries(['new', 'similar1', 'similar2', 'modular', 'modularSimilar', 'bonus'].map((key) => [key, row[key]?.usd ?? 0]));
    tables.freelancer[row.name] = Object.fromEntries(['new', 'similar1', 'similar2', 'modular', 'modularSimilar', 'bonus'].map((key) => [key, row[key]?.vnd ?? 0]));
    tables.ids[row.name] = row._id;
    return tables;
  }, { client: {}, freelancer: {}, ids: {} });
}

