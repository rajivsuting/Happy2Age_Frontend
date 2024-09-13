// import {
//     IconButton,
//     Avatar,
//     Box,
//     CloseButton,
//     Flex,
//     HStack,
//     VStack,
//     Icon,
//     useColorModeValue,
//     Text,
//     Drawer,
//     DrawerContent,
//     useDisclosure,
//     Menu,
//     MenuButton,
//     MenuDivider,
//     MenuItem,
//     MenuList,
//     Button,
//     Collapse,
//   } from "@chakra-ui/react";
//   import {
//     FiHome,

//     FiMenu,
//     FiBell,
//     FiChevronDown,
//     FiUserCheck,
//     FiPackage,
//     FiLayers,
//     FiClipboard,
//     FiTruck,
//     FiUsers,
//     FiMinimize2,
//     FiMaximize2,
//   } from "react-icons/fi";
//   import { FaUsers, FaRegListAlt } from "react-icons/fa";
//   import { HiClipboardDocumentList } from "react-icons/hi2";
//   import { SiHomeassistantcommunitystore } from "react-icons/si";
//   import { IoIosPeople } from "react-icons/io";
//   import { Link, useNavigate } from "react-router-dom";
//   import { useDispatch, useSelector } from "react-redux";
//   import { crud } from "../../redux/crud/actions";
//   import { logout } from "../../redux/auth/actions";
//   import OrderModal from "../createOrderModal/CreateOrderModal.jsx";
//   import { useLayoutEffect, useState } from "react";
//   import { selectAuth } from "../../redux/auth/selectors";
//   import Loading from "../loading";
  
//   const LinkItems = [
//     {
//       name: "Dashboard",
//       icon: FiHome,
//       href: "/dashboard",
//     },
//     {
//       name: "Master",
//       icon: FiUserCheck,
//       dropdownItems: [
//         { name: "Category", icon: FiPackage, href: "/category" },
//         {
//           name: "Products",
//           icon: FiLayers,
//           href: "/products",
//         },
//       ],
//     },
//     {
//       name: "Leads",
//       icon: FiClipboard,
//       href: "/leads",
//     },
//     {
//       name: "Orders",
//       icon: FiTruck,
//       dropdownItems: [
//         {
//           name: "Order List",
//           icon: HiClipboardDocumentList,
//           href: "/order-list",
//         },
//       ],
//     },
//     {
//       name: "Clients",
//       icon: FiUsers,
//       dropdownItems: [{ name: "User List", icon: FaUsers, href: "/user-list" }],
//     },
//     {
//       name: "Company",
//       icon: SiHomeassistantcommunitystore,
//       href: "/company-dashboard",
//     },
//     {
//       name: "People",
//       icon: IoIosPeople,
//       href: "/people-dashboard",
//     },
  
//   ];
  
//   const SidebarContent = ({ onClose, ...rest }) => {
//     return (
//       <Box
//         transition="3s ease"
//         bg={useColorModeValue("white", "gray.900")}
//         borderRight="1px"
//         borderRightColor={useColorModeValue("gray.200", "gray.700")}
//         w={{ base: "full", md: 60 }}
//         pos="fixed"
//         h="full"
//         {...rest}>
//         <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
//           <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
//             M2HSE
//           </Text>
//           <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
//         </Flex>
//         {LinkItems.map((link, index) => (
//           <Box key={index}>
//             <NavItem
//               icon={link.icon}
//               children={link.name}
//               href={link.href}
//               dropdownItems={link.dropdownItems}></NavItem>
//           </Box>
//         ))}
//       </Box>
//     );
//   };
  
//   const NavItem = ({ icon, children, dropdownItems, href, ...rest }) => {
//     const { isOpen, onToggle } = useDisclosure();
  
//     return (
//       <Box
//         as="div"
//         style={{ textDecoration: "none" }}
//         _focus={{ boxShadow: "none" }}>
//         <Flex
//           align="center"
//           p="4"
//           mx="4"
//           borderRadius="lg"
//           role="group"
//           cursor="pointer"
//           _hover={{ bg: "cyan.400", color: "white" }}>
//           {icon && (
//             <Icon
//               mr="4"
//               fontSize="16"
//               _groupHover={{ color: "white" }}
//               as={icon}
//             />
//           )}
//           <Link to={href}>{children}</Link>
//           {dropdownItems && dropdownItems.length > 0 && (
//             <Button
//               bg="none"
//               ml="auto"
//               onClick={onToggle}
//               size="sm"
//               _hover={{ bg: "none", color: "white" }}>
//               {isOpen ? <FiMinimize2 /> : <FiMaximize2 />}
//             </Button>
//           )}
//         </Flex>
//         <Collapse in={isOpen}>
//           {dropdownItems &&
//             dropdownItems.map((item, index) => (
//               <Flex
//                 key={index}
//                 p={4}
//                 mx="4"
//                 borderRadius="lg"
//                 role="group"
//                 cursor="pointer"
//                 _hover={{ bg: "cyan.400", color: "white" }}
//                 alignItems={"center"}>
//                 {item.icon && <Icon mr="2" as={item.icon} />}
//                 <a href={item.href}>{item.name}</a>
//               </Flex>
//             ))}
//         </Collapse>
//       </Box>
//     );
//   };
  
