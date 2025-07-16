import React, { useState, useEffect } from 'react';
import './menu.css';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import CategoryFilter from '../../layout/menu/CategoryFilter';
import MenuList from '../../layout/menu/MenuList';

// Sample menu items with categories
const menuItems = [
  // Burgers
  {
    _id: 'b1',
    name: 'Veg Surprise Burger',
    description: 'A scrumptious potato patty topped with a delectable Italian herb sauce.',
    price: 129,
    category: 'Burgers',
    image: 'https://mcdonaldsblog.in/wp-content/uploads/2022/01/McAloo-Tikki-Burger.jpg',
    isVegetarian: true,
    isPopular: true
  },
  {
    _id: 'b2',
    name: 'McAloo Tikki Burger',
    description: 'Delicious aloo tikki patty with tangy sauces and crisp veggies in a toasted bun.',
    price: 149,
    category: 'Burgers',
    image: 'https://mcdonaldsblog.in/wp-content/uploads/2022/01/McAloo-Tikki-Burger.jpg',
    isVegetarian: true,
    isPopular: true
  },
  {
    _id: 'b3',
    name: 'McChicken Burger',
    description: 'Tender and juicy chicken patty with creamy mayo and shredded lettuce.',
    price: 199,
    category: 'Burgers',
    image: 'https://mcdonaldsblog.in/wp-content/uploads/2022/01/McChicken-Burger.jpg',
    isVegetarian: false,
    isPopular: true
  },
  {
    _id: 'b4',
    name: 'McVeggie Burger',
    description: 'A wholesome patty of potatoes, peas, carrots and beans, spiced and crumb-coated.',
    price: 179,
    category: 'Burgers',
    image: 'https://mcdonaldsblog.in/wp-content/uploads/2022/01/McVeggie-Burger.jpg',
    isVegetarian: true,
    isPopular: false
  },
  {
    _id: 'b5',
    name: 'Butter Chicken Grilled Burger',
    description: 'Spicy grilled chicken patty topped with creamy butter chicken sauce.',
    price: 229,
    category: 'Burgers',
    image: 'https://mcdonaldsblog.in/wp-content/uploads/2022/01/Chicken-Maharaja-Mac.jpg',
    isVegetarian: false,
    isPopular: true
  },
  
  // Sides
  {
    _id: 's1',
    name: 'French Fries',
    description: 'Golden, crispy, and perfectly salted French fries.',
    price: 99,
    category: 'Sides',
    image: 'https://mcdonaldsblog.in/wp-content/uploads/2022/01/French-Fries.jpg',
    isVegetarian: true,
    isPopular: true
  },
  {
    _id: 's2',
    name: 'Chicken McNuggets',
    description: 'Tender, juicy chicken nuggets with a crispy coating.',
    price: 159,
    category: 'Sides',
    image: 'https://mcdonaldsblog.in/wp-content/uploads/2022/01/Chicken-McNuggets.jpg',
    isVegetarian: false,
    isPopular: true
  },
  {
    _id: 's3',
    name: 'Piri Piri Spice Mix',
    description: 'Spice up your fries with this zesty piri piri mix.',
    price: 25,
    category: 'Sides',
    image: 'https://mcdonaldsblog.in/wp-content/uploads/2022/01/Piri-Piri-Spice-Mix.jpg',
    isVegetarian: true,
    isPopular: false
  },
  
  // Beverages
  {
    _id: 'd1',
    name: 'Coca-Cola',
    description: 'Refreshing Coca-Cola to complement your meal.',
    price: 89,
    category: 'Beverages',
    image: 'https://mcdonaldsblog.in/wp-content/uploads/2022/01/Coca-Cola.jpg',
    isVegetarian: true,
    isPopular: true
  },
  {
    _id: 'd2',
    name: 'Sprite',
    description: 'Crisp, refreshing lemon-lime flavored Sprite.',
    price: 89,
    category: 'Beverages',
    image: 'https://mcdonaldsblog.in/wp-content/uploads/2022/01/Sprite.jpg',
    isVegetarian: true,
    isPopular: false
  },
  {
    _id: 'd3',
    name: 'McCafé Iced Coffee',
    description: 'Smooth, cold coffee with a perfect blend of cream and sweetness.',
    price: 159,
    category: 'Beverages',
    image: 'https://mcdonaldsblog.in/wp-content/uploads/2022/01/McCafe-Iced-Coffee.jpg',
    isVegetarian: true,
    isPopular: true
  },
  
  // Desserts
  {
    _id: 'ds1',
    name: 'McFlurry with Oreo',
    description: 'Creamy vanilla soft serve with crunchy Oreo cookie pieces.',
    price: 129,
    category: 'Desserts',
    image: 'https://mcdonaldsblog.in/wp-content/uploads/2022/01/McFlurry-with-Oreo.jpg',
    isVegetarian: true,
    isPopular: true
  },
  {
    _id: 'ds2',
    name: 'Soft Serve Hot Fudge Sundae',
    description: 'Creamy vanilla soft serve topped with hot fudge sauce.',
    price: 99,
    category: 'Desserts',
    image: 'https://mcdonaldsblog.in/wp-content/uploads/2022/01/Soft-Serve-Hot-Fudge-Sundae.jpg',
    isVegetarian: true,
    isPopular: true
  },
  {
    _id: 'ds3',
    name: 'Brownie Hot Fudge',
    description: 'Warm chocolate brownie topped with vanilla soft serve and hot fudge sauce.',
    price: 159,
    category: 'Desserts',
    image: 'https://mcdonaldsblog.in/wp-content/uploads/2022/01/Brownie-Hot-Fudge.jpg',
    isVegetarian: true,
    isPopular: false
  }
];

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredItems, setFilteredItems] = useState([]);
  const [isVegOnly, setIsVegOnly] = useState(false);
  
  // Get unique categories
  const categories = ['All', ...new Set(menuItems.map(item => item.category))];
  
  // Filter items based on selected category and veg filter
  useEffect(() => {
    let filtered = [...menuItems];
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    if (isVegOnly) {
      filtered = filtered.filter(item => item.isVegetarian);
    }
    
    setFilteredItems(filtered);
  }, [selectedCategory, isVegOnly]);
  
  const handleItemClick = (item) => {
    toast.success(`${item.name} selected!`);
  };

  return (
    <div className="menu-page">
      <div className="menu-header">
        <h1>Our Menu</h1>
        <p>Discover the delicious world of McDonald's</p>
      </div>
      
      <CategoryFilter 
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        isVegOnly={isVegOnly}
        setIsVegOnly={setIsVegOnly}
      />
      
      <MenuList 
        items={filteredItems}
        onAddToCart={handleItemClick}
      />
    </div>
  );
};

export default Menu;