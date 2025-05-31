// project-imports
// import support from './support';
import users from './users'
import admin from './admin'

// types
import { NavItemType } from 'types/menu';

// ==============================|| MENU ITEMS ||============================== //



const menuItems: { items: NavItemType[] } = {
  items: [users, admin]
};

export default menuItems;
