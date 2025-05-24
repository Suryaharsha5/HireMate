import React, { useState, useEffect, useContext, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { usercontext } from '../../context/userLoginContext';
import { FaUserCircle, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { FaLocationArrow } from "react-icons/fa";
import { AiOutlineRise } from "react-icons/ai";
import FreeLancerProfileStore from '../../context/freeLancerProfileStore';
import { FreelancerProfile } from '../../context/freeLancerProfileContext';
import './Home.css';
import freelauncerslist from '../gallery/freelauncerslist.png'
import accptedCard from '../gallery/joblist.png';
import chatbox from '../gallery/chatbox.png';
import fprespro from '../gallery/fprespro.png';
import requestedCard from '../gallery/acceptedlist.png';
import freelauncerprofile from '../gallery/freelauncerprofile.png';

function Home() {
  const { onSubmit, loginStatus, err, curruser, logout,setCurruser } = useContext(usercontext);
  const { showProfile } = useContext(FreelancerProfile);
  const [freelancer, setFreelancer] = useState([]);
  const scrollContainerRef = useRef(null); 
  const navigate = useNavigate();
  const [ratingList,SetRatingList]=useState([]);
  let [jobDoneList,setJobDoneList]=useState([]);
  let [currFreeLancersJobDoneList,setFreelancersJobDoneList]=useState([]);

  function postProfile(data){
    console.log(data);
    showProfile(data);
    navigate("/freeLauncerProfile");
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  async function friendReq(freelancerUsername, hirerUsername) {
    try {
      const res = await fetch(
        `https://hire-mate-mcte.vercel.app/user-api/friendRequested/${freelancerUsername}/${hirerUsername}`,
        {
          method: "DELETE",
        }
      );
  
      const result = await res.json();
  
      if (result.message === "Friend request successfully updated") {
        alert("Request has been sent to " + freelancerUsername);
  
        setFreelancer((prevFreelancers) =>
          prevFreelancers.map((freelancer) =>
            freelancer.username === freelancerUsername
              ? {
                  ...freelancer,
                  pendingRequests: [
                    ...freelancer.pendingRequests,
                    { username: hirerUsername, details: curruser },
                  ],
                }
              : freelancer
          )
        );
      } else {
        alert("An error occurred: " + result.message);
      }
    } catch (error) {
      console.error("Error during updation:", error);
      alert(error.message || "An error occurred. Please try again.");
    }
  }
  

  async function getAllFreelancers() {
    try {
      const res = await fetch('https://hire-mate-mcte.vercel.app/user-api/users');
      const data = await res.json();
      setFreelancer(data.payload);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }


  useEffect(()=>{
    async function getTheRatings() {
      try {
        const res = await fetch('https://hire-mate-mcte.vercel.app/user-api/getAllRatings');
        const result = await res.json();
        if(result.message === 'Ratings List fetched'){
            SetRatingList(result.payload);
            console.log('Ratng List is Fetched');
        }
      } catch (error) {
        console.error('Error submitting rating:', error);
      }
    }
    getTheRatings();
  },[])

  useEffect(() => {
    if (jobDoneList.length > 0) {
      const userJobs = jobDoneList.filter(
        (job) => job.payload && job.payload.includes(curruser.username)
      );
      setFreelancersJobDoneList(userJobs);
    }
  }, [jobDoneList, curruser.username]);
  

  useEffect(() => {
      async function getJobDoneList() {
        try {
          const res = await fetch('https://hire-mate-mcte.vercel.app/user-api/getjobList');
          const result = await res.json();
          if (result.message === 'Job List fetched successfully') {
            setJobDoneList(result.list);
          } else {
            console.error('Error fetching job list:', result.message);
          }
        } catch (error) {
          console.error('Error fetching job list:', error);
        }
      }
      getJobDoneList();
    },[curruser.username]);


  useEffect(() => {
    getAllFreelancers();
  }, []);

  useEffect(() => {
    if (loginStatus) {
      navigate('/');
    }
  }, [loginStatus, navigate]);

  function scrollButtons(direction) {
    const container = scrollContainerRef.current;
    if (container) {
      if (direction === 'left') {
        container.scrollBy({ left: -300, behavior: 'smooth' }); 
      } else {
        container.scrollBy({ left: 300, behavior: 'smooth' });
      }
    }
  }

  return (
    <div className="p-5">
      {!loginStatus ? (
        <div className="row justify-content-center align-items-center py-5 mx-0 mt-5">
          <div className="col-12 text-center mb-4">
            <h2>Login</h2>
          </div>
          <div
            className="col-lg-5 col-md-7 col-sm-10 col-12 p-3 mb-5"
            style={{
              border: '1px solid #ccc',
              borderRadius: '10px',
            }}
          >
            <form className="p-3" onSubmit={handleSubmit(onSubmit)}>
              {err && <p className="text-danger text-center">{err}</p>}
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  className="form-control"
                  autoComplete="off"
                  {...register('username', {
                    required: 'Username is required',
                    minLength: {
                      value: 6,
                      message: 'Username must be at least 6 characters long',
                    },
                  })}
                />
                {errors.username && (
                  <p className="text-danger">{errors.username.message}</p>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  autoComplete="off"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters long',
                    },
                  })}
                />
                {errors.password && (
                  <p className="text-danger">{errors.password.message}</p>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="role" className="form-label">
                  Select a Role
                </label>
                <select
                  id="role"
                  className="form-select"
                  {...register('role', { required: 'Role selection is required' })}
                >
                  <option value="freelancer">Freelancer</option>
                  <option value="hirer">Hirer</option>
                </select>
                {errors.role && (
                  <p className="text-danger">{errors.role.message}</p>
                )}
              </div>

              <div className="text-center mb-3 mt-3">
                <button
                  type="submit"
                  className="btn btn-outline-info"
                  style={{ width: '30%' }}
                >
                  Login
                </button>
              </div>

              <p className="text-center">
                Don't have an account?{' '}
                <Link to="/register" className="text-decoration-none text-info">
                  Create Account
                </Link>
              </p>
            </form>
          </div>
          <h1 className='text-center mt-5 ' style={{fontSize:'100px'}}>Welcome to <span className='text-warning'>HireMate!</span></h1>
          <p className='text-center fs-4'>Discover skilled freelancers from various fields like web development, graphic design, and more.Browse profiles, check portfolios, and hire professionals tailored to your needs.Your perfect freelancer match is just a click away—let's get started!</p>
          <div className="row mt-5 p-3" style={{alignItems:'center'}}>
            <div className="col-7">
              <img src={freelauncerslist} alt="" style={{width:'100%',border:'1px solid white',borderRadius:'20px'}} />
            </div>
            <div className="col-5">
              <p>HireMate, where you can connect with talented freelancers from various fields like logo design, web development, content writing, and more. Our platform showcases detailed profiles of each freelancer, highlighting their skills and experience to help you find the right person for your project. Hiring is simple and hassle-free – just browse, connect, and collaborate to bring your ideas to life. Join us and discover the perfect freelancer to turn your vision into reality!</p>
            </div>
          </div>

          <div className="row mt-5 p-3" style={{alignItems:'center'}}>
            <div className="col-6">
              <p>The clients or hirers whose requests you’ve accepted. Each card provides essential details about the client, including their username, full name, email address, and role. A convenient "Message" button is included to initiate communication and collaborate seamlessly on the project. Stay connected and keep track of your active collaborations with ease!</p>
            </div>
            <div className="col-6">
              <img src={accptedCard} alt="" style={{width:'90%',border:'1px solid white',borderRadius:'20px'}} />
            </div>
          </div>

          <div className="row mt-5 p-3" style={{alignItems:'center'}}>
            <div className="col-5">
              <img src={chatbox} alt="" style={{width:'90%',border:'1px solid dark',borderRadius:'20px'}} />
            </div>
            <div className="col-7">
              <p>This is the messaging feature that allows seamless communication between freelancers and clients. The chat interface displays the conversation history in a clean and organized manner, with timestamps for each message. The sender’s messages are displayed in white, while your replies are in blue for easy distinction. At the bottom, there’s a text input box with a "Send" button, enabling real-time collaboration and efficient project discussions. This feature ensures clear communication and fosters a professional connection between parties.</p>
            </div>
          </div>

          <div className="row mt-5 p-3" style={{alignItems:'center'}}>
            <div className="col-6">
              <p>The user has the option to either "Accept" or "Ignore" the request. This design is clean and simple, with clear calls to action, making it easy for users to quickly review and respond to incoming requests.</p>
            </div>
            <div className="col-6">
              <img src={requestedCard} alt="" style={{width:'90%',border:'1px solid white',borderRadius:'20px'}} />
            </div>
          </div>

          <div className="row mt-5 p-3" style={{alignItems:'center'}}>
            <div className="col-5">
              <img src={freelauncerprofile} alt="" style={{width:'90%',border:'1px solid white',borderRadius:'20px'}} className='p-3'/>
            </div>
            <div className="col-7">
              <p>User profile on an online platform. It includes essential information like the user's name, username, a professional rating, a brief description, contact details, and a list of skills.A "Portfolio" section suggests that the user has a collection of work samples available for viewing.</p>
            </div>
          </div>

          <h5 className='text-center mt-5 mb-3 text-warning'>Thank you for visiting our site! We are committed to providing you with the best experience, whether you're here for design inspiration, innovative solutions, or personalized services. Explore further, and let us help bring your vision to life. Feel free to reach out to us with any questions, and stay connected for exciting updates and new offerings!</h5>
        </div>
      ) : (
        <div className="p-5">
          <h1 className="text-center fs-1 p-3 m-5">
            Welcome to <span className="text-warning">HireMate</span>, {curruser.name}
          </h1>
          <h3 className='text-center'> <span className='text-info '>HireMate – Your Trusted Freelance Marketplace</span></h3>
          <p className='text-center'>At HireMate, we bring together talented freelancers and businesses looking for top-tier professionals. Whether you’re a freelancer seeking new opportunities or a hirer looking for skilled talent, HireMate offers a seamless platform to connect, collaborate, and grow.</p>
          <div className="row my-5">
            <div className="col-6 p-3">
            <p> <span className='fs-3 text-info'>For Freelancers:</span> <br />
            Explore a wide range of freelance job opportunities tailored to your skills and expertise. From tech and design to marketing and writing, HireMate provides a variety of projects across industries. Create your profile, showcase your portfolio, and get hired by clients who value your work.</p>
            </div>
            <div className="col-6 p-3">
            <p> <span className='fs-3 text-info'>For Hirers:</span> <br />
            Hire talented professionals to bring your projects to life. Whether you need a one-time freelancer or long-term collaborations, HireMate connects you with skilled experts across various domains. Post a job, evaluate profiles, and start collaborating on your project within no time.</p>
            </div>
          </div>
          {curruser.role !== 'Freelauncer' ? (
            <>
             <h2 className='mb-3'>Our FreeLancers:</h2>
          <div
            className="row no-scrollbar gap-3"
            style={{
              overflowX: 'auto',
              display: 'flex',
              flexWrap: 'nowrap',
            }}
            ref={scrollContainerRef}
          >
            {freelancer.map((freeLauncer, index) => (
              <div className="col-4  mb-4 text-dark" key={index}>
                <div
                  className="container p-4 profileFreelancer"
                  style={{ backgroundColor:'#C9E9D2', borderRadius: '20px' ,cursor:'pointer'}}
                  onClick={()=>postProfile(freeLauncer)}
                >
                  <div className="d-flex gap-2">
                    <FaUserCircle className="fs-2" />
                    <p className="mt-1">{freeLauncer.username}</p>
                  </div>
                  <hr style={{marginTop:'-5px'}} />
                  <p>Name: {freeLauncer.name}</p>
                  <p>Proficiency: {freeLauncer.proficiency}</p>
                  <p>
                    Description:{' '}
                    {freeLauncer.description !== "" ? freeLauncer.description : <>NULL</>}
                  </p>
                  {freeLauncer.pendingRequests.find((req)=>(req.username === curruser.username)) !=null ? (
                    <button className="btn btn-warning text-dark">Request sent</button>
                  ):(
                    <>
                    {console.log(freeLauncer)}
                    {freeLauncer.acceptedRequests.find((req)=>(req.username === curruser.username)) !=null? (
                      <button className="btn btn-success text-white">Request Accepted</button>
                    ):(
                      <button className="btn btn-dark text-white" onClick={()=>{friendReq(freeLauncer.username,curruser.username)}}>Hire {freeLauncer.name}</button>
                    )}
                    
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="d-flex justify-content-end gap-2 align-items-end">
            <button
              className="btn btn-outline-warning"
              style={{borderRadius:"50%",width:'50px',height:'50px'}}
              onClick={() => scrollButtons('left')}
            >
              <FaArrowLeft />
            </button>
            <button
              className="btn btn-outline-warning"
              style={{borderRadius:"50%",width:'50px',height:'50px'}}
              onClick={() => scrollButtons('right')}
            >
              <FaArrowRight />
            </button>
          </div>
            </>
          ):(
            <>
             <div className="row" style={{alignItems:'center',justifyContent:'center'}}>
              <div className="col-6">
              <h2 className='text-warning mt-3'>Your rating:</h2>
               {ratingList
                .filter((rating) => rating.username === curruser.username)
                .map((rating, index) => (
                <p key={index} className="text-secondary">
                 <h1 style={{fontSize:'100px'}}>{rating.rating.averageRating.toFixed(2) || 'N/A'}/5<AiOutlineRise className='text-warning' /></h1>(Total Ratings: {rating.rating.totalRatings || 0})
                </p>
                ))}
              </div>
              <div className="col-6">
                <h2 className="text-warning mt-3">Jobs Which You Have Done:</h2>
                {currFreeLancersJobDoneList && currFreeLancersJobDoneList.length > 0 ? (
                <ul style={{listStyleType:'none'}}>
                  {currFreeLancersJobDoneList.map((job, index) => (
                  <li key={index} className="text-secondary"><FaLocationArrow className='mx-3 text-info' /> 
                  <span className='fs-4'>{job.payload.join(' -- ')}</span>
                  </li>
                  ))}
                </ul>
                ) : (
                  <p className="text-danger">No jobs found.</p>
                )}
              </div>
             </div>
            </>
          )}
         
        </div>
      )}
    </div>
  );
}

export default Home;
