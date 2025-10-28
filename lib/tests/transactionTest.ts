import { db, Product, Transaction } from '../db';
import { TransactionService } from '../services/transactionService';
import { PaymentService } from '../services/paymentService';
import { v7 as uuidv7 } from 'uuid';

// Initialize database connection and run tests
(async () => {
  try {
    await db.open();
    console.log('Database opened successfully');

    // Run tests
    const result = await TransactionTest.runAllTests();
    console.log('Test result:', result);
  } catch (err) {
    console.error('Failed to open db:', err);
  }
})();

export class TransactionTest {
  // Test transaction processing with stock deduction
  static async testTransactionWithStockDeduction(): Promise<boolean> {
    try {
      console.log('Starting transaction with stock deduction test...');
      
      // Create a test product
      const testProduct: Product = {
        id: uuidv7(),
        name: 'Test Product',
        type: 'finish_goods',
        categoryId: 'test-category',
        sku: 'TEST001',
        price: 10000,
        cost: 8000,
        image: null,
        monitorStock: true,
        minStock: 5,
        currentStock: 100,
        calculatedStock: null,
        uom: {
          base: 'pcs',
          conversions: []
        },
        recipe: null,
        createdBy: 'test-user',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      };

      // Add the product to the database
      await db.products.add(testProduct);
      console.log('Test product created');

      // Create a transaction with the test product
      const transactionData: Omit<Transaction, 'id' | 'transactionNumber' | 'createdAt' | 'updatedAt' | 'deletedAt'> = {
        customerId: null,
        items: [{
          productId: testProduct.id,
          name: testProduct.name,
          qty: 5,
          price: testProduct.price,
          subtotal: testProduct.price * 5
        }],
        subtotal: testProduct.price * 5,
        discount: { type: 'nominal', value: 0, amount: 0 },
        tax: { enabled: false, rate: 0, amount: 0 },
        total: testProduct.price * 5,
        payments: [],
        change: 0,
        status: 'paid',
        savedAt: null,
        paidAt: null,
        createdBy: 'test-user'
      };

      // Create the transaction
      const transaction = await TransactionService.create(transactionData);
      console.log('Transaction created:', transaction.id);

      // Process payment
      const paymentResult = await PaymentService.processPayment(transaction.id, {
        method: 'cash',
        amount: transaction.total
      });

      if (!paymentResult.success) {
        throw new Error(`Payment processing failed: ${paymentResult.message}`);
      }

      console.log('Payment processed successfully');

      // Check if stock was deducted
      const updatedProduct = await db.products.get(testProduct.id);
      if (!updatedProduct) {
        throw new Error('Test product not found after transaction');
      }

      const expectedStock = testProduct.currentStock - 5;
      if (updatedProduct.currentStock !== expectedStock) {
        throw new Error(`Stock deduction failed. Expected: ${expectedStock}, Actual: ${updatedProduct.currentStock}`);
      }

      console.log(`Stock deduction successful. Original: ${testProduct.currentStock}, After transaction: ${updatedProduct.currentStock}`);

      // Clean up - delete the test product
      await db.products.delete(testProduct.id);
      console.log('Test product cleaned up');

      console.log('Transaction with stock deduction test completed successfully!');
      return true;
    } catch (error) {
      console.error('Transaction with stock deduction test failed:', error);
      return false;
    }
  }

  // Test saved order functionality
  static async testSavedOrder(): Promise<boolean> {
    try {
      console.log('Starting saved order test...');
      
      // Create a test product
      const testProduct: Product = {
        id: uuidv7(),
        name: 'Test Saved Product',
        type: 'finish_goods',
        categoryId: 'test-category',
        sku: 'SAVETEST001',
        price: 15000,
        cost: 12000,
        image: null,
        monitorStock: true,
        minStock: 5,
        currentStock: 50,
        calculatedStock: null,
        uom: {
          base: 'pcs',
          conversions: []
        },
        recipe: null,
        createdBy: 'test-user',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      };

      // Add the product to the database
      await db.products.add(testProduct);
      console.log('Test product for saved order created');

      // Create a saved transaction
      const transactionData: Omit<Transaction, 'id' | 'transactionNumber' | 'createdAt' | 'updatedAt' | 'deletedAt'> = {
        customerId: null,
        items: [{
          productId: testProduct.id,
          name: testProduct.name,
          qty: 3,
          price: testProduct.price,
          subtotal: testProduct.price * 3
        }],
        subtotal: testProduct.price * 3,
        discount: { type: 'nominal', value: 0, amount: 0 },
        tax: { enabled: false, rate: 0, amount: 0 },
        total: testProduct.price * 3,
        payments: [],
        change: 0,
        status: 'saved',
        savedAt: new Date(),
        paidAt: null,
        createdBy: 'test-user'
      };

      // Save the transaction
      const savedTransaction = await TransactionService.saveTransaction(transactionData);
      console.log('Saved transaction created:', savedTransaction.id);

      // Verify the saved transaction exists
      const retrievedTransaction = await TransactionService.getById(savedTransaction.id);
      if (!retrievedTransaction || retrievedTransaction.status !== 'saved') {
        throw new Error('Saved transaction not found or status is incorrect');
      }

      console.log('Saved transaction verified successfully');

      // Clean up - delete the saved transaction and test product
      await db.transactions.delete(savedTransaction.id);
      await db.products.delete(testProduct.id);
      console.log('Saved order test cleanup completed');

      console.log('Saved order test completed successfully!');
      return true;
    } catch (error) {
      console.error('Saved order test failed:', error);
      return false;
    }
  }

 // Run all tests
  static async runAllTests(): Promise<boolean> {
    console.log('Running all transaction tests...\n');

    const test1Result = await this.testTransactionWithStockDeduction();
    console.log(`Stock deduction test: ${test1Result ? 'PASSED' : 'FAILED'}\n`);

    const test2Result = await this.testSavedOrder();
    console.log(`Saved order test: ${test2Result ? 'PASSED' : 'FAILED'}\n`);

    const allTestsPassed = test1Result && test2Result;
    console.log(`All tests completed. Overall result: ${allTestsPassed ? 'PASSED' : 'FAILED'}`);
    
    return allTestsPassed;
  }
}