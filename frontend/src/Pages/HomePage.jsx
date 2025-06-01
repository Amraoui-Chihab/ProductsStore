import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  SimpleGrid,
  Image,
  Text,
  Heading,
  VStack,
  Badge,
  Container,
  Spinner,
  Center,
  useColorModeValue,
  IconButton,
  HStack,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Input,
  useToast,
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { useProductStore } from '../store/Product';

const HomePage = () => {
  const { products, fetchProducts, deleteProduct, updateProduct } = useProductStore();
  const [loading, setLoading] = useState(true);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const cancelRef = useRef();
  const toast = useToast();

  const bg = useColorModeValue('white', 'gray.700');
  const hoverBg = useColorModeValue('gray.100', 'gray.600');

  // For update form state
  const [updateForm, setUpdateForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    countInStock: 0,
  });

  // New state for image preview and uploaded file
  const [imagePreview, setImagePreview] = useState('');
  const [uploadedImageFile, setUploadedImageFile] = useState(null);

  useEffect(() => {
    async function load() {
      await fetchProducts();
      setLoading(false);
    }
    load();
  }, [fetchProducts]);

  // Open delete dialog
  const onDeleteClick = (product) => {
    setSelectedProduct(product);
    setIsDeleteOpen(true);
  };

  // Confirm delete
  const onConfirmDelete = async () => {
    if (!selectedProduct) return;
    try {
      await deleteProduct(selectedProduct._id || selectedProduct.id, toast);
      setIsDeleteOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      toast({
        title: 'Failed to delete product',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Open update modal and set form data + image preview reset
  const onUpdateClick = (product) => {
    setSelectedProduct(product);
    setUpdateForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      category: product.category,
      image: product.image,
      countInStock: product.countInStock || 0,
    });
    setImagePreview(product.image); // show current image as preview
    setUploadedImageFile(null); // reset uploaded file
    setIsUpdateOpen(true);
  };

  // Handle update form change
  const handleUpdateChange = (e) => {
    const { name, value } = e.target;

    setUpdateForm((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'countInStock' ? Number(value) : value,
    }));
  };

  // Handle new image upload change
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // show preview
    }
  };

  // Submit update
  const onSubmitUpdate = async () => {
    if (!selectedProduct) return;

    let updatedData = { ...updateForm };

    if (uploadedImageFile) {
      // Convert to base64 string before sending
      const toBase64 = (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });

      try {
        updatedData.image = await toBase64(uploadedImageFile);
      } catch (error) {
        toast({
          title: 'Failed to read image file',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
    } else {
      updatedData.image = updateForm.image;
    }

    try {
      await updateProduct(selectedProduct._id || selectedProduct.id, updatedData, toast);
      setIsUpdateOpen(false);
      setSelectedProduct(null);
      setImagePreview('');
      setUploadedImageFile(null);
    } catch (error) {
      toast({
        title: 'Failed to update product',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Center py={20}>
        <Spinner size="xl" />
      </Center>
    );
  }

  if (products.length === 0) {
    return (
      <Container maxW="container.md" py={10}>
        <Text textAlign="center" fontSize="xl" color="gray.500">
          No products found.
        </Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={10}>
      <Heading mb={6} textAlign="center">
        Our Products
      </Heading>

      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
        {products.map(({ _id, id, name, image, price, category, description, countInStock }) => (
          <Box
            key={_id || id}
            bg={bg}
            borderRadius="md"
            shadow="md"
            overflow="hidden"
            cursor="pointer"
            transition="all 0.3s"
            _hover={{ transform: 'scale(1.05)', bg: hoverBg }}
            position="relative"
          >
            <Image src={image} alt={name} boxSize="250px" objectFit="cover" w="100%" loading="lazy" />
            <VStack p={4} spacing={2} align="start">
              <Heading size="md">{name}</Heading>
              <Badge colorScheme="purple" px={2} py={1} borderRadius="md">
                {category}
              </Badge>
              <Text fontWeight="bold" fontSize="lg" color="green.600">
                ${price.toFixed(2)}
              </Text>

              <HStack spacing={4} pt={2}>
                <IconButton
                  aria-label="Delete product"
                  icon={<DeleteIcon />}
                  colorScheme="red"
                  onClick={() => onDeleteClick({ _id, id, name, image, price, category })}
                />
                <IconButton
                  aria-label="Update product"
                  icon={<EditIcon />}
                  colorScheme="blue"
                  onClick={() =>
                    onUpdateClick({ _id, id, name, image, price, category, description, countInStock })
                  }
                />
              </HStack>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>

      {/* Delete Confirmation */}
      <AlertDialog isOpen={isDeleteOpen} leastDestructiveRef={cancelRef} onClose={() => setIsDeleteOpen(false)}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Product
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete{' '}
              <Text as="span" fontWeight="bold">
                {selectedProduct?.name}
              </Text>
              ? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsDeleteOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={onConfirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Update Modal */}
      <Modal isOpen={isUpdateOpen} onClose={() => setIsUpdateOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {/* Show current or preview image */}
            {imagePreview && (
              <Box mb={3} textAlign="center">
                <Image
                  src={imagePreview}
                  alt="Product Image Preview"
                  boxSize="150px"
                  objectFit="cover"
                  mx="auto"
                  borderRadius="md"
                  mb={2}
                />
              </Box>
            )}

            {/* File input for uploading new image */}
            <Input type="file" accept="image/*" onChange={handleImageUpload} mb={3} />

            <Input placeholder="Name" name="name" value={updateForm.name} onChange={handleUpdateChange} mb={3} />
            <Input
              placeholder="Description"
              name="description"
              value={updateForm.description}
              onChange={handleUpdateChange}
              mb={3}
            />
            <Input
              placeholder="Price"
              type="number"
              name="price"
              value={updateForm.price}
              onChange={handleUpdateChange}
              mb={3}
            />
            <Input
              placeholder="Category"
              name="category"
              value={updateForm.category}
              onChange={handleUpdateChange}
              mb={3}
            />
            <Input
              placeholder="Count in Stock"
              type="number"
              name="countInStock"
              value={updateForm.countInStock}
              onChange={handleUpdateChange}
              mb={3}
            />
          </ModalBody>

          <ModalFooter>
            <Button onClick={() => setIsUpdateOpen(false)} mr={3}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={onSubmitUpdate}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default HomePage;
