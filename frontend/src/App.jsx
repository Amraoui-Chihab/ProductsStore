import { Box, Button, HStack, useColorMode, useColorModeValue } from '@chakra-ui/react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './Pages/HomePage'
import CreateProduct from './Pages/CreateProduct'
import Navbar from './Components/Navbar'
function App() {
  return (
    <Box minH={"100vh"} bg={useColorModeValue("gray.100","gray.900")}>
      

      <Navbar />

      
      <Routes>
        <Route path='/' element={ <HomePage />} />
        <Route path='/CreateProduct' element={ <CreateProduct />} />
      </Routes>
      
      
    </Box>

  )
}

export default App
