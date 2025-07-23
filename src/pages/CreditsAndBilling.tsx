
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, CreditCard, Plus, ArrowUpDown, Shield, Check } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Credits {
  id: string;
  balance: number;
}

interface Transaction {
  id: string;
  amount: number;
  transaction_type: string;
  description: string;
  created_at: string;
}

const CreditsAndBilling = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [credits, setCredits] = useState<Credits | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolder: '',
    bank: '',
    amount: 0
  });

  useEffect(() => {
    if (user) {
      fetchCredits();
      fetchTransactions();
    }
  }, [user]);

  const fetchCredits = async () => {
    try {
      const { data, error } = await supabase
        .from('credits')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setCredits(data);
    } catch (error) {
      console.error('Error fetching credits:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('credit_transactions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const creditPackages = [
    { 
      amount: 100, 
      price: 1000, 
      title: 'Starter Pack',
      description: 'Perfect for beginners',
      popular: false
    },
    { 
      amount: 500, 
      price: 4500, 
      title: 'Standard Pack',
      description: 'Most popular choice',
      popular: true
    },
    { 
      amount: 1000, 
      price: 8500, 
      title: 'Premium Pack',
      description: 'Best value for money',
      popular: false
    },
    { 
      amount: 2500, 
      price: 20000, 
      title: 'Enterprise Pack',
      description: 'For heavy users',
      popular: false
    }
  ];

  const nigerianBanks = [
    'Access Bank', 'Fidelity Bank', 'First Bank of Nigeria', 'Guaranty Trust Bank',
    'Keystone Bank', 'Polaris Bank', 'Stanbic IBTC Bank', 'Sterling Bank',
    'Union Bank of Nigeria', 'United Bank for Africa', 'Unity Bank', 'Wema Bank',
    'Zenith Bank', 'Citibank Nigeria', 'Ecobank Nigeria', 'Heritage Bank'
  ];

  const handlePayment = async () => {
    if (!selectedPlan || !paymentDetails.cardNumber || !paymentDetails.bank) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const { error } = await supabase
        .from('credit_transactions')
        .insert({
          user_id: user?.id,
          amount: selectedPlan.amount,
          transaction_type: 'purchase',
          description: `Purchased ${selectedPlan.amount} credits for ₦${selectedPlan.price}`,
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Successfully purchased ${selectedPlan.amount} credits`,
      });

      setShowPaymentForm(false);
      setSelectedPlan(null);
      setPaymentDetails({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardHolder: '',
        bank: '',
        amount: 0
      });
      
      fetchCredits();
      fetchTransactions();
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: 'Error',
        description: 'Failed to process payment',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Credits & Billing</h1>
          <p className="text-muted-foreground">Manage your credits and billing information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Balance */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <span>Current Balance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {credits?.balance || 0}
                </div>
                <p className="text-muted-foreground">Available Credits</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5 text-primary" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <Button 
                className="w-full" 
                onClick={() => setShowPaymentForm(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Buy Credits
              </Button>
              <Button variant="outline" className="w-full">
                <Shield className="h-4 w-4 mr-2" />
                Billing History
              </Button>
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Account Type</p>
                <Badge variant="secondary">Student Account</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Credit Packages */}
        <Card className="border-0 shadow-lg mt-8">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
            <CardTitle>Credit Packages</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {creditPackages.map((pkg, index) => (
                <Card key={index} className={`relative border-2 ${pkg.popular ? 'border-primary' : 'border-muted'} hover:border-primary/50 transition-colors`}>
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-white">Most Popular</Badge>
                    </div>
                  )}
                  <CardContent className="p-6 text-center">
                    <h3 className="font-bold text-lg mb-2">{pkg.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{pkg.description}</p>
                    <div className="text-3xl font-bold text-primary mb-2">
                      {pkg.amount}
                    </div>
                    <div className="text-sm text-muted-foreground mb-4">Credits</div>
                    <div className="text-xl font-semibold mb-4">
                      ₦{pkg.price.toLocaleString()}
                    </div>
                    <Button
                      onClick={() => {
                        setSelectedPlan(pkg);
                        setShowPaymentForm(true);
                      }}
                      className="w-full"
                      variant={pkg.popular ? "default" : "outline"}
                    >
                      Select Plan
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Form Modal */}
        {showPaymentForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle>Complete Payment</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Purchasing {selectedPlan?.amount} credits for ₦{selectedPlan?.price.toLocaleString()}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bank">Select Bank</Label>
                  <Select value={paymentDetails.bank} onValueChange={(value) => setPaymentDetails(prev => ({ ...prev, bank: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your bank" />
                    </SelectTrigger>
                    <SelectContent>
                      {nigerianBanks.map((bank) => (
                        <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardHolder">Card Holder Name</Label>
                  <Input
                    id="cardHolder"
                    value={paymentDetails.cardHolder}
                    onChange={(e) => setPaymentDetails(prev => ({ ...prev, cardHolder: e.target.value }))}
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    value={paymentDetails.cardNumber}
                    onChange={(e) => setPaymentDetails(prev => ({ ...prev, cardNumber: e.target.value }))}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      value={paymentDetails.expiryDate}
                      onChange={(e) => setPaymentDetails(prev => ({ ...prev, expiryDate: e.target.value }))}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      value={paymentDetails.cvv}
                      onChange={(e) => setPaymentDetails(prev => ({ ...prev, cvv: e.target.value }))}
                      placeholder="123"
                      maxLength={3}
                    />
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <Button onClick={handlePayment} className="flex-1">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pay Now
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowPaymentForm(false);
                      setSelectedPlan(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recent Transactions */}
        <Card className="border-0 shadow-lg mt-8">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
            <CardTitle className="flex items-center space-x-2">
              <ArrowUpDown className="h-5 w-5 text-primary" />
              <span>Recent Transactions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                >
                  <div>
                    <div className="font-medium">{transaction.description}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`font-medium ${
                        transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {transaction.amount > 0 ? '+' : ''}
                      {transaction.amount}
                    </span>
                    <Badge variant="outline">{transaction.transaction_type}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreditsAndBilling;
