import {
  Container,
  VStack,
  Heading,
  Box,
  useColorModeValue,
  Input,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  NumberInput,
  NumberInputField,
  Select,
  Image,
  useToast,
} from '@chakra-ui/react';

import React, { useState } from 'react';
import {useProductStore} from '../store/Product';

const CreateProduct = () => {
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    image: null,
    
    category: '',
    countInStock: 0,
  });

  const toast = useToast();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({
          ...newProduct,
          image: reader.result, // ✅ base64 string
        });
      };
      reader.readAsDataURL(file); // 🔥 this reads it as base64 string
    }
  };
  


  const {addProduct,products} = useProductStore();
  const handleAddProduct = async () => {
    
   const success=  await addProduct(newProduct, toast);
   
   if(success.success)
   {
    
    setNewProduct({
      name: '',
      description: '',
      price: 0,
      image: null,
      category: '',
      countInStock: 0,
    });

    
   }
  
  };
  
  

  return (
    <Container maxW={'container.sm'}>
      <VStack spacing={8}>
        <Heading as={'h1'} size={'2xl'} textAlign={'center'} mb={8}>
          Create New Product
        </Heading>

        <Box w={'full'} bg={useColorModeValue('white', 'gray.800')} p={6} rounded={'lg'} shadow={'md'}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                placeholder="Enter Product Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                placeholder="Enter Product Description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Price</FormLabel>
              <NumberInput
                precision={2}
                step={0.01}
                value={newProduct.price}
                onChange={(val) => setNewProduct({ ...newProduct, price: parseFloat(val) || 0 })}
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel>Upload Image</FormLabel>
              <Input type="file" accept="image/*" onChange={handleImageChange} />
              {newProduct.imagePreview && (
                <Image src={newProduct.imagePreview} alt="Preview" boxSize="100px" mt={2} />
              )}
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Category</FormLabel>
              <Select
                placeholder="Select category"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              >
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Books">Books</option>
                <option value="Home">Home</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Count In Stock</FormLabel>
              <NumberInput
                min={0}
                value={newProduct.countInStock}
                onChange={(val) => setNewProduct({ ...newProduct, countInStock: parseInt(val) || 0 })}
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>

            <Button onClick={handleAddProduct} colorScheme="blue" w={'full'}>
              Add Product
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default CreateProduct;
