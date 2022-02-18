import React, { useState, useEffect } from 'react';

import './SearchBar.css'; 
interface Posts {
    posts: any[];
    filterPosts?: (searchTerm: string) => void;
}
export const SearchBar: React.FC<Posts> = (props) => {
    const [search, setSearch] = useState<any>('');
    const handleInputChanges = (e: React.FormEvent<HTMLInputElement>) => {
        setSearch(e.currentTarget.value)
    }
    useEffect(() => {
        if (props.filterPosts) {
            props.filterPosts(search);
        }
    }, [search]);
    return (
        <form id="searchBar" className="form-inline my-2 my-lg-0">
            <input className="form-control mr-sm-2" type="search" placeholder="Search" onChange={(e) => handleInputChanges(e)}></input>
            <button className="btn btn-outline-secondary my-2 my-sm-0" type="submit">Search</button>
        </form>
    );
}