//   const MobileNav = ({ onOpen, ...rest }) => {
//     const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  
//     const handleOrderClick = () => setIsOrderModalOpen(true);
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const { isLoading, isSuccess } = useSelector(selectAuth);
  
//     useLayoutEffect(() => {
//       dispatch(crud.resetState());
//     }, []);
  
//     const signOut = () => {
//       dispatch(logout());
//       if (isSuccess) navigate("/login");
//     };
  
//     return (
//       <Loading isLoading={isLoading}>
//         <Flex
//           ml={{ base: 0, md: 60 }}
//           px={{ base: 4, md: 4 }}
//           height="20"
//           alignItems="center"
//           bg={useColorModeValue("white", "gray.900")}
//           borderBottomWidth="1px"
//           borderBottomColor={useColorModeValue("gray.200", "gray.700")}
//           justifyContent={{ base: "space-between", md: "flex-end" }}>
//           <IconButton
//             display={{ base: "flex", md: "none" }}
//             onClick={onOpen}
//             variant="outline"
//             aria-label="open menu"
//             icon={<FiMenu />}
//           />
  
//           <Text
//             display={{ base: "flex", md: "none" }}
//             fontSize="2xl"
//             fontFamily="monospace"
//             fontWeight="bold">
//             M2HSE
//           </Text>
  
//           <HStack spacing={{ base: "0", md: "6" }}>
//             <Button variant="solid" colorScheme="blue" onClick={handleOrderClick}>
//               Create Order
//             </Button>
//             <OrderModal
//               isOpen={isOrderModalOpen}
//               onClose={() => setIsOrderModalOpen(false)}
//             />
  
//             <IconButton
//               display={{ base: "flex", md: "none" }}
//               onClick={onOpen}
//               variant="outline"
//               aria-label="open menu"
//               icon={<FiMenu />}
//             />
  
//             <Text
//               display={{ base: "flex", md: "none" }}
//               fontSize="2xl"
//               fontFamily="monospace"
//               fontWeight="bold">
//               M2HSE
//             </Text>
  
//             <Flex alignItems={"center"}>
//               <Menu>
//                 <MenuButton
//                   py={2}
//                   transition="all 0.3s"
//                   _focus={{ boxShadow: "none" }}>
//                   <HStack>
//                     <Avatar
//                       size={"sm"}
//                       src={require("../../assests/logo/logo.png")}
//                     />
//                     <VStack
//                       display={{ base: "none", md: "flex" }}
//                       alignItems="flex-start"
//                       spacing="1px"
//                       ml="2">
//                       <Text fontSize="sm">M2hse</Text>
//                       <Text fontSize="xs" color="gray.600">
//                         Admin
//                       </Text>
//                     </VStack>
//                     <Box display={{ base: "none", md: "flex" }}>
//                       <FiChevronDown />
//                     </Box>
//                   </HStack>
//                 </MenuButton>
//                 <MenuList
//                   bg={useColorModeValue("white", "gray.900")}
//                   borderColor={useColorModeValue("gray.200", "gray.700")}>
//                   <MenuItem>
//                     <Link to="/user-profile">Profile</Link>
//                   </MenuItem>
//                   <MenuItem>
//                     <Link to="/website-settings">Settings</Link>
//                   </MenuItem>
  
//                   <MenuDivider />
//                   <MenuItem onClick={signOut}>Sign out</MenuItem>
//                 </MenuList>
//               </Menu>
//             </Flex>
//           </HStack>
//         </Flex>
//       </Loading>
//     );
//   };
  
//   const Sidebar = () => {
//     const { isOpen, onOpen, onClose } = useDisclosure();
  
//     return (
//       <Box>
//         <SidebarContent
//           onClose={() => onClose}
//           display={{ base: "none", md: "block" }}
//         />
//         <Drawer
//           isOpen={isOpen}
//           placement="left"
//           onClose={onClose}
//           returnFocusOnClose={false}
//           onOverlayClick={onClose}
//           size="full">
//           <DrawerContent>
//             <SidebarContent onClose={onClose} />
//           </DrawerContent>
//         </Drawer>
//         {/* mobilenav */}
//         <MobileNav onOpen={onOpen} />
//         <Box ml={{ base: 0, md: 60 }}>{/* Content */}</Box>
//       </Box>
//     );
//   };
  
//   export default Sidebar;
  

import React from 'react'

const Sidebar = () => {
  return (
    <div>TrySidebar</div>
  )
}

export default Sidebar