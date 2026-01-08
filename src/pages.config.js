import Home from './pages/Home';
import Pricing from './pages/Pricing';
import Profile from './pages/Profile';
import Support from './pages/Support';
import Servers from './pages/Servers';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Pricing": Pricing,
    "Profile": Profile,
    "Support": Support,
    "Servers": Servers,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};