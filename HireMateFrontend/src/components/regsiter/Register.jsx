import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom'

function Register() {
  const [activeForm, setActiveForm] = useState('hirer');
  return (
    <div className="container py-5">
      <h2 className="text-center mb-5">Register</h2>

      <div className="text-center mb-4">
        <button
          className={`btn ${activeForm === 'hirer' ? 'btn-info' : 'btn-outline-info'} mx-2`}
          onClick={() => setActiveForm('hirer')}
        >
          Register as Hirer
        </button>
        <button
          className={`btn ${activeForm === 'freelancer' ? 'btn-success' : 'btn-outline-success'} mx-2`}
          onClick={() => setActiveForm('freelancer')}
        >
          Register as Freelancer
        </button>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8 col-sm-12">
          <div className="p-4 shadow" style={{ borderRadius: '10px', border: '1px solid white' }}>
            {activeForm === 'hirer' ? <HirerForm /> : <FreelancerForm />}
          </div>
        </div>
      </div>
    </div>
  );
}

function HirerForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [err, setErr] = useState('');

  let navigate=useNavigate();

async function onSubmit(data) {
  const dataToBePushed = {
    ...data,
    role: 'Hirer',
  };

  try {
    const response = await fetch('https://hire-mate-mcte.vercel.app/user-api/user-2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToBePushed),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to register user');
    }

    const result = await response.json();

    if (result.message !== 'User created successfully') {
      setErr(result.message || 'Unexpected error occurred during registration');
      return;
    }
    console.log('Hirer Form Data:', dataToBePushed);
    setErr('');
    reset();
    navigate('/');
  } catch (error) {
    console.error('Error during registration:', error.message);
    setErr(error.message || 'An error occurred. Please try again.');
  }
}


  return (
    <form className="p-3" onSubmit={handleSubmit(onSubmit)}>
      <h4 className="text-center mb-4">Hirer Registration</h4>
      {err && <p className="text-danger text-center">{err}</p>}

      <div className="mb-3">
        <label htmlFor="username" className="form-label">Username</label>
        <input
          type="text"
          id="username"
          className="form-control"
          {...register('username', {
            required: 'Username is required',
            minLength: {
              value: 6,
              message: 'Username should be at least 6 characters long',
            },
          })}
        />
        {errors.username && <p className="text-danger mt-1">{errors.username.message}</p>}
      </div>

      <div className="mb-3">
        <label htmlFor="name" className="form-label">Name</label>
        <input
          type="text"
          id="name"
          className="form-control"
          {...register('name', { required: 'Name is required' })}
        />
        {errors.name && <p className="text-danger mt-1">{errors.name.message}</p>}
      </div>

      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email</label>
        <input
          type="email"
          id="email"
          className="form-control"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Enter a valid email address',
            },
          })}
        />
        {errors.email && <p className="text-danger mt-1">{errors.email.message}</p>}
      </div>

      <div className="mb-3">
        <label htmlFor="password" className="form-label">Password</label>
        <input
          type="password"
          id="password"
          className="form-control"
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password should be at least 8 characters long',
            },
          })}
        />
        {errors.password && <p className="text-danger mt-1">{errors.password.message}</p>}
      </div>

      <div className="text-center">
        <button type="submit" className="btn btn-info w-30">
          Register as Hirer
        </button>
      </div>
    </form>
  );
}

function FreelancerForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [err, setErr] = useState('');

  let navigate=useNavigate();
  async function onSubmit(data) {
    let dataToBePushed={
      ...data,
      role:"Freelauncer",
      pendingRequests:[],
      acceptedRequests:[],
      description:""
    }
    try {
      const response = await fetch('https://hire-mate-mcte.vercel.app/user-api/user-1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToBePushed),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Server error occurred');
      }
  
      const result = await response.json();
  
      if (result.message === 'User created successfully') {
        console.log('Hirer Form Data:', dataToBePushed);
        setErr(''); 
        reset();
        navigate('/');
      } else {
        setErr(result.message || 'An unexpected error occurred');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setErr(error.message || 'An error occurred. Please try again.');
    }
  }

  return (
    <form className="p-3" onSubmit={handleSubmit(onSubmit)}>
      <h4 className="text-center mb-4">Freelancer Registration</h4>
      {err && <p className="text-danger text-center">{err}</p>}

      <div className="mb-3">
        <label htmlFor="username" className="form-label">Username</label>
        <input
          type="text"
          id="username"
          className="form-control"
          {...register('username', {
            required: 'Username is required',
            minLength: {
              value: 6,
              message: 'Username should be at least 6 characters long',
            },
          })}
        />
        {errors.username && <p className="text-danger mt-1">{errors.username.message}</p>}
      </div>

      <div className="mb-3">
        <label htmlFor="name" className="form-label">Name</label>
        <input
          type="text"
          id="name"
          className="form-control"
          {...register('name', { required: 'Name is required' })}
        />
        {errors.name && <p className="text-danger mt-1">{errors.name.message}</p>}
      </div>

      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email</label>
        <input
          type="email"
          id="email"
          className="form-control"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Enter a valid email address',
            },
          })}
        />
        {errors.email && <p className="text-danger mt-1">{errors.email.message}</p>}
      </div>

      <div className="mb-3">
        <label htmlFor="password" className="form-label">Password</label>
        <input
          type="password"
          id="password"
          className="form-control"
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password should be at least 8 characters long',
            },
          })}
        />
        {errors.password && <p className="text-danger mt-1">{errors.password.message}</p>}
      </div>

      <div className="mb-3">
        <label htmlFor="proficiency" className="form-label">Select Your Proficiency</label>
        <select
          id="proficiency"
          className="form-select"
          {...register('proficiency', { required: 'Please select a proficiency' })}
        >
          <option value="" disabled>
            Select Proficiency
          </option>
          <option value="Logo Designer">Logo Designer</option>
          <option value="Website Designer">Website Designer</option>
          <option value="Ornament Designer">Ornament Designer</option>
          <option value="others">Others</option>
        </select>
        {errors.proficiency && <p className="text-danger mt-1">{errors.proficiency.message}</p>}
      </div>

      <div className="text-center">
        <button type="submit" className="btn btn-success w-30">
          Register as Freelancer
        </button>
      </div>
    </form>
  );
}

export default Register;
