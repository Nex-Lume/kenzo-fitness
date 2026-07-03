
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../kenzo-scoped.css'; // Scoped to .kenzo-wrapper only — safe for all pages

// Icon URLs mapped by plan index (cycles if more than 4 plans)
const PLAN_ICONS = [
  'https://img.icons8.com/?size=100&id=UvNzKrFSVWpu&format=png&color=40C057',
  'https://img.icons8.com/?size=100&id=w315WEjkDc9E&format=png&color=40C057',
  'https://img.icons8.com/?size=100&id=9794&format=png&color=40C057',
  'https://img.icons8.com/?size=100&id=SVDyBGtEbeFh&format=png&color=40C057',
];

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [flippedId, setFlippedId] = useState(null);

  const toggleFlip = (id) => setFlippedId(prev => prev === id ? null : id);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Fetch membership plans from backend
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get(
          (import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + '/plans'
        );
        if (res.data && res.data.data && res.data.data.length > 0) {
          setPlans(res.data.data);
        }
      } catch (err) {
        console.warn('Could not load plans from backend, using defaults:', err.message);
      } finally {
        setPlansLoading(false);
      }
    };
    fetchPlans();
  }, []);

  useEffect(() => {
    // Dynamically load the kenzo.js script
    const script = document.createElement('script');
    script.src = '/kenzo.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if(document.body.contains(script)) {
        document.body.removeChild(script);
      }
    }
  }, []);

  return (
    <div className="kenzo-wrapper">
      
    
    <header>
        <nav>
            <div className="logo">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqQ0XxwXAPcD3YCcan5T0oiEuwcuc-WADPsA&s" alt="FITusion Logo" className="logo-img" />
                <a href="#hero"><span>Kenzo Fitness</span></a>
            </div>
            <ul className="nav-links">
                <li><a href="#hero" className="nav-link active">Home</a></li>
                <li><a href="#about" className="nav-link">About</a></li>
                <li><a href="#programs" className="nav-link">Plans</a></li>
                <li><a href="#trainers" className="nav-link">Trainers</a></li>
                <li><a href="#training" className="nav-link">Exercise</a></li>
            </ul>
            <div className="header-buttons">
                {user ? (
                    <>
                        <Link to={user.role === 'admin' ? '/admin' : user.role === 'trainer' ? '/trainer' : '/dashboard'} className="btn-contact">Dashboard</Link>
                        <button onClick={handleLogout} className="btn-started" style={{ cursor: 'pointer', border: 'none' }}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="btn-contact">Login</Link>
                        <Link to="/admission" className="btn-started">Get Started</Link>
                    </>
                )}
            </div>
            <div className="hamburger" id="hamburger">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </nav>

        
        <div className="mobile-menu" id="mobileMenu">
            <a href="#hero" className="nav-link active">Home</a>
            <a href="#about" className="nav-link">About</a>
            <a href="#programs" className="nav-link">Plans</a>
            <a href="#trainers" className="nav-link">Trainers</a>
            <a href="#training" className="nav-link">Exercise</a>
            <div className="header-buttons">
                {user ? (
                    <>
                        <Link to={user.role === 'admin' ? '/admin' : user.role === 'trainer' ? '/trainer' : '/dashboard'} className="btn-contact" onClick={() => document.getElementById('mobileMenu').classList.remove('active')}>Dashboard</Link>
                        <button onClick={handleLogout} className="btn-started" style={{ cursor: 'pointer', border: 'none' }}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="btn-contact">Login</Link>
                        <Link to="/admission" className="btn-started">Get Started</Link>
                    </>
                )}
            </div>
        </div>
    </header>


    

    <section className="hero" id="hero">
        <div className="container">
            <div className="hero-content">
                <h1 className="hero-title">
                    <span className="light-text">Define</span> <span className="medium-text">Your</span> <span
                        className="light-text">Limits</span><br />
                    <span className="light-text">Redefine</span> <span className="medium-text">Your</span> <span
                        className="light-text">Future</span>


                </h1>

                <div className="prev-next-navigation">
                    <div className="prev-label">
                        <span>W</span>
                        <span>O</span>
                        <span>R</span>
                        <span>K</span>
                    </div>
                    <div className="next-label">
                        <span>H</span>
                        <span>A</span>
                        <span>R</span>
                        <span>D</span>
                    </div>
                </div>

                <div className="hero-metrics">
                    <div className="metric-card hours-card">
                        <div className="metric-icon">
                            <img src="https://img.icons8.com/?size=100&id=2WzlFndNtU7P&format=png&color=40C057" alt="Hours icon" className="metric-img" />
                        </div>
                        <div className="metric-label">Hours</div>
                        <div className="metric-value">1.5</div>
                    </div>

                    <div className="metric-card poses-card">
                        <div className="metric-icon">
                            <img src="https://img.icons8.com/?size=100&id=KpSoVQLWzRDi&format=png&color=40C057" alt="Poses icon" className="metric-img" />
                        </div>
                        <div className="metric-label">Poses</div>
                        <div className="metric-value">20</div>
                    </div>

                    <div className="metric-card kcal-card">
                        <div className="metric-icon">
                            <img src="https://img.icons8.com/?size=100&id=ZoNqYRaPAEF8&format=png&color=40C057"
                                alt="Kcal icon" className="metric-img" />
                        </div>
                        <div className="metric-label">Kcal</div>
                        <div className="metric-value">550</div>
                    </div>

                    <div className="metric-card sets-card">
                        <div className="metric-icon">
                            <img src="https://img.icons8.com/?size=100&id=EtgiSJXmrcB8&format=png&color=40C057"
                                alt="Sets icon" className="metric-img" />
                        </div>
                        <div className="metric-label">Sets</div>
                        <div className="metric-value">5</div>
                    </div>
                </div>

                <div className="hero-image">
                    <img src="https://kenzo-fitness.vercel.app/assets/gym.png" alt="Fitness model" className="fitness-model" />
                </div>

                <div className="community-section">
                    <div className="community-images">
                        <img src="https://img.freepik.com/premium-photo/handsome-man-with-big-muscles-posing-camera-gym-african-american-bodybuilder-portrait-smiling-athlete-closeup_116317-20805.jpg"
                            alt="Community member 1" className="community-img" />
                        <img src="https://www.nickiswift.com/img/gallery/the-tragic-reality-of-ronnie-coleman/intro-1673625428.jpg"
                            alt="Community member 2" className="community-img" />
                        <img src="https://wallpapers.com/images/hd/tanned-chris-bumstead-side-chest-pose-c42i50p0zf9mkgyn.jpg"
                            alt="Community member 3" className="community-img" />
                    </div>
                    <div className="community-count">
                        <span className="count-number">6k+</span>
                        <span className="count-label">Champion Spirits</span>
                    </div>
                </div>

                <a href="#join" className="lets-start-btn">Let's Start &#62;&#62;&#62; </a>
            </div>
        </div>
    </section>


    
    <section className="brand-slider">
        <div className="slider-track">
            <div className="slide">
                <img src="https://choice.wetestyoutrust.com/sites/default/files/styles/medium/public/2022-03/7888b841-13ae-11eb-9dfd-06f7a2c059a3.png?itok=TlEOXcoE"
                    alt="Under Armour" />
            </div>
            <div className="slide">
                <img src="https://fitnesstack.com/wp-content/uploads/2024/04/Wellcore-supplements.png" alt="Reebok" />
            </div>
            <div className="slide">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCgCIHr8VQH31RyloYaothT7c4UHKQaYDL-1aeMxj_Bn1opzyCyZt3g0ngzrxQ0RAE-tg&usqp=CAU"
                    alt="Adidas" />
            </div>
            <div className="slide">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7izQl78glwVaH1-oxU6d6fVATGioD6sQ7zA&s"
                    alt="Puma" />
            </div>
            <div className="slide">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXNYbwWh0UxVFJT0tE_XpuC_tGhrXejkc68w&s"
                    alt="The North Face" />
            </div>
            <div className="slide">
                <img src="https://www.avvatarindia.com/https://kenzo-fitness.vercel.app/assets/images/new/loginBannerOTP-2.jpeg" alt="Nike" />
            </div>
            <div className="slide">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-pm2TS5CFERVmMFrV7ZFGHqBdZSQfAeWqkw&s"
                    alt="Nike" />
            </div>
            <div className="slide">
                <img src="https://choice.wetestyoutrust.com/sites/default/files/styles/medium/public/2022-03/7888b841-13ae-11eb-9dfd-06f7a2c059a3.png?itok=TlEOXcoE"
                    alt="Under Armour" />
            </div>
            <div className="slide">
                <img src="https://fitnesstack.com/wp-content/uploads/2024/04/Wellcore-supplements.png" alt="Reebok" />
            </div>
            <div className="slide">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCgCIHr8VQH31RyloYaothT7c4UHKQaYDL-1aeMxj_Bn1opzyCyZt3g0ngzrxQ0RAE-tg&usqp=CAU"
                    alt="Adidas" />
            </div>
            <div className="slide">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7izQl78glwVaH1-oxU6d6fVATGioD6sQ7zA&s"
                    alt="Puma" />
            </div>
            <div className="slide">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXNYbwWh0UxVFJT0tE_XpuC_tGhrXejkc68w&s"
                    alt="The North Face" />
            </div>
            <div className="slide">
                <img src="https://www.avvatarindia.com/https://kenzo-fitness.vercel.app/assets/images/new/loginBannerOTP-2.jpeg" alt="Nike" />
            </div>
            <div className="slide">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-pm2TS5CFERVmMFrV7ZFGHqBdZSQfAeWqkw&s"
                    alt="Nike" />
            </div>
        </div>
    </section>

    

    <section className="inspiration" id="about">
        <div className="universal-divider"></div>
        <div className="container">
            <h2 className="section-title">Inspired to<br /><span>Inspire Your Best Self</span></h2>
            <p className="section-subtitle">We're Your Partner In Achieving A Healthier, Stronger, And More Confident You.
            </p>

            <div className="inspiration-content">
                <div className="features">
                    <div className="feature">
                        <div className="feature-icon">
                            <img src="https://img.icons8.com/?size=100&id=ySb9mxfPEMsi&format=png&color=40C057"
                                alt="Nutrition Guidance" />
                        </div>
                        <h3>Nutrition Guidance</h3>
                    </div>
                    <div className="feature">
                        <div className="feature-icon">
                            <img src="https://img.icons8.com/?size=100&id=7Gh4XQOOtQHY&format=png&color=40C057"
                                alt="Expert Trainers" />
                        </div>
                        <h3>Expert Trainers</h3>
                    </div>
                    <div className="feature">
                        <div className="feature-icon">
                            <img src="https://img.icons8.com/?size=100&id=QdqEB9xXXDiS&format=png&color=40C057"
                                alt="Progress Tracking" />
                        </div>
                        <h3>Progress Tracking</h3>
                    </div>
                    <div className="feature">
                        <div className="feature-icon">
                            <img src="https://img.icons8.com/?size=100&id=47269&format=png&color=40C057"
                                alt="Premium Membership" />
                        </div>
                        <h3>Premium Membership</h3>
                    </div>
                    <div className="feature">
                        <div className="feature-icon">
                            <img src="https://img.icons8.com/?size=100&id=J715ns61u5eV&format=png&color=40C057"
                                alt="Community Support" />
                        </div>
                        <h3>Community Support</h3>
                    </div>
                    <div className="feature">
                        <div className="feature-icon">
                            <img src="https://img.icons8.com/?size=100&id=5uR5AfwPG3Vd&format=png&color=40C057"
                                alt="Next-Level Fitness Spaces" />
                        </div>
                        <h3>Next-Level Fitness Spaces</h3>
                    </div>
                </div>
                <div className="inspiration-image">
                    <img src="https://kenzo-fitness.vercel.app/assets/pngegg.png" alt="Fitness Inspiration" className="fitness-inspiration" />
                </div>
            </div>
        </div>
    </section>
    
    <section className="services" id="programs">
        <div className="universal-divider"></div>
        <div className="container">
            <h2 className="section-title">Discover<br /><span>What Sets Us Apart</span></h2>
            <p className="section-subtitle">We're not just another gym. We're a community dedicated to excellence.</p>

            <div className="service-cards">
                {plansLoading ? (
                  <p style={{ color: '#c1ff00', textAlign: 'center', width: '100%' }}>Loading plans...</p>
                ) : plans.length > 0 ? (
                  plans.map((plan, idx) => (
                    <div
                      className={`service-card${flippedId === plan._id ? ' flipped' : ''}`}
                      key={plan._id}
                    >
                        <div className="card-inner">
                            <div className="card-front">
                                <div className="card-icon">
                                    <img
                                        src={PLAN_ICONS[idx % PLAN_ICONS.length]}
                                        alt={plan.name}
                                    />
                                </div>
                                <h3>{plan.name}</h3>
                                <p>{plan.description || `${plan.durationInDays}-day membership plan`}</p>
                                <button
                                  className="btn-secondary flip-btn"
                                  onClick={() => toggleFlip(plan._id)}
                                >See Plan</button>
                            </div>
                            <div className="card-back">
                                <h3>{plan.name}</h3>
                                {plan.features && plan.features.length > 0 ? (
                                  <ul className="plan-details">
                                      {plan.features.map((f, i) => <li key={i}>{f}</li>)}
                                  </ul>
                                ) : (
                                  <p style={{ color: '#aaa', fontSize: '0.9rem', margin: '1rem 0' }}>
                                    {plan.durationInDays} days access
                                  </p>
                                )}
                                <p className="price">Starting at ₹{plan.price}/month</p>
                                <button
                                  className="btn-secondary flip-btn"
                                  onClick={() => toggleFlip(plan._id)}
                                >Go Back</button>
                            </div>
                        </div>
                    </div>
                  ))
                ) : (
                  // Fallback static cards when no plans exist in DB
                  <>
                  <div className={`service-card${flippedId === 'static-0' ? ' flipped' : ''}`}>
                    <div className="card-inner">
                        <div className="card-front">
                            <div className="card-icon"><img src={PLAN_ICONS[0]} alt="Custom Training" /></div>
                            <h3>Custom Training</h3>
                            <p>Personalized plans tailored to your goals</p>
                            <button className="btn-secondary flip-btn" onClick={() => toggleFlip('static-0')}>See Plan</button>
                        </div>
                        <div className="card-back">
                            <h3>Custom Training Plan</h3>
                            <ul className="plan-details">
                                <li>Personal trainer assessment</li>
                                <li>Customized workout schedule</li>
                                <li>Nutrition planning</li>
                                <li>Progress tracking</li>
                            </ul>
                            <p className="price">Starting at $99/month</p>
                            <button className="btn-secondary flip-btn" onClick={() => toggleFlip('static-0')}>Go Back</button>
                        </div>
                    </div>
                  </div>
                  <div className={`service-card${flippedId === 'static-1' ? ' flipped' : ''}`}>
                    <div className="card-inner">
                        <div className="card-front">
                            <div className="card-icon"><img src={PLAN_ICONS[1]} alt="Strength & Skill" /></div>
                            <h3>Strength &amp; Skill</h3>
                            <p>Build both power and technical precision</p>
                            <button className="btn-secondary flip-btn" onClick={() => toggleFlip('static-1')}>See Plan</button>
                        </div>
                        <div className="card-back">
                            <h3>Strength Building Plan</h3>
                            <ul className="plan-details">
                                <li>Strength assessment tests</li>
                                <li>Progressive overload training</li>
                                <li>Technical form coaching</li>
                                <li>Monthly strength goals</li>
                            </ul>
                            <p className="price">Starting at $129/month</p>
                            <button className="btn-secondary flip-btn" onClick={() => toggleFlip('static-1')}>Go Back</button>
                        </div>
                    </div>
                  </div>
                  <div className={`service-card${flippedId === 'static-2' ? ' flipped' : ''}`}>
                    <div className="card-inner">
                        <div className="card-front">
                            <div className="card-icon"><img src={PLAN_ICONS[2]} alt="Fat Loss" /></div>
                            <h3>Fat Loss</h3>
                            <p>Effective programs for sustainable results</p>
                            <button className="btn-secondary flip-btn" onClick={() => toggleFlip('static-2')}>See Plan</button>
                        </div>
                        <div className="card-back">
                            <h3>Fat Loss Program</h3>
                            <ul className="plan-details">
                                <li>Body composition analysis</li>
                                <li>Metabolic rate testing</li>
                                <li>Custom meal planning</li>
                                <li>Weekly measurements</li>
                            </ul>
                            <p className="price">Starting at $149/month</p>
                            <button className="btn-secondary flip-btn" onClick={() => toggleFlip('static-2')}>Go Back</button>
                        </div>
                    </div>
                  </div>
                  <div className={`service-card${flippedId === 'static-3' ? ' flipped' : ''}`}>
                    <div className="card-inner">
                        <div className="card-front">
                            <div className="card-icon"><img src={PLAN_ICONS[3]} alt="HIIT Performance" /></div>
                            <h3>HIIT Performance</h3>
                            <p>High intensity training for maximum results</p>
                            <button className="btn-secondary flip-btn" onClick={() => toggleFlip('static-3')}>See Plan</button>
                        </div>
                        <div className="card-back">
                            <h3>HIIT Performance Plan</h3>
                            <ul className="plan-details">
                                <li>Cardio capacity testing</li>
                                <li>Interval training programs</li>
                                <li>Recovery optimization</li>
                                <li>Performance tracking</li>
                            </ul>
                            <p className="price">Starting at $119/month</p>
                            <button className="btn-secondary flip-btn" onClick={() => toggleFlip('static-3')}>Go Back</button>
                        </div>
                    </div>
                  </div>
                  </>
                )}
            </div>
        </div>
    </section>

    
    <section className="training" id="training">
        <div className="universal-divider"></div>
        <div className="container">
            <h2 className="section-title">Train Smarter<br /><span>Unleash Your Potential</span></h2>
            <p className="section-subtitle">Learn to maximize your effort in every session.</p>

            <div className="training-gallery">
                <div className="gallery-item">
                    <img src="https://assets.gqindia.com/photos/5cdc0e49d0e160243a100354/16:9/w_2560%2Cc_limit/weight-workout.jpg"
                        alt="Weight Training" />
                    <h3>Weight Training</h3>
                    <div className="corner-bl"></div>
                </div>
                <div className="gallery-item">
                    <img src="https://static.toiimg.com/photo/94808504.cms" alt="Cardio & Mobility Work" />
                    <h3>Cardio & Mobility Work</h3>
                    <div className="corner-bl"></div>
                </div>
                <div className="gallery-item">
                    <img src="https://www.barbellmedicine.com/wp-content/uploads/2024/08/Strength-Training.jpg"
                        alt="Dynamic Strength" />
                    <h3>Dynamic Strength</h3>
                    <div className="corner-bl"></div>
                </div>
                <div className="gallery-item">
                    <img src="https://www.puregym.com/media/rhcdjrfv/hiit-workouts-for-men_blogheader-no-title.jpg?quality=80"
                        alt="High-Intensity Training" />
                    <h3>High-Intensity Training</h3>
                    <div className="corner-bl"></div>
                </div>
                <div className="gallery-item">
                    <img src="https://c1.wallpaperflare.com/preview/782/470/535/adult-barbell-body-bodybuilding.jpg"
                        alt="Power Lifting" />
                    <h3>Power Lifting</h3>
                    <div className="corner-bl"></div>
                </div>
                <div className="gallery-item">
                    <img src="https://www.shutterstock.com/image-photo/fitness-gym-workout-woman-doing-600nw-2248535321.jpg"
                        alt="Core Development" />
                    <h3>Core Development</h3>
                    <div className="corner-bl"></div>
                </div>
            </div>
        </div>

    </section>
    <div className="universal-divider"></div>
    
    <section className="experience">

        <div className="container">
            <div className="section-header">
                <h2 className="section-title">Experience<br /><span>Fitness Like Never Before</span></h2>
                <p className="section-description">Transform The Way You Train With Innovative Workouts, Expert Guidance,
                    And State-Of-The-Art Facilities.</p>
            </div>

            <div className="experience-cards">
                <div className="experience-card">
                    <div className="card-image">
                        <img src="https://kenzo-fitness.vercel.app/assets/gymm1.png" alt="Endurance Evolution" />
                    </div>
                    <div className="card-content">
                        <h3>Endurance Evolution</h3>
                        <p>Boost Your Stamina And Resilience With Tailored Cardio And Endurance Workouts Designed To
                            Keep You Moving Stronger For Longer.</p>
                        <button className="read-more">Read More</button>

                        <div className="expanded-content">
                            <button className="close-details">×</button>
                            <h4>Program Details</h4>
                            <ul>
                                <li>12-week progressive endurance program</li>
                                <li>Customized heart rate zone training</li>
                                <li>Recovery optimization techniques</li>
                                <li>Weekly performance assessments</li>
                            </ul>
                            <p>Our Endurance Evolution program is designed to systematically build your cardiovascular
                                capacity while preventing plateaus. Each week introduces new challenges that push your
                                limits while maintaining proper form and technique.</p>
                        </div>

                        <div className="stat-badge">
                            <div className="stat-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c1ff00"
                                    strokeWidth="2">
                                    <path
                                        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z">
                                    </path>
                                </svg>
                            </div>
                            <div className="stat-info">
                                <div className="stat-value">95</div>
                                <div className="stat-label">BPM</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="experience-card card-offset">
                    <div className="card-image">
                        <img src="https://kenzo-fitness.vercel.app/assets/gymm2.png" alt="Speed Surge" />
                    </div>
                    <div className="card-content">
                        <h3>Speed Surge</h3>
                        <p>Boost Your Agility And Explosiveness With High-Intensity Sprint And Movement Drills. Speed
                            Surge Is Designed To Take Your Performance To The Next Level!</p>
                        <button className="read-more">Read More</button>

                        <div className="expanded-content">
                            <button className="close-details">×</button>
                            <h4>Program Details</h4>
                            <ul>
                                <li>8-week explosive power development</li>
                                <li>Sprint mechanics and technique training</li>
                                <li>Plyometric progression system</li>
                                <li>Agility and reaction time drills</li>
                            </ul>
                            <p>Speed Surge focuses on developing fast-twitch muscle fibers and neural adaptations that
                                improve your body's ability to generate power quickly. Perfect for athletes looking to
                                gain a competitive edge.</p>
                        </div>

                        <div className="stat-badge2">
                            <div className="stat-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c1ff00"
                                    strokeWidth="2">
                                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                                </svg>
                            </div>
                            <div className="stat-info">
                                <div className="stat-value">1,024</div>
                                <div className="stat-label">STEPS</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    
    <section className="trainers" id="trainers">
        <div className="universal-divider"></div>
        <div className="container">
            <h2 className="section-title">Your Fitness Goals,<br /><span>Their Expertise</span></h2>
            <p className="section-subtitle">Our coaches are elite performers in their specialties.</p>

            <div className="trainer-cards">
                <div className="trainer-card">
                    <img src="https://img.freepik.com/premium-photo/biceps-exercise-with-dumbbells-gym_600776-34165.jpg"
                        alt="Leon Crawford" />
                    <h3>Leon Crawford</h3>
                    <p>Weight Training Specialist</p>
                    <div className="rating">
                        <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                    </div>
                </div>
                <div className="trainer-card">
                    <img src="https://c4.wallpaperflare.com/wallpaper/790/833/201/sexy-model-pose-fitness-wallpaper-preview.jpg"
                        alt="Marcus Fischer" />

                    <h3>Mary Fischer</h3>
                    <p>Performance Coach</p>
                    <div className="rating">
                        <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                    </div>
                </div>
                <div className="trainer-card">
                    <img src="https://images.pexels.com/photos/16495748/pexels-photo-16495748/free-photo-of-muscular-model-posing-in-outdoor-gym.jpeg"
                        alt="Logan Taylor" />
                    <h3>Logan Taylor</h3>
                    <p>Nutrition & Conditioning</p>
                    <div className="rating">
                        <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    
    <section className="testimonials-section" id="testimonial">
        <div className="universal-divider"></div>
        <div className="testimonials-container">
            <div className="testimonials-header">
                <h2>Your Success <span>Stories,<br /> </span><span className="highlight">Our Inspiration</span></h2>
                <p>See How Our Customers Have Achieved Their Goals And Let Their Journeys Inspire Yours!</p>
            </div>

            <div className="testimonials-content">
                <div className="testimonials-slider">
                    <div className="testimonial-item active" data-index="0">
                        <div className="testimonial-image">
                            <img src="https://i.pinimg.com/736x/36/80/a8/3680a8a8dd08b40f3eef06d0bdf8efba.jpg"
                                alt="James T." />
                        </div>
                        <div className="testimonial-text">
                            <div className="quote-box">
                                <p>"I Love The Variety Of Workouts On Kenzo Fusion. Whether It's HIIT, Yoga, Or Strength
                                    Training, There's Always Something New To Try. The Progress Tracking Tools Keep Me
                                    Motivated!"
                                </p>
                                <div className="author">
                                    <h4>— James T.</h4>
                                    <p>LA, USA</p>
                                </div>
                                <div className="ratings">
                                    <span className="star">★</span>
                                    <span className="star">★</span>
                                    <span className="star">★</span>
                                    <span className="star">★</span>
                                    <span className="star">★</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="testimonial-item" data-index="1">
                        <div className="testimonial-image">
                            <img src="https://c4.wallpaperflare.com/wallpaper/62/261/107/pose-fitness-muscle-muscle-athlete-hd-wallpaper-preview.jpg"
                                alt="Ryan Blaze" />
                        </div>
                        <div className="testimonial-text">
                            <div className="quote-box">
                                <p>"The trainers at Kenzo Fitness are amazing! They pushed me to reach levels I didn't
                                    think were possible. My strength has improved 200% in just 6 months!"</p>
                                <div className="author">
                                    <h4>— Ryan Blaze</h4>
                                    <p>NYC, USA</p>
                                </div>
                                <div className="ratings">
                                    <span className="star">★</span>
                                    <span className="star">★</span>
                                    <span className="star">★</span>
                                    <span className="star">★</span>
                                    <span className="star">★</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="testimonial-item" data-index="2">
                        <div className="testimonial-image">
                            <img src="https://img.freepik.com/premium-photo/attractive-fitness-model-with-dumbbells-posing-dark-background-sportswear_124865-6356.jpg"
                                alt="Ethan Maxx" />
                        </div>
                        <div className="testimonial-text">
                            <div className="quote-box">
                                <p>"The community aspect of Kenzo Fitness is what keeps me coming back. I've made
                                    lifelong friends while transforming my body. Best decision I ever made!"</p>
                                <div className="author">
                                    <h4>— Emmy Maxx</h4>
                                    <p>Miami, USA</p>
                                </div>
                                <div className="ratings">
                                    <span className="star">★</span>
                                    <span className="star">★</span>
                                    <span className="star">★</span>
                                    <span className="star">★</span>
                                    <span className="star">★</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="testimonial-navigation">
                    <button className="nav-btn prev-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                    </button>
                    <button className="nav-btn next-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m9 18 6-6-6-6" />
                        </svg>
                    </button>
                </div>

                <div className="thumbnail-container">
                    <div className="thumbnail active" data-index="0">
                        <img src="https://i.pinimg.com/736x/36/80/a8/3680a8a8dd08b40f3eef06d0bdf8efba.jpg"
                            alt="James T." />
                        <div className="thumbnail-name">James T.</div>
                    </div>
                    <div className="thumbnail" data-index="1">
                        <img src="https://c4.wallpaperflare.com/wallpaper/62/261/107/pose-fitness-muscle-muscle-athlete-hd-wallpaper-preview.jpg"
                            alt="Ryan Blaze" />
                        <div className="thumbnail-name">Ryan Blaze</div>
                    </div>
                    <div className="thumbnail" data-index="2">
                        <img src="https://img.freepik.com/premium-photo/attractive-fitness-model-with-dumbbells-posing-dark-background-sportswear_124865-6356.jpg"
                            alt="Ethan Maxx" />
                        <div className="thumbnail-name">Emmy Maxx</div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    
    <section className="cta" id="join">
        <div className="container">
            <div className="cta-box">
                <h2>Connect. Engage. Transform.</h2>
                <p>Join our community today and begin your transformation journey.</p>
                <form className="newsletter-form" action="https://formspree.io/f/mzzejvbv" method="POST">
                    <input type="email" name="email" placeholder="Enter your email" required />
                    <input type="hidden" name="subject" value="Newsletter Subscription" />
                    <input type="hidden" name="_format" value="json" />
                    <button type="submit" className="btn-primary newsletter-btn">Join Now</button>
                </form>
                <div className="newsletter-success" style={{ 'display': 'none' }}>
                    <p>Thank you for joining! We'll be in touch soon.</p>
                </div>
            </div>
        </div>
    </section>
    
    <div className="contact-modal" id="contactModal">
        <div className="modal-content">
            <div className="modal-header">
                <h2>Get In Touch</h2>
                <span className="close-modal">x</span>
            </div>
            <div className="modal-body">
                <div className="contact-info-section">
                    <div className="contact-info-item">
                        <div className="contact-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                strokeWidth="2">
                                <path
                                    d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z">
                                </path>
                            </svg>
                        </div>
                        <div className="contact-text">
                            <h4>Call Us</h4>
                            <a href="tel:+919004798958"
                                style={{ 'color': '#c1ff00', 'textDecoration': 'none', 'fontWeight': '500' }}>
                                +91 9004798958
                            </a>
                        </div>

                    </div>
                    <div className="contact-info-item">
                        <div className="contact-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                strokeWidth="2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z">
                                </path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                        </div>
                        <div className="contact-text">
                            <h4>Email Us</h4>
                            <a href="mailto:kenzofitness@gmail.com"
                                style={{ 'color': '#c1ff00', 'textDecoration': 'none', 'fontWeight': '500' }}>
                                kenzofitness@gmail.com
                            </a>
                        </div>


                    </div>
                    <div className="contact-info-item">
                        <div className="contact-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                        </div>
                        <div className="contact-text">
                            <h4>Visit Us</h4>
                            <a href="https://www.google.com/maps?q=123+Fitness+Street,+Gym+City,+GC+12345"
                                target="_blank" style={{ 'color': '#c1ff00', 'textDecoration': 'none', 'fontWeight': '500' }}>
                                123 Fitness Street, Gym City, GC 12345
                            </a>
                        </div>

                    </div>
                </div>
                <form className="contact-form" action="https://formspree.io/f/mzzejvbv" method="POST">
                    <div className="form-group">
                        <input type="text" id="name" name="name" placeholder="Your Name" required />
                    </div>
                    <div className="form-group">
                        <input type="email" id="email" name="email" placeholder="Your Email" required />
                    </div>
                    <div className="form-group">
                        <select id="subject" name="subject" required>
                            <option value="" disabled selected>Select Subject</option>
                            <option value="membership">Membership Inquiry</option>
                            <option value="training">Personal Training</option>
                            <option value="classes">Group Classes</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <textarea id="message" name="message" placeholder="Your Message" rows="5" required></textarea>
                    </div>
                    <button type="submit" className="submit-btn">Send Message</button>
                </form>
            </div>
        </div>
    </div>
    
    <footer>
        <div className="container">
            <div className="footer-content">
                <div className="footer-brand">
                    <div className="footer-logo">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqQ0XxwXAPcD3YCcan5T0oiEuwcuc-WADPsA&s"
                            alt="FITusion Logo" className="logo-img" />
                        <span>Kenzo Fitness</span>
                    </div>
                    <p className="footer-tagline">Your Go-To For Personalized Workouts, Meal Plans, And Expert Fitness
                        Advice
                    </p>
                </div>

                <div className="footer-social">
                    <h3>Follow Us On</h3>
                    <div className="social-icons">
                        <a href="https://www.facebook.com" className="social-icon">
                            <img src="https://img.icons8.com/ios-filled/50/FFFFFF/facebook-new.png" alt="Facebook" />
                        </a>
                        <a href="https://in.linkedin.com/in/amanmishra107" className="social-icon">
                            <img src="https://img.icons8.com/ios-filled/50/FFFFFF/linkedin.png" alt="LinkedIn" />
                        </a>
                        <a href="https://www.instagram.com/nexlume" className="social-icon">
                            <img src="https://img.icons8.com/ios-filled/50/FFFFFF/instagram-new.png" alt="Instagram" />
                        </a>
                        <a href="https://www.twitter.com" className="social-icon">
                            <img src="https://img.icons8.com/?size=100&id=A4DsujzAX4rw&format=png&color=000000"
                                alt="Twitter" />
                        </a>
                    </div>
                </div>

                <div className="footer-nav">
                    <ul className="footer-links">
                        <li><a href="#hero">Home</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#programs">Plans</a></li>
                        <li><a href="#trainers">Trainers</a></li>
                        <li><a href="#testimonials">Testimonials</a></li>
                    </ul>
                </div>

                <div className="footer-contact">
                    <h3>Contact</h3>
                    <div className="contact-info">
                        <p>Monday-Sunday</p>
                        <p>5:00 AM - 11:30 PM</p>
                        <p className="email">
                            <a href="mailto:nexlume.co@gmail.com">kenzofitness@gmail.com</a>
                        </p>
                    </div>
                </div>

            </div>

        </div>

    </footer>
    
    <div className="copyright-footer">
        <div className="copyright-content">
            <div className="copyright">
                <span>© <span className="year">2025</span> Made with <span className="heart">♥</span> by</span>
                <a href="https://www.linkedin.com/in/amanmishra107/" target="_blank">Aman Mishra</a>
            </div>

            <div className="copyright-links">
                <a href="#privacy">Privacy Policy</a>
                <div className="divider"></div>
                <a href="#terms">Terms of Service</a>
                <div className="divider"></div>
                <a href="#cookies">Cookie Policy</a>
                <div className="divider"></div>
                <a href="#sitemap">Sitemap</a>
            </div>
        </div>
    </div>
    

    </div>
  );
};

export default Home;
