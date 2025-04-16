interface Window {
    ApplePaySession?: {
      canMakePayments: () => boolean
      supportsVersion: (version: number) => boolean
      // Add other ApplePaySession methods as needed
    }
  }
  
  declare const ApplePaySession: {
    canMakePayments: () => boolean
    supportsVersion: (version: number) => boolean
    new(paymentRequest: ApplePayJS.ApplePayPaymentRequest): ApplePaySession
  } | undefined


  /*case 'paypal':
            result = await stripe.confirmPayPalPayment(clientSecret, {
              return_url: `${window.location.origin}/checkout/success?order_id=${orderId}`,
            })case 'paypal':
            return (
              <div className="space-y-4">
                <PaymentElement
                  options={{
                    paymentMethodOrder: ['paypal'],
                    fields: {
                      billingDetails: 'never'
                    }
                  }}
                />
                <p className="text-sm text-gray-500">
                  You'll be redirected to PayPal to complete your payment
                </p>
              </div>
            )

            */