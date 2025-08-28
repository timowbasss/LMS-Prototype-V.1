import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Coins, Gift, ShoppingBag, Star } from 'lucide-react';

interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: string;
  available: boolean;
}

interface UserProfile {
  ivy_coins: number;
}

export default function IvyShop() {
  const { user } = useAuth();
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [userCoins, setUserCoins] = useState(0);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchShopItems();
      fetchUserCoins();
    }
  }, [user]);

  const fetchShopItems = async () => {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*')
        .eq('available', true)
        .order('cost');

      if (error) throw error;
      setShopItems(data || []);
    } catch (error) {
      console.error('Error fetching shop items:', error);
      toast.error('Failed to load shop items');
    }
  };

  const fetchUserCoins = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('ivy_coins')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setUserCoins(data?.ivy_coins || 0);
    } catch (error) {
      console.error('Error fetching user coins:', error);
    } finally {
      setLoading(false);
    }
  };

  const purchaseItem = async (item: ShopItem) => {
    if (!user || userCoins < item.cost) {
      toast.error('Insufficient Ivy Coins');
      return;
    }

    setPurchasing(item.id);
    try {
      // Create purchase record
      const { error: purchaseError } = await supabase
        .from('user_purchases')
        .insert({
          user_id: user.id,
          shop_item_id: item.id,
          coins_spent: item.cost
        });

      if (purchaseError) throw purchaseError;

      // Update user coins
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ ivy_coins: userCoins - item.cost })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      setUserCoins(userCoins - item.cost);
      toast.success(`Successfully purchased ${item.name}!`);
    } catch (error) {
      console.error('Error purchasing item:', error);
      toast.error('Failed to purchase item');
    } finally {
      setPurchasing(null);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'giftcard':
        return <Gift className="h-5 w-5" />;
      case 'pass':
        return <Star className="h-5 w-5" />;
      default:
        return <ShoppingBag className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'giftcard':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pass':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'academic':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ivy Shop</h1>
          <p className="text-muted-foreground">
            Redeem your Ivy Coins for amazing rewards
          </p>
        </div>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Coins className="h-6 w-6 text-yellow-500" />
            <div>
              <p className="text-sm text-muted-foreground">Your Balance</p>
              <p className="text-2xl font-bold text-yellow-600">{userCoins}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shopItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{item.name}</CardTitle>
                {getCategoryIcon(item.category)}
              </div>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge className={getCategoryColor(item.category)}>
                  {item.category}
                </Badge>
                <div className="flex items-center space-x-1">
                  <Coins className="h-4 w-4 text-yellow-500" />
                  <span className="font-bold text-lg">{item.cost}</span>
                </div>
              </div>
              <Button
                onClick={() => purchaseItem(item)}
                disabled={userCoins < item.cost || purchasing === item.id}
                className="w-full"
              >
                {purchasing === item.id ? (
                  'Purchasing...'
                ) : userCoins < item.cost ? (
                  'Insufficient Coins'
                ) : (
                  'Purchase'
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {shopItems.length === 0 && (
        <div className="text-center py-12">
          <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No items available</h3>
          <p className="text-muted-foreground">Check back later for new rewards!</p>
        </div>
      )}
    </div>
  );
}