import {
  CREATE_INVOICE,
  DELETE_INVOICE,
  UPDATE_INVOICE_PAID,
  ADD_MODEL_TO_INVOICE,
  REMOVE_MODEL_FROM_INVOICE,
  UPDATE_INVOICE
} from '../actionTypes';
import { initialInvoices } from '../../data/mockData.js';

const initialState = {
  list: initialInvoices,
};

function nextInvoiceNumber(list) {
  return list.reduce((max, inv) => Math.max(max, inv.invoiceNumber), 1000) + 1;
}

export default function invoiceReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_INVOICE: {
      const newInvoice = {
        id: crypto.randomUUID(),
        invoiceNumber: nextInvoiceNumber(state.list),
        createdAt: new Date().toISOString().slice(0, 10),
        paid: false,
        ...action.payload, // { from, to, models }
      };
      return { ...state, list: [newInvoice, ...state.list] };
    }

    case DELETE_INVOICE:
      return { ...state, list: state.list.filter((inv) => inv.id !== action.payload) };

    case UPDATE_INVOICE_PAID:
      return {
        ...state,
        list: state.list.map((inv) =>
          inv.id === action.payload.invoiceId ? { ...inv, paid: action.payload.paid } : inv
        ),
      };

    case UPDATE_INVOICE:
      return {
        ...state,
        list: state.list.map((inv) =>
          inv.id === action.payload.invoiceId
            ? {
                ...inv,
                from: action.payload.from ?? inv.from,
                to: action.payload.to ?? inv.to,
                models: action.payload.models ?? inv.models,
              }
            : inv
        ),
      };

    default:
      return state;
  }
}