import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
      <img src={assets.logo} alt="" />
      <p>Discover the taste of tradition with our healthy, handcrafted Indian sweets. Made with natural ingredients and delivered fresh to your doorstep, our sweets bring the joy of home in every bite.</p>
      <div className="footer-social-icons">
        <img src={assets.facebook_icon} alt="" />
        <img src={assets.twitter_icon} alt="" />
        <img src={assets.linkedin_icon} alt="" />
      </div>
        </div>
         <div className="footer-content-center">
        <h2>COMPANY</h2>
        <ul>
          <li>Faq's</li>
          <li>Delivery</li>
          <li>Privacy Policy</li>
          <li>Terms of Use</li>
        </ul>
        </div>
        <div className="footer-content-right">
        <h2>GET IN TOUNCH</h2>
        <ul>
          <li>+91-9010545078</li>
          <li>contact@domain.com</li>
        </ul>
        </div>
      </div>
      <hr />
      <p className='footer-copyright'>Copyright 2025 | All Right Reserved.</p>
    </div>
  )
}

export default Footer
