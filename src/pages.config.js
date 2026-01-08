import Home from './pages/Home';
import Pricing from './pages/Pricing';
import Profile from './pages/Profile';
import Servers from './pages/Servers';
import Support from './pages/Support';
import utils from './pages/utils';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Pricing": Pricing,
    "Profile": Profile,
    "Servers": Servers,
    "Support": Support,
    "utils": utils,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};