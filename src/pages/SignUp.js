import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { supabase } from '../supabaseClient';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
`;

const Form = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin: 0.5rem 0;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.5rem;
  background: #333;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
`;

const ImagePreview = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin: 1rem auto;
  display: block;
`;

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarUrl(URL.createObjectURL(file));
    }
  };

  const uploadAvatar = async (userId) => {
    if (avatar) {
      const fileExt = avatar.name.split('.').pop();
      const fileName = `${userId}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, avatar);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      return publicUrl;
    }
    return null;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      // First sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
          }
        }
      });

      if (authError) throw authError;

      // Create a profile for the new user
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            username: username,
            email: email,
          }
        ]);

      if (profileError) throw profileError;

      // Create initial favorites entry (empty) for the new user
      const { error: favoritesError } = await supabase
        .from('favorites')
        .insert([
          {
            user_id: authData.user.id,
            cocktail_id: null, // This will be removed, it's just to initialize the row
            cocktail_name: null
          }
        ]);

      if (favoritesError && !favoritesError.message.includes('null value in column')) {
        throw favoritesError;
      }

      // Auto sign in after successful signup
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      navigate('/');
    } catch (error) {
      console.error('Error during signup:', error);
      setError(error.message);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSignUp}>
        <h2>Sign Up</h2>
        
        {error && (
          <div style={{ 
            color: 'red', 
            marginBottom: '1rem', 
            textAlign: 'center' 
          }}>
            {error}
          </div>
        )}
        
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <Input
          type="text"
          placeholder="Email (optional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
        />
        
        {avatarUrl && <ImagePreview src={avatarUrl} alt="Profile preview" />}

        <Button type="submit">Sign Up</Button>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </Form>
    </Container>
  );
};

export default SignUp; 