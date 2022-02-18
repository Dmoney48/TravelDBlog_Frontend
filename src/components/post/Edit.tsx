import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth0 } from '../../contexts/auth0-context';
    
function Edit(): JSX.Element {
  const { getIdTokenClaims } = useAuth0();
  let history = useNavigate();
  let { postId } = useParams();
    
//   interface IValues {
//     [key: string]: any;
//     [key: number]: any;
//   }
//   interface Comment {
//     // user: Object;
//     comment: string;
//     likes: number;
//     dislikes: number;
//   }

  interface Post{
    // name:string;
    // message:string;
    // likes: number;
    // dislikes: number;
    // latitude: number;
    // longitude: number;
    // comment: {
    //     // user: Object;
    //     comment: string;
    //     likes: number;
    //     dislikes: number;
    //   }; //(refs to blogs uniqueId)
    // // user: Object<User>; //(ref to user ID)
    // author: string;
    // date_posted: string;
    [key: string]: any;
    [key: number]: any;
  }

  const postState = {
    title:'',
    description:'',
    likes: 0,
    dislikes: 0,
    latitude: 0,
    longitude: 0,
    comment: {
        comment: '',
        likes: 0,
        dislikes: 0,
    }, //(refs to blogs uniqueId)
    // user: Object<User>; //(ref to user ID)
    author: '',
    date_posted: '',
    image:''
    
  }
    
  const [post, setPost] = useState<Post>(postState);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false)
  const [loading, setLoading] = useState(false);
    
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/blog/post/${postId}`);
      const json = await response.json();
      setPost(json)    
    }
    fetchData();    
  }, [postId]);

  const handleFormSubmission = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    const submitSuccess: boolean = await submitForm();
    setSubmitSuccess(submitSuccess);
    setLoading(false);
    setTimeout(() => {
      history('/');
    }, 1500);
  }
  const submitForm = async (): Promise<boolean> => {
    try {
      const accessToken = await getIdTokenClaims();
      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/blog/edit?postID=${postId}`, {
        method: "put",
        headers: new Headers({
          "Content-Type": "application/json",
          Accept: "application/json",
          "authorization": `Bearer ${accessToken.__raw}`
        }),
        body: JSON.stringify(post)
      });
      return response.ok;  
    } catch(ex) {
      return false;
    }
  }
  const setPostValues = (formValues: Post) => {
    setPost({...post, ...formValues})
  }
  const handleInputChanges = (e: React.FormEvent<HTMLInputElement>) => {
    setPostValues({ [e.currentTarget.id]: e.currentTarget.value })
  }
    
  
  return (
    <div id="EditRoute" className={'page-wrapper'}>
      <div id="bgImageEditRoute"></div>
    {post &&
      <div className={"col-md-6"}>
        {submitSuccess && (
          <div className="alert alert-info" role="alert">
            The post has been edited successfully!
                        </div>
        )}
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Edit Post</h5>
              <form id={"create-post-form"} onSubmit={handleFormSubmission} noValidate={true}>
                <div className="form-group col-md-12">
                  <label htmlFor="title"> Title </label>
                  <input type="text" id="title" defaultValue={post.title} onChange={(e) => handleInputChanges(e)} name="title" className="form-control" placeholder="Edit title" />
                </div>
                <div className="form-group col-md-12">
                  <label htmlFor="description"> Description </label>
                  <input type="text" id="description" defaultValue={post.description} onChange={(e) => handleInputChanges(e)} name="description" className="form-control" placeholder="Edit Description" />
                </div>
                <div className="form-group col-md-12">
                  <label htmlFor="description"> Image </label>
                  <input type="text" id="image" defaultValue={post.image} onChange={(e) => handleInputChanges(e)} name="image" className="form-control" placeholder="Edit Image Address" />
                </div>
                <div className="form-group col-md-12">
                  <label htmlFor="body"> Change your Story </label>
                  <input type="text" id="StoryBox" defaultValue={post.content} onChange={(e) => handleInputChanges(e)} name="content" className="form-control" placeholder="Story Time" />
                </div>
                <div className="form-group col-md-4 pull-right">
                  <button className="btn btn-primary float-right" type="submit">
                    Edit Post
                  </button>
                  {loading &&
                    <span className="fa fa-circle-o-notch fa-spin" />
                  }
                </div>
              </form>
          </div>
        </div>
      </div>
    }
  </div>
  )
}
export default Edit;
