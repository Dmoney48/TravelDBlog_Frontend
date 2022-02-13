import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useAuth0 } from '../../contexts/auth0-context';
    
function Edit(): JSX.Element {
  const { getIdTokenClaims } = useAuth0();
  let history = useHistory();
  let { postId } = useParams();
    
  interface IValues {
    [key: string]: any;
  }
    
  const [post, setPost] = useState()
  const [values, setValues] = useState<IValues>([]);
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
    
  return (
  )
    
}
export default Edit;