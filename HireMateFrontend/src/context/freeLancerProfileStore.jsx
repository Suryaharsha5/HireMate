import React from 'react'
import { useState, useEffect } from "react";
import { FreelancerProfile } from './freeLancerProfileContext'

function FreeLancerProfileStore( {children} ) {
  const [currFreelancer, setCurrFreelancer] = useState(
    JSON.parse(localStorage.getItem("currentFreelancer")) || null
  );

  function showProfile(data) {
    setCurrFreelancer(data);
    localStorage.setItem("currentFreelancer", JSON.stringify(data));
  }

  return (
    <FreelancerProfile.Provider value={{ currFreelancer, showProfile }}>
      {children}
    </FreelancerProfile.Provider>
  );
}

export default FreeLancerProfileStore;