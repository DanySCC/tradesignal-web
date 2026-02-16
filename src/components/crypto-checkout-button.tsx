'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Copy, ExternalLink, CheckCircle2, Clock, XCircle } from 'lucide-react';

interface CryptoCheckoutButtonProps {
  priceId: string;
}

interface PaymentData {
  invoiceId: string;
  invoiceUrl: string;
  payAddress: string;
  payAmount: number;
  payCurrency: string;
  payment_status?: string;
}

const POPULAR_CURRENCIES = [
  { value: 'btc', label: 'Bitcoin (BTC)' },
  { value: 'eth', label: 'Ethereum (ETH)' },
  { value: 'usdttrc20', label: 'Tether USDT (TRC20)' },
  { value: 'usdterc20', label: 'Tether USDT (ERC20)' },
  { value: 'ltc', label: 'Litecoin (LTC)' },
  { value: 'trx', label: 'Tron (TRX)' },
  { value: 'bnbbsc', label: 'BNB (BSC)' },
  { value: 'sol', label: 'Solana (SOL)' },
];

export function CryptoCheckoutButton({ priceId }: CryptoCheckoutButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('btc');
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string>('waiting');
  const [copied, setCopied] = useState(false);

  const handleCreateInvoice = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/crypto-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          payCurrency: selectedCurrency,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create invoice');
      }

      const data = await response.json();
      setPaymentData(data);
      setPaymentStatus('waiting');

      // Start polling for status updates
      startStatusPolling(data.invoiceId);
    } catch (error) {
      console.error('Crypto checkout error:', error);
      alert(error instanceof Error ? error.message : 'Failed to create crypto invoice');
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const startStatusPolling = (paymentId: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/crypto-checkout?payment_id=${paymentId}`);
        if (!response.ok) return;

        const data = await response.json();
        setPaymentStatus(data.payment_status);

        // Stop polling if payment is finished (success or failed)
        if (['finished', 'failed', 'refunded', 'expired'].includes(data.payment_status)) {
          clearInterval(interval);
          
          if (data.payment_status === 'finished') {
            // Payment successful - redirect to success page
            setTimeout(() => {
              window.location.href = '/payment/success?session_id=crypto_' + paymentId;
            }, 2000);
          }
        }
      } catch (error) {
        console.error('Status polling error:', error);
      }
    }, 10000); // Poll every 10 seconds

    // Clean up interval on unmount
    return () => clearInterval(interval);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'finished':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'failed':
      case 'refunded':
      case 'expired':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusText = () => {
    switch (paymentStatus) {
      case 'waiting':
        return 'Waiting for payment...';
      case 'confirming':
        return 'Confirming transaction...';
      case 'confirmed':
        return 'Payment confirmed!';
      case 'sending':
        return 'Processing...';
      case 'finished':
        return 'Payment successful!';
      case 'failed':
        return 'Payment failed';
      case 'refunded':
        return 'Payment refunded';
      case 'expired':
        return 'Payment expired';
      default:
        return 'Processing...';
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="w-full"
      >
        Pay with Crypto
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pay with Cryptocurrency</DialogTitle>
            <DialogDescription>
              {!paymentData ? 'Select your preferred cryptocurrency' : 'Send payment to the address below'}
            </DialogDescription>
          </DialogHeader>

          {!paymentData ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Select Currency</label>
                <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {POPULAR_CURRENCIES.map((currency) => (
                      <SelectItem key={currency.value} value={currency.value}>
                        {currency.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleCreateInvoice}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Invoice...
                  </>
                ) : (
                  'Continue'
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Status */}
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                {getStatusIcon()}
                <span className="text-sm font-medium">{getStatusText()}</span>
              </div>

              {/* Payment Details */}
              {(paymentStatus === 'waiting' || paymentStatus === 'confirming') && (
                <>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Payment Amount</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">
                        {paymentData.payAmount} {paymentData.payCurrency.toUpperCase()}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        ≈ $79 USD
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Payment Address</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-muted p-2 rounded flex-1 break-all">
                          {paymentData.payAddress}
                        </code>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => copyToClipboard(paymentData.payAddress)}
                        >
                          {copied ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.open(paymentData.invoiceUrl, '_blank')}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open in NOWPayments
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Send the exact amount to the address above. Payment will be confirmed automatically.
                  </p>
                </>
              )}

              {paymentStatus === 'finished' && (
                <div className="text-center space-y-2">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
                  <p className="text-sm text-muted-foreground">
                    Redirecting to your dashboard...
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
