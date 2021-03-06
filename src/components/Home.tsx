import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth0 } from '../contexts/auth0-context';
import {SearchBar} from './SearchBar';

function Home():JSX.Element {
  let history = useNavigate()
  const defaultPic:string = 'https://images.ctfassets.net/23aumh6u8s0i/5RgCRgruCESPZUobN5RL6G/a8082500f2e6dc7fb4007c0cdfd0cbe3/WEB_FREAK_50PX-01_yaqxg7';
  const { isAuthenticated, getIdTokenClaims, user } = useAuth0();
  const [posts, setPosts] = useState<any[]>([]);
  const [currUser, setCurrUser] = useState(
    localStorage.getItem('currUserInLocalStorage') || {}
  );

  const fetchPosts = async (): Promise<any> => {
    const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/blog/posts`);
    const json = await response.json();
    setPosts(json)
  }

  const deletePost = async(id: string) => {
    const accessToken = await getIdTokenClaims();
    await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/blog/delete?postID=${id}`, {
      method: "delete",
      headers: new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
        "authorization": `Bearer ${accessToken.__raw}`
      })
    });
    _removePostFromView(id);
    history('/');
  }
  const filterPosts = (event: string): Array<any> => {
    const results = posts?.filter((post) => post.title.toLowerCase().includes(event));
    setPosts(results);
    if(event === '') {
      fetchPosts();
    }
    return results || null;
  };

  const _removePostFromView = (id: string) => {
    //   console.log(posts);
      
    const index = posts.findIndex((post: { _id: string; }) => post._id === id);
    posts.splice(index, 1);
  }
    
  useEffect(() => {
    if(currUser == {}){
      localStorage.setItem('currUserInLocalStorage', user )
    }
    fetchPosts();
  }, [user])

  return (
    <section id="HomeRoute" className="blog-area section">
      <SearchBar posts={posts} filterPosts={filterPosts} />
    <div className="container">
    <div id="bgImageHomeRoute"></div>
      <div className="row">
        {posts && posts.map((post: { title: React.ReactNode; _id: any; author: any; image: any; date_posted:any, user_picture: string, description: string}) => (
          <div className="col-lg-4 col-md-6" key={post._id}>
          <div className="card h-100">
            <div className="single-post post-style-1">
              <div className="blog-image">
                <img src={post.image} alt="Blog" />
              </div>
              <span className="avatar">
                  {!post.user_picture ? (
                    <img src={defaultPic} alt="Profile" />) 
                    :
                    (<img src={post.user_picture} alt="Profile" /> 
                  )}
                {/* CHANGE IMAGE TO USER PROFILE IMAGE */}
              </span>
              <div className="blog-info">
                <h4 className="title">
                  <span>
                    <b>{post.title}</b>
                  </span>
                </h4>
                  <span>
                    <b>{post.description}</b>
                  </span>
                <p className="Author">
                  <span>
                    Author:<b>{post.author}</b>
                  </span>
                </p>
                <p className="Date">
                  <span>
                    Date Posted: {post.date_posted}
                  </span>
                </p>
              </div>
            </div>
            <ul className="post-footer">
              <li>
                <Link to={`/post/${post._id}`} className="btn btn-sm btn-outline-info">View Post </Link>
              </li>
              <li>
                
                    {/* {console.log(post.author)} */}
               
                  <Link to={`/edit/${post._id}`} className="btn btn-sm btn-outline-success">Edit Post </Link>
                
              </li>
              <li>
                {
                //   isAuthenticated && (user.name === post.author) &&
                  <button className="btn btn-sm btn-outline-danger" onClick={() => deletePost(post._id)}>Delete Post</button>
                }
              </li>
            </ul>
          </div>
        </div>
        ))}
      </div>
    </div>
  </section>
);
}
export default Home;