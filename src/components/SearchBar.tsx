import './SearchBar.css'; 

const SearchBar = () => (
    // <form action="/" method="get">
    //     <label htmlFor="header-search">
    //         <span className="visually-hidden">Search Blog Posts</span>
    //     </label>
    //     <input
    //         type="text"
    //         id="header-search"
    //         placeholder="Search blog posts"
    //         name="s" 
    //     />
    //     <button type="submit">Search</button>
    // </form>
    <form id="searchBar" className="form-inline my-2 my-lg-0">
        <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"></input>
        <button className="btn btn-outline-secondary my-2 my-sm-0" type="submit">Search</button>
    </form>
);

export default SearchBar;