import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useCart } from '../../../context/CartContext';
import CategoryFilter from '../../layout/menu/CategoryFilter';
import MenuList from '../../layout/menu/MenuList';
import vegSurprise from '../../../assets/vegSurprise.jpg';
import alooTikki from  '../../../assets/alooTikki.jpg';
import chickenBurger from  '../../../assets/chickenBurger.webp'
import chickenGrilledBurger from  '../../../assets/chickenGrilledBurger.png';
import frenchFries from  '../../../assets/Classic-fries.jpg';
import chickenMcnuggets from  '../../../assets/chickenMcnuggets.webp';
import piriPiri from  '../../../assets/piri-piri.jpg';
import cocaCola from  '../../../assets/cocaCola.webp';
import macFurry from '../../../assets/McFlurry.jpg'
import mcIcedLatte from '../../../assets/mcLatter.png'
import sprite from '../../../assets/sprite.webp'
import sundae from '../../../assets/sundae.jpg'
import brownie from '../../../assets/brownie.jpg'


import './menu.css';


const menuItems = [
  {
    _id: 'b1',
    name: 'Veg Surprise Burger',
    description: 'A scrumptious potato patty topped with a delectable Italian herb sauce.',
    price: 129,
    category: 'Burgers',
    image: vegSurprise,
    isVegetarian: true,
    isPopular: true
  },
  {
    _id: 'b2',
    name: 'McAloo Tikki Burger',
    description: 'Delicious aloo tikki patty with tangy sauces and crisp veggies in a toasted bun.',
    price: 149,
    category: 'Burger',
    image: alooTikki,
    isVegetarian: true,
    isPopular: true
  },
  {
    _id: 'b3',
    name: 'McChicken Burger',
    description: 'Tender and juicy chicken patty with creamy mayo and shredded lettuce.',
    price: 199,
    category: 'Burgers',
    image: chickenBurger,
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
    image: chickenGrilledBurger,
    isVegetarian: false,
    isPopular: true
  },
  
  {
    _id: 's1',
    name: 'French Fries',
    description: 'Golden, crispy, and perfectly salted French fries.',
    price: 99,
    category: 'Sides',
    image: frenchFries,
    isVegetarian: true,
    isPopular: true
  },
  {
    _id: 's2',
    name: 'Chicken McNuggets',
    description: 'Tender, juicy chicken nuggets with a crispy coating.',
    price: 159,
    category: 'Sides',
    image: chickenMcnuggets,
    isVegetarian: false,
    isPopular: true
  },
  {
    _id: 's3',
    name: 'Piri Piri Spice Mix',
    description: 'Spice up your fries with this zesty piri piri mix.',
    price: 25,
    category: 'Sides',
    image: piriPiri,
    isVegetarian: true,
    isPopular: false
  },
  
  {
    _id: 'd1',
    name: 'Coca-Cola',
    description: 'Refreshing Coca-Cola to complement your meal.',
    price: 89,
    category: 'Beverages',
    image: cocaCola,
    isVegetarian: true,
    isPopular: true
  },
  {
    _id: 'd2',
    name: 'Sprite',
    description: 'Crisp, refreshing lemon-lime flavored Sprite.',
    price: 89,
    category: 'Beverages',
    image: sprite,
    isVegetarian: true,
    isPopular: false
  },
  {
    _id: 'd3',
    name: 'McCafé Iced Coffee',
    description: 'Smooth, cold coffee with a perfect blend of cream and sweetness.',
    price: 159,
    category: 'Beverages',
    image: mcIcedLatte,
    isVegetarian: true,
    isPopular: true
  },
  

  {
    _id: 'ds1',
    name: 'McFlurry with Oreo',
    description: 'Creamy vanilla soft serve with crunchy Oreo cookie pieces.',
    price: 129,
    category: 'Desserts',
    image: macFurry,
    isVegetarian: true,
    isPopular: true
  },
  {
    _id: 'ds2',
    name: 'Soft Serve Hot Fudge Sundae',
    description: 'Creamy vanilla soft serve topped with hot fudge sauce.',
    price: 99,
    category: 'Desserts',
    image: sundae,
    isVegetarian: true,
    isPopular: true
  },
  {
    _id: 'ds3',
    name: 'Brownie Hot Fudge',
    description: 'Warm chocolate brownie topped with vanilla soft serve and hot fudge sauce.',
    price: 159,
    category: 'Desserts',
    image: brownie,
    isVegetarian: true,
    isPopular: false
  }
];

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredItems, setFilteredItems] = useState([]);
  const [isVegOnly, setIsVegOnly] = useState(false);
  const { addToCart } = useCart();
  

  const categories = ['All', ...new Set(menuItems.map(item => item.category))];
  
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
    addToCart(item);
    toast.success(`${item.name} added to cart!`);
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