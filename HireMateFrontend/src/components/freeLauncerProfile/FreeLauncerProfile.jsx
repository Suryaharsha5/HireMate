import React, { useContext, useState, useEffect } from "react";
import { FreelancerProfile } from "../../context/freeLancerProfileContext";
import { usercontext } from "../../context/userLoginContext";
import { FaUserCircle, FaStar } from "react-icons/fa";
import { FiLink } from "react-icons/fi";

function FreeLancerProfile() {
  const { currFreelancer } = useContext(FreelancerProfile);
  const { curruser } = useContext(usercontext);

  const [ratingList, setRatingList] = useState([]);
  const [jobDoneList, setJobDoneList] = useState([]);
  const [currFreeLancersJobDoneList, setFreelancersJobDoneList] = useState([]);
  const [displayRatings, setDisplayRatings] = useState(null);

  useEffect(() => {
    async function getTheRatings() {
      try {
        const res = await fetch("https://hire-mate-mcte.vercel.app/user-api/getAllRatings");
        const result = await res.json();
        if (result.message === "Ratings List fetched") {
          setRatingList(result.payload);
        }
      } catch (error) {
        console.error("Error fetching ratings:", error);
      }
    }
    getTheRatings();
  }, []);

  useEffect(() => {
    async function getJobDoneList() {
      try {
        const res = await fetch("https://hire-mate-mcte.vercel.app/user-api/getjobList");
        const result = await res.json();
        if (result.message === "Job List fetched successfully") {
          setJobDoneList(result.list);
        }
      } catch (error) {
        console.error("Error fetching job list:", error);
      }
    }
    getJobDoneList();
  }, []);

  useEffect(() => {
    const freelancerRatings = ratingList.find(
      (ele) => ele.username === currFreelancer?.username
    );
    setDisplayRatings(freelancerRatings?.rating || null);
  }, [ratingList, currFreelancer]);

  if (!currFreelancer) {
    return (
      <div className="container" style={{ paddingTop: "100px" }}>
        <h2>No Freelancer Selected</h2>
        <p>Please select a freelancer to view their profile.</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: "100px" }}>
      <div className="row justify-content-center pt-5">
        <div className="col-md-4 col-12 text-center">
          {currFreelancer.profilePicture ? (
            <img
              src={currFreelancer.profilePicture}
              alt="Profile"
              className="img-fluid rounded-circle"
              style={{ width: "200px", height: "200px" }}
            />
          ) : (
            <FaUserCircle
              className="fs-1 text-white"
              style={{ width: "200px", height: "200px" }}
            />
          )}
        </div>
        <div className="col-md-8 col-12">
          <h2>
            {currFreelancer.name}{" "}
            <span className="fs-6 text-info">@{currFreelancer.username}</span>
          </h2>
          {displayRatings ? (
            <h4 className="text-warning">
              <FaStar className="mb-1 mx-1" />
              {displayRatings.averageRating.toFixed(2)} ({displayRatings.totalRatings})
            </h4>
          ) : (
            <h4 className="text-muted">No Ratings Available</h4>
          )}
          <div className="pt-3">
            <h4>Proficiency</h4>
            <p>{currFreelancer.proficiency}</p>
          </div>
          <div className="pt-3">
            <h4>Description</h4>
            <p>{currFreelancer.description || "No description available"}</p>
          </div>
        </div>
      </div>

      <div className="pt-5">
        <h3>Contact</h3>
        <p>Email: {currFreelancer.email || "Not provided"}</p>
        <p>Location: {currFreelancer.location || "Not specified"}</p>
      </div>

      <div className="pt-5">
        <h3>Skills</h3>
        <div className="d-flex flex-wrap gap-3">
          {currFreelancer.skills?.length > 0 ? (
            currFreelancer.skills.map((skill, index) => (
              <span key={index} className="badge bg-secondary p-3 fs-5">
                {skill}
              </span>
            ))
          ) : (
            <p>No skills listed</p>
          )}
        </div>
      </div>

      <div className="pt-5">
        <h3>Portfolio</h3>
        <div className="row">
          {currFreelancer.portfolio? (
            <a className="mb-3" href={currFreelancer.portfolio}><FiLink  className=" fs-1 text-white"/></a>
          ) : (
            <p>No portfolio items available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default FreeLancerProfile;
