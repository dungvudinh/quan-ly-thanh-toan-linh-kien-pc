import {
  CREATE_INVOICE,
  DELETE_INVOICE,
  UPDATE_INVOICE_PAID,
  ADD_MODEL_TO_INVOICE,
  REMOVE_MODEL_FROM_INVOICE,
  UPDATE_INVOICE
} from '../actionTypes';

// invoice: { from, to, models }  -> reducer tự sinh id/invoiceNumber/createdAt
export const createInvoice = (invoice) => ({ type: CREATE_INVOICE, payload: invoice });

export const deleteInvoice = (invoiceId) => ({ type: DELETE_INVOICE, payload: invoiceId });

export const updateInvoicePaid = (invoiceId, paid) => ({
  type: UPDATE_INVOICE_PAID,
  payload: { invoiceId, paid },
});

export const updateInvoice = (invoiceId, { from, to, models }) => ({
  type: UPDATE_INVOICE,
  payload: { invoiceId, from, to, models },
});