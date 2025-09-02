import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`/api/user/${id}`);
        setUser(res.data);
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className='w-full h-full flex items-center justify-center'>
        <span className='loading loading-spinner'></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className='w-full h-full flex items-center justify-center text-red-600'>
        {error}
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className='w-full h-full flex items-center justify-center p-4'>
      <div className='max-w-md w-full bg-white bg-opacity-20 backdrop-blur-sm rounded-xl shadow-lg p-4'>
        <button onClick={() => navigate(-1)} className='btn btn-sm mb-3'>Back</button>
        <div className='flex items-center gap-3'>
          <img src={user.profilepic} alt='profile' className='w-20 h-20 rounded-full object-cover' />
          <div>
            <div className='text-xl font-bold text-gray-900'>{user.username}</div>
            <div className='text-sm text-gray-700'>{user.fullname}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;


