import { create } from 'zustand';

export const useProductStore = create((set) => ({
  products: [],
  
  fetchProducts: async (toast) => {
    try {
      const res = await fetch('/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      set({ products: data || [] });
    } catch (err) {
      console.log(err);
      //console.error('Error fetching products:', err);
    }
  },

  addProduct: async (newProduct, toast) => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in name, price, and category.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return { success: false };
    }
    
    try {
      const res = await fetch('/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
      if (!res.ok) throw new Error('Failed to create product');
      const data = await res.json();
      set((state) => ({ products: [...state.products, data.product] }));
      toast({
        title: 'Product Created',
        description: `${data.product.name} was added successfully.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      return { success: true };
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Something went wrong.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return { success: false };
    }
  },

  deleteProduct: async (id, toast) => {
    try {
      const res = await fetch(`/products/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete product');
      set((state) => ({
        products: state.products.filter((product) => (product._id || product.id) !== id),
      }));
      toast({
        title: 'Product Deleted',
        description: 'The product was deleted successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      return { success: true };
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to delete product.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return { success: false };
    }
  },

  updateProduct: async (id, updatedData, toast) => {
    try {
      const res = await fetch(`/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) throw new Error('Failed to update product');
      const data = await res.json();
      set((state) => ({
        products: state.products.map((product) =>
          (product._id || product.id) === id ? data.product : product
        ),
      }));
      toast({
        title: 'Product Updated',
        description: 'The product was updated successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      return { success: true };
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to update product.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return { success: false };
    }
  },
}));
