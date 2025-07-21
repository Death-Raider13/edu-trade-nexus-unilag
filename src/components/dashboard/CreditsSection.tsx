
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, CreditCard, Plus, ArrowUpDown } from 'lucide-react';

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

export const CreditsSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [credits, setCredits] = useState<Credits | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

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

  const buyCredits = async (amount: number, price: number) => {
    try {
      const { error } = await supabase
        .from('credit_transactions')
        .insert({
          user_id: user?.id,
          amount,
          transaction_type: 'purchase',
          description: `Purchased ${amount} credits for ₦${price}`,
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Successfully purchased ${amount} credits`,
      });

      fetchCredits();
      fetchTransactions();
    } catch (error) {
      console.error('Error buying credits:', error);
      toast({
        title: 'Error',
        description: 'Failed to purchase credits',
        variant: 'destructive',
      });
    }
  };

  const creditPackages = [
    { amount: 500, price: 5000 },
    { amount: 1000, price: 9500 },
    { amount: 2500, price: 22500 },
    { amount: 5000, price: 42500 },
  ];

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Credits Balance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">
              {credits?.balance || 0}
            </div>
            <p className="text-muted-foreground">Available Credits</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Buy Credits</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {creditPackages.map((pkg, index) => (
              <Card key={index} className="border-primary/20">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary mb-2">
                    {pkg.amount}
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">Credits</div>
                  <div className="text-lg font-semibold mb-4">
                    ₦{pkg.price.toLocaleString()}
                  </div>
                  <Button
                    onClick={() => buyCredits(pkg.amount, pkg.price)}
                    className="w-full"
                  >
                    Buy Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ArrowUpDown className="h-5 w-5" />
            <span>Recent Transactions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
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
  );
};
