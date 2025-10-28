import { create } from 'zustand';
import { db, Transaction, Customer, Product } from '../db';
import { TransactionService } from '../services/transactionService';
import { PaymentService } from '../services/paymentService';
import { SavedOrderService } from '../services/savedOrderService';
import { CashierShiftService } from '../services/cashierShiftService';
import { useShiftStore } from './shiftStore';

interface CartItem {
  productId: string;
  name: string;
 price: number;
  qty: number;
  subtotal: number;
}

interface CashierState {
  cart: CartItem[];
  savedOrders: Transaction[];
  selectedCustomer: Customer | null;
  activeTransaction: Transaction | null;
  
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  saveOrder: (notes?: string) => Promise<void>;
  loadSavedOrder: (orderId: string) => Promise<void>;
  selectCustomer: (customer: Customer | null) => void;
  calculateSubtotal: () => number;
  calculateTotal: () => number;
  calculateTax: () => number;
  calculateDiscount: () => number;
  checkout: (payment: { method: string; amount: number }) => Promise<void>;
  initializeCashier: () => Promise<void>;
}

export const useCashierStore = create<CashierState>((set, get) => ({
  cart: [],
  savedOrders: [],
  selectedCustomer: null,
  activeTransaction: null,
  
  addToCart: (product) => {
    const { cart } = get();
    const existingItem = cart.find(item => item.productId === product.id);
    
    if (existingItem) {
      // Update quantity if item already exists
      const updatedCart = cart.map(item =>
        item.productId === product.id
          ? { 
              ...item, 
              qty: item.qty + 1, 
              subtotal: (item.qty + 1) * item.price 
            }
          : item
      );
      set({ cart: updatedCart });
    } else {
      // Add new item to cart
      const newItem: CartItem = {
        productId: product.id,
        name: product.name,
        price: product.price,
        qty: 1,
        subtotal: product.price,
      };
      set({ cart: [...cart, newItem] });
    }
  },
  
  removeFromCart: (productId) => {
    const { cart } = get();
    set({ 
      cart: cart.filter(item => item.productId !== productId) 
    });
  },
  
  updateQuantity: (productId, qty) => {
    if (qty <= 0) {
      get().removeFromCart(productId);
      return;
    }
    
    const { cart } = get();
    const updatedCart = cart.map(item => {
      if (item.productId === productId) {
        return {
          ...item,
          qty,
          subtotal: qty * item.price
        };
      }
      return item;
    });
    
    set({ cart: updatedCart });
  },
  
  clearCart: () => {
    set({ cart: [] });
  },
  
 saveOrder: async (notes) => {
   const { cart, selectedCustomer } = get();
   if (cart.length === 0) return;

   // Calculate totals
   const subtotal = get().calculateSubtotal();
   const tax = get().calculateTax();
   const discount = get().calculateDiscount();
   const total = subtotal + tax - discount;

   // Create transaction object using the new service
           const { currentShiftId } = useShiftStore.getState();
           const transactionData: Omit<Transaction, 'id' | 'transactionNumber' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'paidAt'> = {
             customerId: selectedCustomer?.id || null,
             shiftId: currentShiftId || null, // Include the current shift ID if available
             items: cart.map(item => ({
               productId: item.productId,
               name: item.name,
               qty: item.qty,
               price: item.price,
               subtotal: item.subtotal
             })),
             subtotal,
             discount: { type: 'nominal', value: 0, amount: discount },
             tax: { enabled: true, rate: 0, amount: tax },
             total,
             payments: [],
             change: 0,
             status: 'saved',
             savedAt: new Date(),
             createdBy: 'current-user-id', // TODO: Get from authStore
           };

   try {
     // Use the new service to save the transaction
     const savedTransaction = await SavedOrderService.saveOrder(transactionData);

     // Add to saved orders
     set(state => ({
       savedOrders: [...state.savedOrders, savedTransaction],
       cart: [],
       selectedCustomer: null
     }));
   } catch (error) {
     console.error('Failed to save order:', error);
     throw error;
   }
 },
  
 loadSavedOrder: async (orderId) => {
    const savedOrder = await SavedOrderService.getSavedOrderById(orderId);
    
    if (savedOrder) {
      set({
        cart: savedOrder.items.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          qty: item.qty,
          subtotal: item.subtotal,
        })),
        selectedCustomer: savedOrder.customerId ? { id: savedOrder.customerId } as Customer : null,
      });
    }
  },
  
  selectCustomer: (customer) => {
    set({ selectedCustomer: customer });
  },
  
 calculateSubtotal: () => {
    const { cart } = get();
    return cart.reduce((sum, item) => sum + item.subtotal, 0);
  },
  
  calculateTax: () => {
    // For now, using a simple 10% tax - this would be configurable in real app
    const subtotal = get().calculateSubtotal();
    return subtotal * 0.1; // 10% tax
  },
  
 calculateDiscount: () => {
    // For now, no discount - this would be configurable in real app
    return 0;
  },
  
  calculateTotal: () => {
    const subtotal = get().calculateSubtotal();
    const tax = get().calculateTax();
    const discount = get().calculateDiscount();
    return subtotal + tax - discount;
  },
  
  checkout: async (payment) => {
    const { cart, selectedCustomer } = get();
    if (cart.length === 0) return;
    
    // Calculate totals
    const subtotal = get().calculateSubtotal();
    const tax = get().calculateTax();
    const discount = get().calculateDiscount();
    const total = subtotal + tax - discount;
    
    // Map payment method to allowed types
    const paymentMethod: 'cash' | 'ewallet' | 'qris' =
      payment.method === 'cash' ? 'cash' :
      payment.method === 'ewallet' ? 'ewallet' :
      'qris';
    
    // Create transaction object using the new service
         const { currentShiftId } = useShiftStore.getState();
         const transactionData: Omit<Transaction, 'id' | 'transactionNumber' | 'createdAt' | 'updatedAt' | 'deletedAt'> = {
           customerId: selectedCustomer?.id || null,
           shiftId: currentShiftId || null, // Include the current shift ID if available
           items: cart.map(item => ({
             productId: item.productId,
             name: item.name,
             qty: item.qty,
             price: item.price,
             subtotal: item.subtotal
           })),
           subtotal,
           discount: { type: 'nominal', value: 0, amount: discount },
           tax: { enabled: true, rate: 0, amount: tax },
           total,
           payments: [],
           change: 0, // Will be calculated by the service
           status: 'paid',
           savedAt: null,
           paidAt: null, // Need to include this
           createdBy: 'current-user-id', // TODO: Get from authStore
         };
    
    try {
      // Create the transaction first
      const newTransaction = await TransactionService.create(transactionData);

      // Process the payment using the payment service
      const paymentResult = await PaymentService.processPayment(newTransaction.id, {
        method: paymentMethod,
        amount: payment.amount
      });

      if (!paymentResult.success) {
        throw new Error(paymentResult.message);
      }

      // Clear cart
      set({
        cart: [],
        selectedCustomer: null
      });
    } catch (error) {
      console.error('Failed to checkout:', error);
      // TODO: Show user-friendly error message using uiStore
      throw error;
    }
  },
  
  initializeCashier: async () => {
    // Load saved orders from database
    const savedTransactions = await db.transactions.where('status').equals('saved').toArray();
    set({ savedOrders: savedTransactions });
  }
}));