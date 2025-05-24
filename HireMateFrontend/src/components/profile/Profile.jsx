import React, { useState, useContext, useEffect, useRef } from 'react';
import { usercontext } from '../../context/userLoginContext';
import { useForm } from 'react-hook-form';
import { FaEdit, FaUserCircle, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { TiTick } from 'react-icons/ti';
import { GiCrossMark } from 'react-icons/gi';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { HiMiniHandThumbUp } from "react-icons/hi2";
import { HiMiniHandThumbDown } from "react-icons/hi2";
import Axios from 'axios';
import { ImCloudUpload } from "react-icons/im";
import './Profile.css';
import { RiDeleteBin6Fill } from "react-icons/ri";

function Profile() {
  const { curruser, setCurruser,loginStatus } = useContext(usercontext);
  const [showModal, setShowModal] = useState(false);
  const [description1, setDescription] = useState(curruser.description || '');
  const { handleSubmit, register,reset } = useForm();
  const scrollContainerRef = useRef(null);
  let [reciever,setReciever]=useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  let [messageDisplay,setMessageDisplay]=useState([]);
  let [jobDoneList,setJobDoneList]=useState([]);
  let [cloudinaryImages,setCloudinaryImages]=useState([]);
  const [selectedRating, setSelectedRating] = useState(0); 
  const [is,setIs]=useState(false);
  const [progfileImage,setProfileImage]=useState('');
  const [profileImageModal,setProfileImageModal]=useState(false);
  function togglerateModal(data){
      setReciever(data)
      setIs(!is);
      setSelectedRating(0);
  }

  function showImage(url){
    setProfileImage(url);
    setProfileImageModal(true);
  }

  async function deleteImage(publicId) {
    try {
      const response = await fetch(
        `https://hire-mate-mcte.vercel.app/image-api/delete-image/${encodeURIComponent(publicId)}`,
        { method: 'DELETE' }
      );
  
      console.log("Public ID:", publicId); // Debug log
      const result = await response.json();
  
      if (response.ok) {
        alert(result.message);
        getImage(); // Refresh the image list
      } else {
        console.error("Failed to delete image:", result);
        alert("Failed to delete the image. Please try again.");
      }
    } catch (error) {
      console.error("Error during image deletion:", error);
      alert("An error occurred while trying to delete the image.");
    }
  }

  async function getImage() {
    try {
      const response = await fetch('https://hire-mate-mcte.vercel.app/image-api/get-images');
      const result = await response.json();
  
      if (result.data) {
        // Map the data to extract necessary details
        const formattedImages = result.data.map((image) => {
          let username = 'Anonymous'; // Default value
          if (image.context?.user_info) {
            try {
              // Parse the stringified JSON object
              const userInfo = JSON.parse(image.context.user_info);
              username = userInfo.username || 'Anonymous'; // Fallback to 'Anonymous' if username is missing
            } catch (error) {
              console.error('Failed to parse user_info:', error);
            }
          }
  
          return {
            url: image.url, // Image URL
            user: username, // Extracted username
            public_id:image.public_id
          };
        });
  
        console.log(formattedImages); // Debug: Verify the formatted data
        setCloudinaryImages(formattedImages); // Update state with formatted data
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  }

  useEffect(()=>{
    if(loginStatus)
    getImage();
  },[loginStatus])

  function onInputChange(files) {
    const formData = new FormData();
    formData.append('file', files[0]);
    formData.append('upload_preset', 'em3a0pap');
    formData.append('folder', 'profiles_hiremate');
  
    // Directly construct the userInfo object
    const userInfo = { username: curruser.username };
    formData.append('context', `user_info=${JSON.stringify(userInfo)}`);
  
    Axios.post('https://api.cloudinary.com/v1_1/dtgqfjyrr/image/upload', formData)
      .then((response) => {
        console.log('Upload Successful:', response.data);
        alert('Your profile was uploaded successfully.');
        getImage();
      })
      .catch((error) => {
        console.error('Upload Failed:', error);
        alert('Failed to upload your profile. Please try again.');
      });
  }

  const onSubmit = async (data) => {
    try {
      const ratingData = {
        username: reciever.username,
        newRating: selectedRating,
        feedback: data.feedback || 'No comment provided',
        ratedByUser:curruser.username
      };
      console.log(reciever.username)
  
      const response = await fetch('https://hire-mate-mcte.vercel.app/user-api/updateRating', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ratingData),
      });
  
      const result = await response.json();
      if (result.message === 'Rating updated successfully') {
        alert('Rating submitted successfully!');
        reset();
        setSelectedRating(0);
        togglerateModal();
      }else if(result.message === 'You have already rated this user.'){
              alert('You have already rated this user.')
      }
      else {
        alert(result.message || 'Failed to submit rating.');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };


  const handleRatingClick = (rating) => {
    setSelectedRating(rating); 
  };

  function toggleModal(data){
    setReciever(data);
    setIsModalOpen((prev) => !prev);
  };

  useEffect(() => {
    setDescription(curruser.description);
  }, [curruser]);


  async function jobDone(respectiveUser) {
    const data = { payload: [respectiveUser, curruser.username] };
    let confirmationJob = confirm("Is the job done?");
    if (confirmationJob) {
      try {
        let res = await fetch('https://hire-mate-mcte.vercel.app/user-api/jobdonelist', {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        const result = await res.json();
        if (result.message === 'Job List updated successfully') {
          setJobDoneList((prev) => [
            ...prev,
            ...data.payload
          ]);
        } else {
          alert('Failed to update the job list. Please try again.');
        }
      } catch (error) {
        console.error('Error during update:', error);
      }
    }
  }
  
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
  }, [jobDone]);

  async function messageSubmission(data) {
    const messageObject = {
      participants: [curruser.username, reciever.username],
      messages: [
        {
          message: data.msg,
          timestamp: new Date().toISOString(),
          whoseMessage: curruser.username,
        }
      ],
    };
    
    try {
      const res = await fetch('https://hire-mate-mcte.vercel.app/user-api/messagePost',{
        method:"POST",
        headers:{'Content-Type' : 'application/json'},
        body:JSON.stringify(messageObject)
      })

      const result = await res.json();
      if(result.message === 'New conversation started' || result.message === 'Message added successfully'){
        setMessageDisplay((prevMessages) => [
          ...prevMessages,
          ...messageObject.messages,
        ]);
        reset(); 
      }
    } catch (error) {
      console.error('Error during update:', error);
    }
  }
  
  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch(
          `https://hire-mate-mcte.vercel.app/user-api/getmessage/${curruser.username}/${reciever.username}`
        );
        const result = await res.json();
        if (result.message === 'Messages are fetched' || result.message === 'No conversation found between the specified users.') {
          setMessageDisplay(result.payload);
        }
      } catch (error) {
        console.error('Error during fetching:', error);
      }
    }
    fetchMessages();
  }, [curruser?.username, reciever?.username]);
  

  async function deleteResponse(hirerUsername, freelancerUsername) {
    try {
      const res = await fetch(
        `https://hire-mate-mcte.vercel.app/user-api/deleteResponse/${hirerUsername}/${freelancerUsername}`,
        { method: 'DELETE' }
      );
      const result = await res.json();
      if (result.message === 'Response successfully deleted') {
        const updatedResponses = [...curruser.responses].filter(
          (response) => response.username !== freelancerUsername && response.state !== 0
      );      
        setCurruser({ ...curruser, responses: updatedResponses });
        alert('Response deleted successfully');
      } else {
        alert(result.message);
      }

    } catch (error) {
      console.error('Error deleting response:', error);
    }
  }

  async function friendAccepted(data, hirer, freelancer) {
    try {
      const res = await fetch(
        `https://hire-mate-mcte.vercel.app/user-api/friendAccepted/${freelancer}/${hirer}/${data}`,
        { method: 'DELETE' }
      );
      const result = await res.json();
  
      if (result.message === 'Friend request successfully updated') {
        const updatedRequests = [...curruser.pendingRequests].filter(
          (request) => request.details.username !== hirer
        );
  
        const hirerDetails = curruser.pendingRequests.find(
          (request) => request.details.username === hirer
        )?.details;
  
        const updatedAcceptedRequests =
          data === 'Accepted'
            ? [...curruser.acceptedRequests, { username: hirer, details: hirerDetails }]
            : curruser.acceptedRequests;
  
        setCurruser({
          ...curruser,
          pendingRequests: updatedRequests,
          acceptedRequests: updatedAcceptedRequests,
        });
  
        alert(`Request has been ${data.toLowerCase()} by ${hirer}`);
      } else {
        alert(`An error occurred: ${result.message}`);
      }
    } catch (error) {
      console.error('Error during updation:', error);
    }
  }
  

  function scrollButtons(direction) {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: direction === 'left' ? -300 : 300, behavior: 'smooth' });
    }
  }

  async function handleDescriptionChange(e) {
    setShowModal(false);  
    const { location, portfolio, skills,description } = e;
    const updatedUser = { ...curruser, description: e.description ,location:e.location,portfolio:e.portfolio,skills:e.skills};
    setCurruser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    try {
      const res = await fetch('https://hire-mate-mcte.vercel.app/user-api/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: curruser.username,
          location,
          portfolio,
          skills,
          description
        }),
      });
  
      const result = await res.json();
      if (result.message === 'User updated successfully') {
        alert('Description and other details updated');
      } else {
        alert(result.message || 'An error occurred');
      }
    } catch (error) {
      console.error('Error during update:', error);
    }
  }
  

  return (
    <div className="container p-5">
      <h2 className="text-center mb-4" style={{marginTop:'80px'}}>Profile</h2>
      <div
        className="profile-card mb-4"
        style={{ border: '1px solid #ccc', borderRadius: '10px', padding: '20px' }}
      >
        <div className="d-flex justify-content-center mb-4">
             {cloudinaryImages.find((ele) => ele.user === curruser.username) ? (
              <>
              <img
               onClick={()=>showImage(cloudinaryImages.find((ele) => ele.user === curruser.username)?.url)}
               src={cloudinaryImages.find((ele) => ele.user === curruser.username)?.url}
               alt="User Avatar"
               className="rounded-circle"
               style={{ width: '120px', height: '120px', objectFit: 'cover' ,cursor:'pointer'}}
              />
              <RiDeleteBin6Fill
                        onClick={() => deleteImage(cloudinaryImages.find((ele) => ele.user === curruser.username)?.public_id)}
                        style={{ cursor: 'pointer', borderRadius: '50%', padding: '4px',marginLeft:'-40px' ,fontSize:'35px'}}
                        className="text-info bg-white mb-3"
               />
            </>
          ) : (
        <>
        <img
        src={`https://ui-avatars.com/api/?name=${curruser.username}&background=random`}
        alt="User Avatar"
        className="rounded-circle"
        style={{ width: '120px', height: '120px', objectFit: 'cover' }}
        />
        <label 
        htmlFor="fileupload" 
        className="a" 
        style={{ cursor: 'pointer' }}
        >
        <ImCloudUpload style={{ fontSize: '50px', marginLeft: '-40px' }} className="text-light" />
        </label>
        <input 
        id="fileupload"
        accept="image/*"
        type="file"
        onChange={(event) => onInputChange(event.target.files)}
        style={{ display: 'none' }} 
        />
        </>
        )}
        </div>

        {curruser.role === 'Freelauncer' ? (
          <FaEdit
          className='mb-3'
          onClick={() => setShowModal(true)}
          style={{ fontSize:'40px',padding:'5px',cursor: 'pointer'}}
         />
         ) :(null)}
        <div className="mb-3">
          <strong className='text-warning fs-3'>Username: </strong>
          <span className='fs-5'>{curruser.username}</span>
        </div>
        <div className="mb-3">
          <strong className='text-warning fs-3'>Name: </strong>
          <span className='fs-5'>{curruser.name}</span>
        </div>
        <div className="mb-3">
          <strong className='text-warning fs-3'>Email: </strong>
          <span className='fs-5'>{curruser.email}</span>
        </div>
        <div className="mb-3">
          <strong className='text-warning fs-3'>Role: </strong>
          <span className='fs-5'>{curruser.role}</span>
        </div>
        {curruser.role === 'Freelauncer' ? (
          <>
            <div className="mb-3">
              <strong className='text-warning fs-3'>Description: </strong>
              <span className='fs-5'>{description1 || 'No description available'}</span>{' '}
            </div>
            <div className="mb-3">
              <strong className='text-warning fs-3'>Proficiency:</strong>
              <span className='fs-5'>{curruser.proficiency || 'No description available'}</span>{' '}
            </div>
            <div className="mb-3">
              <strong className='text-warning fs-3'>Location: </strong>
              <span className='fs-5'>{curruser.location|| 'No location available'}</span>{' '}
            </div>
            <div className="mb-3">
              <strong className='text-warning fs-3'>Skills: </strong>
              {console.log("skills: "+curruser.skills)}
              <span className='fs-5'>{curruser.skills?.join(', ') || 'No skills available'}</span>{' '}
            </div>
          </>
        ) : null}
      </div>
      {curruser.role === 'Freelauncer' ? (
        <>
        <h2 className='text-warning mt-5 mb-3'>Requests yet to be accepted</h2>
          <div
            className="row no-scrollbar gap-3"
            style={{
              overflowX: 'auto',
              display: 'flex',
              flexWrap: 'nowrap',
            }}
            ref={scrollContainerRef}
          >
                {curruser.pendingRequests && curruser.pendingRequests.length > 0 ? (
                  curruser.pendingRequests.map((request, index) => (
                <div className="col-4  mb-4 text-dark" key={index}>
                <div
                  className="container p-4 "
                  style={{ backgroundColor:'#C9E9D2', borderRadius: '20px' }}
                >
                  <div className="d-flex gap-2 ">
                    <FaUserCircle className="fs-2" />
                    <p className="mt-1">{request.username}</p>
                  </div>
                  <hr style={{marginTop:'-5px'}} />
                  <p>Name: {request.details.name}</p>
                  <button className="btn btn-success text-white mx-1" onClick={()=>{friendAccepted('Accepted',request.details.username,curruser.username)}}>Accept</button>
                  <button className="btn btn-danger text-white mx-1" onClick={()=>{friendAccepted('Ignored',request.details.username,curruser.username)}}>Ignore</button>
                </div>
              </div>
                  ))
                ) : (
                  <p>No pending requests</p>
                )}
          </div>

          <div className="d-flex justify-content-end gap-2 align-items-end position-">
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

          <h2 className="text-success mt-5 mb-3">Accepted Requests</h2>
          <div
           className="row no-scrollbar gap-3"
           style={{
           overflowX: 'auto',
           display: 'flex',
           flexWrap: 'nowrap',
           }}
          >
          {curruser.acceptedRequests && curruser.acceptedRequests.length > 0  ? (
            curruser.acceptedRequests.map((request, index) => (
            <div className="col-4 mb-4 text-dark" key={index}>
            <div
              className="container p-4"
              style={{ backgroundColor: '#D4EDDA', borderRadius: '20px' }}
            >
            <div className="d-flex gap-2">
            <FaUserCircle className="fs-2" />
            <p className="mt-1">{request.username}</p>
            </div>
            <hr style={{ marginTop: '-5px' }} />
            <p>Name: {request.details.name}</p>
            <p>Email: {request.details.email}</p>
            <p>Role: {request.details.role}</p>
            <button className="btn btn-outline-info" onClick={()=>{toggleModal(request)}}>Message</button>
            {jobDoneList.find((ele) => ele.payload && ele.payload.includes(request.username) && ele.payload.includes(curruser.username)) === undefined ? (null):(
              <button className="btn btn-success mx-3">Job Done</button>
            )}
            </div>
            </div>
          ))
        ) : (
            <p>No accepted requests</p>
          )}
        </div>
        </>
      ):(
        <>
          <h2 className='text-warning'>Responses for the requests</h2>
          <div
            className="row no-scrollbar gap-3"
            style={{
              overflowX: 'auto',
              display: 'flex',
              flexWrap: 'nowrap',
            }}
            ref={scrollContainerRef}
          >
                {curruser.responses && curruser.responses.length > 0 ? (
                  curruser.responses.map((request, index) => (
                <div className="col-4  mb-4 text-dark" key={index}>
                <div
                  className="container p-4 "
                  style={{ backgroundColor:'#C9E9D2', borderRadius: '20px' }}
                >
                  <div className="d-flex gap-2 ">
                    <FaUserCircle className="fs-2" />
                    <p className="mt-1">{request.username}</p>
                  </div>
                  <hr style={{marginTop:'-5px'}} />
                  {request.state === 1 ?(
                    <>
                      <p className='text-success fs-3'>Accepted <TiTick className='fs-2' /></p>
                      <button className="btn btn-outline-info" onClick={()=>{toggleModal(request)}}>Message</button>
                      {jobDoneList.find((ele) => ele.payload && ele.payload.includes(request.username) && ele.payload.includes(curruser.username)) === undefined ? (
                          <button className="btn btn-outline-success mx-3" onClick={() => { jobDone(request.username) }}>Click if the Job done</button>
                          ) : (
                            <>
                              <button className="btn btn-warning mx-3">Job Done</button>
                              <button className="btn btn-danger mx-3" onClick={()=>togglerateModal(request)}>Rate</button>
                            </>
                      )}

                    </>
                  ):(
                    <>
                      <div className="d-flex">
                      <p className='text-danger mx-3 fs-3'>Rejected <GiCrossMark  className='fs-2'/></p>
                      <RiDeleteBin6Line className='text-danger fs-3 mt-2' style={{cursor:'pointer'}} onClick={()=>{deleteResponse(curruser.username,request.username)}}/>
                      </div>
                    </>
                  )}
                </div>
              </div>
                  ))
                ) : (
                  <p>No pending requests</p>
                )}
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
      )}


     {isModalOpen && (
  <div
    className="modal fade show"
    tabIndex="-1"
    style={{ display: 'block' }}
    aria-modal="true"
    role="dialog"
  >
    <div className="modal-dialog modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title text-black">Chat with {reciever.username}</h5>
          <button
            type="button"
            className="btn-close"
            onClick={toggleModal}
            aria-label="Close"
          ></button>
        </div>
        <div className="modal-body">
          {/* Chat Messages */}
          <div
            className="chat-messages overflow-auto mb-3"
            style={{
              maxHeight: '400px',
              border: '1px solid rgb(86, 96, 107)',
              borderRadius: '8px',
              padding: '10px',
            }}
          >
            {/* Map through messages to display */}
            {messageDisplay.map((message, index) => (
              <div
                key={index}
                className={`d-flex mb-2 ${
                  message.whoseMessage === curruser.username
                    ? 'justify-content-end'
                    : 'justify-content-start'
                }`}
              >
                <div
                  className={`p-2 rounded shadow-sm ${
                    message.whoseMessage === curruser.username
                      ? 'bg-primary text-white'
                      : 'bg-light text-dark'
                  }`}
                >
                  <small>
                    <strong>
                      {message.whoseMessage === curruser.username
                        ? 'You'
                        : message.whoseMessage}
                      :
                    </strong>
                    <small className="text-muted">
                    {'   '+new Date(message.timestamp).toLocaleString()}
                    </small>
                  </small>
                  <p className="mb-0">{message.message}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit(messageSubmission)}>
            <div className="d-flex align-items-center">
              <textarea
                id="msg"
                className="form-control me-2"
                rows="3"
                placeholder="Type your message..."
                {...register('msg')}
              />
              <button type="submit" className="btn btn-primary">
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
      )}

      {is && (
      <div
        className="modal fade show"
        tabIndex="-1"
        style={{ display: 'block' }}
        aria-modal="true"
        role="dialog"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-black">Rate {reciever.username}</h5>
              <button
                type="button"
                className="btn-close"
                onClick={togglerateModal}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {/* Rating with Fire Icons */}
              <div className="rating-icons mb-3">
                <h6 className="text-black">Rate {reciever.username}:</h6>
                <div className="d-flex">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <span
                      key={rating}
                      onClick={() => handleRatingClick(rating)}
                      style={{
                        cursor: 'pointer',
                        fontSize: '30px',
                        marginRight:'5px',
                        color: rating <= selectedRating ? 'red' : '#ccc',
                      }}
                    >
                      {rating <= selectedRating ? (
                        <HiMiniHandThumbUp />
                      ):(
                        <HiMiniHandThumbDown />
                      )}
                      
                    </span>
                  ))}
                </div>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label htmlFor="feedbackInput" className="form-label">
                    Leave a comment (optional):
                  </label>
                  <textarea
                    id="feedbackInput"
                    className="form-control"
                    rows="3"
                    placeholder="Write your feedback here..."
                    {...register('feedback')}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={selectedRating === 0} 
                >
                  Submit Rating
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    )}
 

 {showModal && (
  <div
    className="modal fade show"
    tabIndex="-1"
    style={{ display: 'block' }}
    aria-modal="true"
    role="dialog"
  >
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title text-black">Edit Job Description</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowModal(false)}
            aria-label="Close"
          ></button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit(handleDescriptionChange)}>
            
            <div className="mb-3">
              <label htmlFor="description" className="form-label text-dark">
                New Description
              </label>
              <textarea
                id="description"
                className="form-control"
                rows="4"
                {...register('description')}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="location" className="form-label text-dark">
                Location
              </label>
              <input
                type="text"
                id="location"
                className="form-control"
                placeholder="Enter location"
                {...register('location')}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="portfolio" className="form-label text-dark">
                Portfolio URL
              </label>
              <input
                type="url"
                id="portfolio"
                className="form-control"
                placeholder="Enter portfolio URL"
                {...register('portfolio')}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="skills" className="form-label text-dark">
                Skills (separate with commas)
              </label>
              <input
                type="text"
                id="skills"
                className="form-control"
                placeholder="E.g., Web Development, Graphic Design, Data Analysis"
                {...register('skills', {
                  setValueAs: (value) => value.split(',').map((skill) => skill.trim()),
                })}
              />
            </div>

            <div className="text-center">
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
)}


{profileImageModal && (
  <div
    className="modal fade show"
    tabIndex="-1"
    style={{ display: 'block'}}
    aria-modal="true"
    role="dialog"
    
  >
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          {/* <h5 className="modal-title text-black">Profile</h5> */}
          <button
            type="button"
            className="btn-close"
            onClick={() => setProfileImageModal(false)}
            aria-label="Close"
          ></button>
        </div>
        <div className="modal-body text-center">
          <img src={progfileImage} alt="" style={{width:'400px',height:'500px',borderRadius:'100%'}}/>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default Profile;