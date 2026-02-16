// NOWPayments API Configuration
// Docs: https://documenter.getpostman.com/view/7907941/2s93JRVFUW

export const NOWPAYMENTS_CONFIG = {
  apiKey: process.env.NOWPAYMENTS_API_KEY || "",
  apiUrl: "https://api.nowpayments.io/v1",
  ipnCallbackUrl: `${process.env.NEXTAUTH_URL}/api/webhooks/nowpayments`,
  successUrl: `${process.env.NEXTAUTH_URL}/payment/success`,
  cancelUrl: `${process.env.NEXTAUTH_URL}/pricing`,
};

export interface NOWPaymentsPayment {
  payment_id: string;
  payment_status: string;
  pay_address: string;
  price_amount: number;
  price_currency: string;
  pay_amount: number;
  pay_currency: string;
  order_id: string;
  order_description: string;
  ipn_callback_url: string;
  created_at: string;
  updated_at: string;
  purchase_id: string;
  amount_received: number;
  payin_extra_id: string | null;
  smart_contract: string | null;
  network: string | null;
  network_precision: string | null;
  time_limit: string | null;
  burning_percent: string | null;
  expiration_estimate_date: string;
  is_fixed_rate: boolean;
  is_fee_paid_by_user: boolean;
}

export interface CreatePaymentParams {
  price_amount: number;
  price_currency: string;
  pay_currency: string;
  ipn_callback_url: string;
  order_id: string;
  order_description: string;
  success_url?: string;
  cancel_url?: string;
  is_fee_paid_by_user?: boolean;
  is_fixed_rate?: boolean;
}

export class NOWPaymentsClient {
  private apiKey: string;
  private apiUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.apiUrl = NOWPAYMENTS_CONFIG.apiUrl;
  }

  private async request(endpoint: string, method: string = "GET", body?: any) {
    const headers: HeadersInit = {
      "x-api-key": this.apiKey,
      "Content-Type": "application/json",
    };

    const options: RequestInit = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${this.apiUrl}${endpoint}`, options);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`NOWPayments API error: ${error}`);
    }

    return response.json();
  }

  async getStatus() {
    return this.request("/status");
  }

  async getAvailableCurrencies() {
    return this.request("/currencies");
  }

  async getEstimate(amount: number, currency_from: string, currency_to: string) {
    return this.request(
      `/estimate?amount=${amount}&currency_from=${currency_from}&currency_to=${currency_to}`
    );
  }

  async createPayment(params: CreatePaymentParams): Promise<NOWPaymentsPayment> {
    return this.request("/payment", "POST", params);
  }

  async getPaymentStatus(paymentId: string): Promise<NOWPaymentsPayment> {
    return this.request(`/payment/${paymentId}`);
  }

  async createInvoice(params: {
    price_amount: number;
    price_currency: string;
    order_id: string;
    order_description: string;
    ipn_callback_url: string;
    success_url: string;
    cancel_url: string;
  }) {
    return this.request("/invoice", "POST", params);
  }
}

export const nowPayments = new NOWPaymentsClient(NOWPAYMENTS_CONFIG.apiKey);
