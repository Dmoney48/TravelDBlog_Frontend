import React, { useState, useEffect } from 'react';
import {useNavigate } from 'react-router-dom';
import { useAuth0 } from '../../contexts/auth0-context';
    
function Create(): JSX.Element {
  let history = useNavigate();
  const { user, getIdTokenClaims } = useAuth0();
    
  interface IValues {
    [key: string]: any;
    [key: number]: any;
  }
  interface FormData {
    [key: string]: any;
    [key: number]: any;
  }

  const [author, setAuthor] = useState<string>('');
  const [values, setValues] = useState<IValues>([]);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
    
  useEffect(() => {
    if (user) {
      setAuthor(user.name)
    }
  }, [user])
  const handleFormSubmission = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    const formData = {
      title: values.title,
      description: values.description,
      likes: values.likes,
      dislikes: values.dislikes,
      // latitude: Number,
      // longitude: Number,
      content: values.content,
      // user: Object, //(ref to user ID)
      author,
      image: values.image,
      date_posted: Date().toLocaleString()      
    }
    const submitSuccess: boolean = await submitform(formData);
    setSubmitSuccess(submitSuccess);
    setValues({...values, formData});
    setLoading(false);
    setTimeout(() => {
      history('/');
    }, 1500);
  }


  
    
  const submitform = async (formData: FormData) => {
    // console.log(formData)
    try {
      const accessToken = await getIdTokenClaims();
      formData.author_email = accessToken.email
      formData.user_picture = accessToken.picture
      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/blog/post`, {
        method: "post",
        headers: new Headers({
          "Content-Type": "application/json",
          "Accept": "application/json",
          "authorization": `Bearer ${accessToken.__raw}`
        }),
        body: JSON.stringify(formData)
      });
      return response.ok;
    } catch (ex) {
      return false;
    }
  }
  const setFormValues = (formValues: IValues) => {
    setValues({...values, ...formValues})
  }
  const handleInputChanges = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    setFormValues({ [e.currentTarget.name]: e.currentTarget.value })
  }
  return (
    <div id="CreateRoute">
      <div id="bgImageCreateRoute"></div>
    <div className={"col-md-6"}>
      {/* {!submitSuccess && (
        <div className="alert alert-info" role="alert">
          Fill the form below to create a new post.
                </div>
      )} */}
      {submitSuccess && (
        <div className="alert alert-info" role="alert">
          The form was successfully submitted!
                        </div>
      )}
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Create Post</h5>
            <form id={"create-post-form"} onSubmit={handleFormSubmission} noValidate={true}>
              <div className="form-group col-md-12">
                <label htmlFor="title"> Title </label>
                <input type="text" id="title" onChange={(e) => handleInputChanges(e)} name="title" className="form-control" placeholder="Enter Title" />
              </div>
              <div className="form-group col-md-12">
                <label htmlFor="description"> Description </label>
                <input type="text" id="description" onChange={(e) => handleInputChanges(e)} name="description" className="form-control" placeholder="Enter Description" />
              </div>
              <div className="form-group col-md-12">
                <label htmlFor="content"> Tell Your Story </label>
                <input  type="textarea" id="StoryBox" onChange={(e) => handleInputChanges(e)} name="content" className="form-control" placeholder="Story Time" />
              </div>
              <div className="form-group col-md-12">
                <label htmlFor="image"> Travel Picture </label>
                <input type="text" id="image" onChange={(e) => handleInputChanges(e)} name="image" className="form-control" placeholder="Enter image address" />
              </div>
              <div className="form-group col-md-12">
                <label htmlFor="author"> Author </label>
                <input type="text" id="author" defaultValue={author} onChange={(e) => handleInputChanges(e)} name="author" className="form-control" />
              </div>
              <div className="form-group col-md-4 pull-right">
                <button className="btn btn-primary float-right" type="submit">
                  Create Post
                </button>
                {loading &&
                  <span className="fa fa-circle-o-notch fa-spin" />
                }
              </div>
            </form>
          </div> {/* END CARD BODY */}
        </div> {/* END CARD */}
    </div>
  </div>
  );
}
export default (Create)