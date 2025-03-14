"use client";
import React, { useRef, useEffect, useCallback, memo } from "react";
import Image from "next/image";
import { useState } from "react";
import gsap from "gsap";
import LoadingSpinner from "./components/LoadingSpinner";
import { optimizeCloudinaryUrl, isCloudinaryUrl } from "./utils/imageUtils";

// Define custom animation classes - these will be used directly in the JSX
// instead of trying to inject them with useEffect
const ANIMATIONS = {
  spinSlow: "animate-[spin_15s_linear_infinite]",
  pingSlow: "animate-[ping_3s_ease-in-out_infinite]",
  bounceSlow: "animate-[bounce_3s_ease-in-out_infinite]",
  float: "animate-[float_5s_ease-in-out_infinite]",
  delay300: "animation-delay-300",
  delay700: "animation-delay-700",
};

/**
 * MovingNahiButton Component
 * A fun interactive button that moves away when the mouse hovers over it
 * Used in the relationship option to create a playful "No" button that's hard to click
 */
const MovingNahiButton = () => {
  // State to track the button's position
  const [position, setPosition] = useState({ x: 0, y: 0 });
  // Count how many times user tried to click the button
  const [attempts, setAttempts] = useState(0);
  // Control visibility of the pleading message
  const [showMessage, setShowMessage] = useState(false);
  // Control whether the button is active
  const [isActive, setIsActive] = useState(true);

  /**
   * Handler for mouse hover event
   * Moves the button to a random position and shows a message every 3 attempts
   */
  const handleMouseEnter = () => {
    if (!isActive) return;

    // Move the button to a random position
    setPosition({
      x: Math.random() * 200 - 100, // Increased movement range
      y: Math.random() * 200 - 100,
    });

    setAttempts((prev) => prev + 1);

    // Show pleading message every 3 attempts
    if ((attempts + 1) % 3 === 0) {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 2500);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        className={`bg-red-500 text-white px-6 py-2 rounded-full transition-all duration-300 shadow-lg ${
          isActive ? "hover:bg-red-600 hover:scale-105" : "opacity-50 cursor-not-allowed"
        }`}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`, // CSS transform to move the button
          transition: "transform 0.3s ease-out", // Smooth transition for movement
        }}
        onMouseEnter={handleMouseEnter} // Trigger movement on mouse hover
        onTouchStart={handleMouseEnter} // Support for mobile devices
      >
        Nahi Ji
      </button>

      {/* Pleading message shown after multiple attempts */}
      {showMessage && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 z-10 animate-bounce">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg blur-sm opacity-75"></div>
            <span className="relative block bg-white p-3 rounded-lg shadow-lg text-red-500 font-medium text-center whitespace-nowrap min-w-[180px]">
              Thoda Soch Lo, Please.... 😢
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Confetti animation component using GSAP
 * Creates a more performant and visually appealing confetti effect
 */
const Confetti = () => {
  const containerRef = useRef(null);
  const confettiCount = 150;
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const confettiElements = [];
    
    // Create confetti elements
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      const size = Math.random() * 10 + 6;
      
      // Set styles
      confetti.style.position = 'absolute';
      confetti.style.width = `${size}px`;
      confetti.style.height = `${size}px`;
      confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, ${Math.random() * 20 + 60}%)`;
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
      confetti.style.boxShadow = `0 0 ${Math.random() * 10 + 5}px rgba(255,255,255,0.3)`;
      confetti.style.zIndex = Math.floor(Math.random() * 10) + 50;
      
      // Position at top
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.top = `-${size}px`;
      
      // Add to container and array
      container.appendChild(confetti);
      confettiElements.push(confetti);
      
      // Animate with GSAP
      gsap.to(confetti, {
        y: `${window.innerHeight + size}px`,
        x: `+=${Math.random() * 200 - 100}`,
        rotation: Math.random() * 720,
        duration: Math.random() * 3 + 3,
        ease: "power1.out",
        delay: Math.random() * 3,
        opacity: 0,
        onComplete: () => {
          if (container.contains(confetti)) {
            container.removeChild(confetti);
          }
        }
      });
    }
    
    // Cleanup
    return () => {
      confettiElements.forEach(element => {
        if (container.contains(element)) {
          container.removeChild(element);
        }
      });
    };
  }, []);
  
  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-50"></div>;
};

/**
 * FloatingHearts animation component using GSAP
 * Creates a more performant and visually appealing floating hearts effect
 */
const FloatingHearts = () => {
  const containerRef = useRef(null);
  const heartsCount = 40;
  const heartEmojis = ['❤️', '💖', '💕', '💓', '💗', '💘', '💝'];
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const heartElements = [];
    
    // Create heart elements
    for (let i = 0; i < heartsCount; i++) {
      const heart = document.createElement('div');
      
      // Set styles
      heart.style.position = 'absolute';
      heart.style.fontSize = `${Math.random() * 20 + 30}px`; // Larger hearts
      heart.style.opacity = '0';
      heart.style.zIndex = Math.floor(Math.random() * 10) + 40;
      heart.style.filter = 'drop-shadow(0 0 5px rgba(255,255,255,0.5))';
      heart.style.left = `${Math.random() * 100}%`;
      heart.style.bottom = '0';
      heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
      
      // Add to container and array
      container.appendChild(heart);
      heartElements.push(heart);
      
      // Animate with GSAP
      gsap.to(heart, {
        y: `-${window.innerHeight + 100}px`,
        x: `+=${Math.random() * 100 - 50}`,
        rotation: Math.random() * 40 - 20,
        scale: Math.random() * 0.5 + 0.8,
        opacity: 1,
        duration: Math.random() * 6 + 4,
        ease: "power1.out",
        delay: Math.random() * 5,
        onStart: () => {
          gsap.to(heart, {
            opacity: 0,
            duration: 2,
            delay: Math.random() * 4 + 2,
          });
        },
        onComplete: () => {
          if (container.contains(heart)) {
            container.removeChild(heart);
          }
        }
      });
    }
    
    // Cleanup
    return () => {
      heartElements.forEach(element => {
        if (container.contains(element)) {
          container.removeChild(element);
        }
      });
    };
  }, []);
  
  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-40"></div>;
};

/**
 * Heartfelt message component to encourage genuine responses
 * Moved outside the main component to prevent re-creation on every render
 */
const HeartfeltMessage = memo(() => {
  return (
    <div className="mb-10 animate-fade-in">
      <div className="relative">
        {/* Enhanced background glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/50 via-purple-500/50 to-indigo-500/50 rounded-xl blur-md animate-pulse-slow"></div>
        
        {/* Main content container with improved styling */}
        <div className="relative p-8 bg-white/10 backdrop-blur-md rounded-xl border border-white/30 shadow-2xl">
          {/* Decorative header with animated elements */}
          <div className="flex items-center justify-center mb-5">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-pink-300 to-transparent"></div>
            <div className="mx-4 text-3xl relative">
              <span className={`absolute -top-2 -left-2 text-xl ${ANIMATIONS.pingSlow} opacity-70`}>✨</span>
              <span className="relative z-10">💌</span>
              <span className={`absolute -bottom-2 -right-2 text-xl ${ANIMATIONS.pingSlow} opacity-70 ${ANIMATIONS.delay700}`}>✨</span>
            </div>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-pink-300 to-transparent"></div>
          </div>
          
          {/* Enhanced heading with gradient text */}
          <h2 className="text-2xl font-bold text-center mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">
              Pyaar Naal Form Bharo Ji!
            </span>
          </h2>
          
          {/* Message content with improved styling */}
          <div className="relative">
            <div className="absolute -inset-1 bg-black/10 rounded-lg blur-sm"></div>
            <p className="relative text-white/90 text-center leading-relaxed p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
              <span className="text-lg font-medium">Sanu tuhade baare sach-much janna hai!</span> <br />
              Eh form sirf formality layi nahi, 
              <span className="text-pink-200 font-medium"> saade dil di gall hai</span>. Tuhade jawab saanu tuhanu jaan'n ch madad karn ge.
              <br />
              <span className="italic">Saare sawaal dil khol ke jawab deo, koi jhooth nahi, sirf sach!</span> 
              <span className={`inline-block ml-1 ${ANIMATIONS.bounceSlow}`}>💕</span>
            </p>
          </div>
          
          {/* Enhanced footer with decorative elements */}
          <div className="flex flex-col items-center mt-5">
            <div className="flex items-center justify-center w-full mb-2">
              <div className="h-px flex-grow bg-gradient-to-r from-transparent via-pink-200/30 to-transparent"></div>
              <span className="mx-2 text-lg">🌸</span>
              <div className="h-px flex-grow bg-gradient-to-r from-transparent via-pink-200/30 to-transparent"></div>
            </div>
            <span className="text-white/80 text-sm italic px-4 py-1 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
              ~ Fill with love, not just formality ~
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

// Add display name for debugging purposes
HeartfeltMessage.displayName = 'HeartfeltMessage';

/**
 * Main Page Component
 * A fun interactive form that collects user information and shows different options
 * based on gender and age, with playful interactions
 */
const page = () => {
  // Store all user information in a single state object
  const [user, setUser] = useState({
    name: "",
    gender: "",
    option: "",
    age: "",
    education: "",
    educationProgram: "",
    residence: "",
    passion: "",
    reason: "",
    loveReason: "",
    advice: "",
    hobbies: "",
    number: "",
    image: null,
  });

  // State for age-based message display
  const [ageMessage, setAgeMessage] = useState("");
  // Control visibility of the "No" button
  const [showNahiButton, setShowNahiButton] = useState(true);
  // Control visibility of the love reason textarea
  const [showLoveReason, setShowLoveReason] = useState(false);
  // Control celebration effects
  const [showConfetti, setShowConfetti] = useState(false);
  // Control hearts animation
  const [showHearts, setShowHearts] = useState(false);
  // Track form completion
  const [isSubmitted, setIsSubmitted] = useState(false);
  // Education message for "Un-Padh" option
  const [educationMessage, setEducationMessage] = useState("");
  // Store submitted user data for success screen
  const [submittedUserData, setSubmittedUserData] = useState(null);
  // Track loading state
  const [isLoading, setIsLoading] = useState(false);
  
  /**
   * Handle image upload
   * Converts the selected file to base64 format for preview and upload
   * The base64 data will be sent to the server and then uploaded to Cloudinary
   */
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Handle education selection change
   * Shows message for "Un-Padh" option
   */
  const handleEducationChange = (e) => {
    const value = e.target.value;
    setUser((prev) => ({ ...prev, education: value }));
    
    if (value === "un-padh") {
      setEducationMessage("Veery Afsoos hoya Sunn k 😔");
    } else {
      setEducationMessage("");
    }
  };

  /**
   * Handle age input to ensure only numeric values
   */
  const handleAgeInput = (e) => {
    const value = e.target.value;
    // Only allow numeric values
    if (value === "" || /^[0-9\b]+$/.test(value)) {
      setUser((prev) => ({ ...prev, age: value }));
    }
  };

  /**
   * Handle name input to ensure only alphabetic characters
   */
  const handleNameInput = (e) => {
    const value = e.target.value;
    // Only allow letters (including spaces and some special characters for names with apostrophes, hyphens)
    if (value === "" || /^[A-Za-z\s'-]+$/.test(value)) {
      setUser((prev) => ({ ...prev, name: value }));
    }
  };

  /**
   * Get education options based on age
   */
  const getEducationOptions = () => {
    const age = parseInt(user.age);
    // Change default label based on gender
    const defaultLabel = user.gender === "Kudii" 
      ? "🎓 Kitthe Tak Parhi Likhi Ho? *" 
      : "🎓 Kitthe Tak Parhe Likhe Ho? *";
    
    let options = [
      { value: "", label: defaultLabel },
      { value: "un-padh", label: "📵 Un-Padh" }
    ];
    
    // Age >= 30: Only show PHD and Un-Padh
    if (age >= 30) {
      options.push({ value: "phd", label: "👨‍🎓 PHD" });
      return options;
    }
    
    // Age <= 15: Show primary education options
    if (age <= 15) {
      options.push({ value: "punjvi", label: "📚 Punjvi(5) Tk" });
      options.push({ value: "audthvi", label: "📚 Audthvi(8) Tk" });
    }
    
    // Age <= 20: Show secondary education options
    if (age > 15 && age <= 20) {
      options.push({ value: "punjvi", label: "📚 Punjvi(5) Tk" });
      options.push({ value: "audthvi", label: "📚 Audthvi(8) Tk" });
      options.push({ value: "dssvii", label: "📚 Dssvii(10) Tk" });
      options.push({ value: "barvii", label: "📚 Barvii(12) Tk" });
    }
    
    // Age <= 25: Show higher education options
    if (age > 20 && age <= 25) {
      options.push({ value: "punjvi", label: "📚 Punjvi(5) Tk" });
      options.push({ value: "audthvi", label: "📚 Audthvi(8) Tk" });
      options.push({ value: "dssvii", label: "📚 Dssvii(10) Tk" });
      options.push({ value: "barvii", label: "📚 Barvii(12) Tk" });
      options.push({ value: "bs", label: "🎓 BS kr leya/Kr ray" });
    }
    
    // Age > 25 but < 30: Show all education options
    if (age > 25 && age < 30) {
      options.push({ value: "punjvi", label: "📚 Punjvi(5) Tk" });
      options.push({ value: "audthvi", label: "📚 Audthvi(8) Tk" });
      options.push({ value: "dssvii", label: "📚 Dssvii(10) Tk" });
      options.push({ value: "barvii", label: "📚 Barvii(12) Tk" });
      options.push({ value: "bs", label: "🎓 BS kr leya" });
    }
    
    return options;
  };

  /**
   * Reset form to initial state
   */
  const resetForm = () => {
    setUser({
      name: "",
      gender: "",
      option: "",
      age: "",
      education: "",
      educationProgram: "",
      residence: "",
      passion: "",
      reason: "",
      loveReason: "",
      advice: "",
      hobbies: "",
      number: "",
      image: null,
    });
    setAgeMessage("");
    setEducationMessage("");
    setShowLoveReason(false);
    setShowNahiButton(true);
  };

  /**
   * Handle form submission with appropriate celebrations
   */
  const handleSubmit = async () => {
    try {
      // Comprehensive form validation
      const requiredFields = [
        { field: 'name', label: 'Name' },
        { field: 'gender', label: 'Gender' },
        { field: 'age', label: 'Age' },
        { field: 'education', label: 'Education' },
        { field: 'residence', label: 'Residence' },
        { field: 'number', label: 'Phone Number' }
      ];
      
      // Check for empty required fields
      const emptyFields = requiredFields.filter(item => !user[item.field] || user[item.field].trim() === '');
      
      if (emptyFields.length > 0) {
        alert(`Please fill in the following required fields: ${emptyFields.map(item => item.label).join(', ')}`);
        return;
      }
      
      // Check if age is valid
      if (isNaN(parseInt(user.age))) {
        alert("Please enter a valid age");
        return;
      }
      
      // Check if image is uploaded
      if (!user.image) {
        alert("Please upload your photo");
        return;
      }
      
      // Check option-specific required fields
      if (user.gender === 'Munda') {
        if (user.option === 'friendship' && (!user.reason || user.reason.trim() === '')) {
          alert("Please tell us why you want to be friends");
          return;
        }
        if (!user.passion || user.passion.trim() === '') {
          alert("Please share your passion with us");
          return;
        }
      } else if (user.gender === 'Kudii') {
        if (user.age >= 14 && user.age < 18 && (!user.hobbies || user.hobbies.trim() === '')) {
          alert("Please share your hobbies with us");
          return;
        }
        if (user.age > 30 && (!user.advice || user.advice.trim() === '')) {
          alert("Please share your advice with us");
          return;
        }
        if (user.age >= 18 && user.age <= 30) {
          if (!user.option || user.option.trim() === '') {
            alert("Please select an option (Friendship or Relationship)");
            return;
          }
          if (user.option === 'friendship' && (!user.reason || user.reason.trim() === '')) {
            alert("Please tell us why you want to be friends");
            return;
          }
          if (user.option === 'relationship' && showLoveReason && (!user.loveReason || user.loveReason.trim() === '')) {
            alert("Please share your plans for the relationship");
            return;
          }
        }
      }
      
      // Prepare data for submission
      const dataToSubmit = {...user};
      
      // No need to check image size here as Cloudinary will handle optimization
      // The backend will upload the image to Cloudinary and store the URL

      // Save the data to be submitted for use in the success screen
      setSubmittedUserData(dataToSubmit);

      // Show loading state
      setIsLoading(true);

      // Submit data to API
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
      });

      // Hide loading state
      setIsLoading(false);

      const result = await response.json();

      if (!response.ok) {
        console.error('Error submitting form:', result);
        
        // Show appropriate error message to user
        if (result.errors) {
          // Format validation errors
          const errorMessages = Object.entries(result.errors)
            .map(([field, message]) => `${field}: ${message}`)
            .join('\n');
          
          alert(`Please fix the following errors:\n${errorMessages}`);
        } else {
          alert(result.message || 'An error occurred while submitting the form. Please try again.');
        }
      } else {
        console.log('Form submitted successfully:', result);
        
        // Update submitted user data with Cloudinary image URL from response
        if (result.data && result.data.image) {
          setSubmittedUserData(prevData => ({
            ...prevData,
            image: result.data.image,
            imagePublicId: result.data.imagePublicId
          }));
        }
        
        // Reset form fields
        resetForm();
        
        // Set submitted state to show success screen
        setIsSubmitted(true);
        
        // Show appropriate celebration effect AFTER setting isSubmitted
        // This ensures animations are visible on the success screen
        setTimeout(() => {
          if (dataToSubmit.gender === 'Kudii' && dataToSubmit.option === "relationship") {
            setShowHearts(true);
            setTimeout(() => setShowHearts(false), 8000); // Longer duration
          } else {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 8000); // Longer duration
          }
        }, 300); // Small delay to ensure success screen is rendered
      }
    } catch (error) {
      // Hide loading state
      setIsLoading(false);
      
      console.error('Error submitting form:', error);
      alert('An unexpected error occurred. Please try again later.');
    }
  };

  /**
   * Handle Yes button click with celebration
   */
  const handleYesClick = () => {
    // First update the UI state
    setShowLoveReason(true);
    setShowNahiButton(false);
    
    // Then trigger the hearts animation with a slight delay
    setTimeout(() => {
      setShowHearts(true);
      // Keep hearts visible for longer
      setTimeout(() => setShowHearts(false), 8000);
    }, 300);
  };

  /**
   * Effect to show different messages based on gender and age
   * Updates whenever age or gender changes
   */
  useEffect(() => {
    const age = parseInt(user.age);
    if (isNaN(age)) return;

    // Reset education when age changes
    setUser(prev => ({...prev, education: "", educationProgram: ""}));
    setEducationMessage("");

    // Different messages for males based on age - enhanced with more respectful and engaging content
    if (user.gender === "Munda") {
      if (age <= 4) {
        setAgeMessage("Oho! Sohne Bacche 👶 Mobile toh door raho te dudh pio 🍼 Khedo jao!");
      } else if (age >= 5 && age <= 14) {
        setAgeMessage("Sohne Bacche 😊 Padhai likhai vich dhyan lao, mobile thoda kam chalao. Ki haal chaal ne? 💬");
      } else if (age >= 15 && age <= 30) {
        setAgeMessage("Assalam-o-Alaikum Paaji! 🙏 Tussi form fill kar rahe ho, bahut vadiya! Gal baat kariye sanu 💬");
      } else if (age > 30) {
        setAgeMessage("Assalam-o-Alaikum Vadde Bhaji! 🙏 Tussi apna tajurba te gyaan sanjha karo saade naal 🌟");
      }
    } 
    // Different messages for females based on age - enhanced with more respectful and engaging content
    else if (user.gender === "Kudii") {
      if (age < 5) {
        setAgeMessage("Sohni Kudi! 👶 Jao khedo te masti karo, form baad vich bharna 🪀");
      }
      else if (age < 18) {
        setAgeMessage("Sohni Behna! 💖 Padhai vich dhyan deo, future bright banao. Saanu dasna ki padhna chaundi ho? 📚");
      }
      else if (age >= 18 && age <= 30) {
        setAgeMessage("Assalam-o-Alaikum Ji! ✨ Tussi bahut sohne ho! Relationship ch interested ho? Saanu bahut khushi hogi! 💕");
      }
      else if (age > 30) {
        setAgeMessage("Assalam-o-Alaikum Anti! 🙏 Tussi apna gyaan sanjha karo saade naal, bahut meherbani hogi 💫");
      }
    }
  }, [user.age, user.gender]); // Only runs when age or gender changes
  
  // Determine background gradient based on gender and age with a longer transition
  const getBackgroundGradient = () => {
    if (!user.gender) return "from-[#22093E] via-[#8E044B] to-[#FF7F4C]";
    
    if (user.gender === "Munda") {
      const age = parseInt(user.age);
      if (isNaN(age)) return "from-[#22093E] via-[#8E044B] to-[#FF7F4C]";
      
      if (age < 15) return "from-blue-500 via-cyan-400 to-sky-300";
      if (age >= 15 && age <= 30) return "from-indigo-600 via-blue-500 to-cyan-400";
      return "from-slate-700 via-slate-500 to-slate-400";
    } else {
      const age = parseInt(user.age);
      if (isNaN(age)) return "from-[#22093E] via-[#8E044B] to-[#FF7F4C]";
      
      if (age < 18) return "from-pink-400 via-rose-300 to-red-200";
      if (age >= 18 && age <= 30) {
        if (user.option === "relationship") return "from-rose-500 via-pink-500 to-purple-400";
        return "from-fuchsia-500 via-pink-500 to-rose-400";
      }
      return "from-purple-700 via-purple-500 to-purple-300";
    }
  };

  // Success screen after form submission
  if (isSubmitted) {
    // Generate personalized success message based on user data
    const getSuccessMessage = () => {
      // Use the saved submitted data instead of potentially undefined dataToSubmit
      const userData = submittedUserData || {};
      // Save the user's name for reference
      const userName = userData.name || '';
      
      // For female users who selected relationship
      if (userData.gender === 'Kudii' && userData.option === "relationship") {
        const loveMessages = [
          `Mashallah ${userName}! Tussi ta dil chura liya! 💘 Hum jald hi milenge, promise! 💖`,
          `${userName} jaan! Tussi great ho! Sanu wait karna, assi jald hi message karaan ge! 💝`,
          `Oye hoye ${userName}! Kya baat ae! Relationship ch welcome! Assi v excited aan! 💓`,
          `${userName} meri jaan! Tuhada pyar mil gya hai! Jald hi gal karaan ge! 💕`,
          `${userName} sweetheart! Tussi sanu bahut pasand ho! Assi tuhanu bahut pyaar karaan ge! 💘`,
          `${userName} ji! Tussi sanu mil gaye, hun koi fikar nahi! Assi tuhanu kabhi nahi chhadaan ge! 💖`
        ];
        return loveMessages[Math.floor(Math.random() * loveMessages.length)];
      }
      
      // For male users
      else if (userData.gender === 'Munda') {
        const maleMessages = [
          `Shabash ${userName} paaji! Tuhaada form submit ho gya! Hune reply aanda! 🎉`,
          `${userName} veer ji! Tussi kamaal kar ditta! Assi jald hi vapas aavange! 🚀`,
          `Oye ${userName}! Tuhadi application mil gayi! Thodi der baad check karna! 😎`,
          `${userName} bai ji! Form poora ho gya! Vadiya kam kitta tussi! 👍`
        ];
        return maleMessages[Math.floor(Math.random() * maleMessages.length)];
      }
      
      // For female users with other options - encourage relationship
      else if (userData.gender === 'Kudii') {
        const femaleMessages = [
          `Thank you ${userName} ji! Tuhadi application mil gayi hai! Jald hi vapas sunange! ✨`,
          `${userName} ji, tussi bahut vadiya ho! Form submit ho gya! 💫`,
          `Hey ${userName}! Assi excited aan tuhade naal connect karan layi! 🌸`,
          `${userName} ji! Tuhada form aa gya saade kol! Jald hi milange! 💐`
        ];
        return femaleMessages[Math.floor(Math.random() * femaleMessages.length)];
      }
      
      // Default message if gender is not specified
      else {
        const defaultMessages = [
          `Thank you for submitting your application! We'll be in touch soon! 🎊`,
          `Woohoo! Your form has been received! We'll get back to you shortly! 🥳`,
          `Application submitted successfully! We're excited to connect with you! 🌟`,
          `Thanks for reaching out! Your submission is in our inbox now! 🎯`
        ];
        return defaultMessages[Math.floor(Math.random() * defaultMessages.length)];
      }
    };

    return (
      <div className={`min-h-screen bg-gradient-to-b ${getBackgroundGradient()} w-full flex items-center justify-center overflow-hidden`}>
        {/* Success card with enhanced styling */}
        <div className="relative bg-white/20 backdrop-blur-md p-8 rounded-2xl shadow-2xl max-w-md mx-auto text-center transform transition-all animate-fade-in z-10">
          {/* Glowing border effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl opacity-70 blur-sm"></div>
          
          <div className="relative">
            {/* Success checkmark with animation */}
            <div className="w-28 h-28 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse-slow">
              <span className="text-5xl">✓</span>
            </div>
            
            <h1 className="text-4xl font-bold mb-4 text-white drop-shadow-md">
              {submittedUserData?.gender === 'Kudii' && submittedUserData?.option === "relationship" 
                ? "Dil Khush Ho Gya! 💖" 
                : "Thank You! 🎉"}
            </h1>
            
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              {getSuccessMessage()}
            </p>
            
            {/* User image if available */}
            {submittedUserData?.image && (
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white/70 shadow-xl mx-auto mb-6">
                <img
                  src={submittedUserData.image}
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setIsSubmitted(false)}
                className="px-6 py-3 bg-white text-purple-600 rounded-full font-bold hover:bg-purple-50 transition-all shadow-lg hover:scale-105 transform"
              >
                Go Back
              </button>
              
              <button 
                onClick={() => {
                  setIsSubmitted(false);
                  resetForm();
                }}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:scale-105 transform"
              >
                Start Over
              </button>
            </div>
          </div>
        </div>
        
        {/* Make sure animations are visible */}
        {showConfetti && <Confetti />}
        {showHearts && <FloatingHearts />}
        
        {/* Additional background decorations */}
        <div className="fixed bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen w-full bg-gradient-to-b ${getBackgroundGradient()} transition-all duration-3000`}>
      {/* Show loading spinner during form submission */}
      {isLoading && <LoadingSpinner />}
      
      {showConfetti && <Confetti />}
      {showHearts && <FloatingHearts />}

      {/* Parent div - main content container */}
      <div className="flex flex-col justify-center md:w-[800px] mx-auto w-full pt-12 px-4 md:px-0">
        {/* Introduction section - profile information with enhanced styling */}
        <div className="flex flex-col justify-center items-center gap-5 mb-12 animate-fade-in">
          {/* Enhanced welcome message with decorative elements */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full opacity-70 blur"></div>
            <h1 className="relative text-4xl font-bold text-white py-2 px-8 rounded-full bg-white/10 backdrop-blur-md">
              <span className="animate-pulse inline-block mr-2">✨</span>
              Ji Aaya Nu Sohneyo!
              <span className="animate-pulse inline-block ml-2">✨</span>
            </h1>
          </div>
          
          {/* Enhanced profile image with animated border and effects */}
          <div className="relative group mt-4">
            {/* Animated glow effect */}
            <div className={`absolute -inset-1 bg-gradient-to-r from-pink-600 via-purple-500 to-blue-600 rounded-full opacity-75 group-hover:opacity-100 blur-md transition duration-1000 group-hover:duration-200 ${ANIMATIONS.spinSlow}`}></div>
            
            {/* Decorative elements around the profile */}
            <div className={`absolute -top-4 -right-4 text-3xl ${ANIMATIONS.bounceSlow}`}>🌟</div>
            <div className={`absolute -bottom-4 -left-4 text-3xl ${ANIMATIONS.bounceSlow}`}>💫</div>
            
            {/* Profile image with enhanced styling */}
            <div className="relative p-1 bg-gradient-to-r from-white/30 to-white/10 backdrop-blur-sm rounded-full">
              <Image
                src="/profile.jpeg"
                alt="Profile"
                width={220}
                height={220}
                className="rounded-full object-cover border-2 border-white/50 group-hover:scale-105 transition-all duration-300 shadow-2xl"
              />
            </div>
          </div>
          
          {/* Enhanced name display with animated elements */}
          <div className="relative mt-4">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg opacity-70 blur-sm"></div>
            <h1 className="relative text-5xl font-bold text-white drop-shadow-lg py-2 px-6 rounded-lg bg-black/10 backdrop-blur-sm">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500">M.Mubeen</span>
              <span className="inline-block ml-2 animate-pulse">😎</span>
            </h1>
          </div>
          
          {/* Enhanced qualification badges with improved styling */}
          <div className="flex gap-6 mt-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-300 rounded-full opacity-70 blur-sm group-hover:opacity-100 transition-all duration-300"></div>
              <span className="relative flex items-center gap-2 bg-white/20 backdrop-blur-md px-5 py-3 rounded-full text-white font-semibold shadow-xl group-hover:scale-105 transition-all duration-300">
                <span className="text-2xl">👑</span>
                <span className="text-lg">22 Years</span>
              </span>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-green-300 rounded-full opacity-70 blur-sm group-hover:opacity-100 transition-all duration-300"></div>
              <span className="relative flex items-center gap-2 bg-white/20 backdrop-blur-md px-5 py-3 rounded-full text-white font-semibold shadow-xl group-hover:scale-105 transition-all duration-300">
                <span className="text-2xl">🎓</span>
                <span className="text-lg">IT Professional</span>
              </span>
            </div>
          </div>
          
          {/* Decorative divider */}
          <div className="w-full max-w-md flex items-center gap-4 mt-4 mb-2">
            <div className="h-px flex-grow bg-white/30"></div>
            <span className="text-2xl">💝</span>
            <div className="h-px flex-grow bg-white/30"></div>
          </div>
        </div>

        {/* Heartfelt message to encourage genuine responses */}
        <HeartfeltMessage />

        {/* User information section - form fields */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl mb-8 animate-slide-up">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            {user.gender === "Munda" 
              ? "Dil Di Gal Dasso Paaji! 💫" 
              : "Kuch Apne Baare Ch Dasso Jee! 💕"}
          </h2>
          <div className="space-y-4">
            {/* Name input field */}
            <input
              type="text"
              placeholder="✨ Apna Pyara Naam Likho Ji *"
              value={user.name}
              onChange={handleNameInput}
              className="w-full p-3 rounded-lg border-2 border-purple-100 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all bg-white/90 text-gray-800 font-medium placeholder:text-gray-500"
            />
            {/* Gender select field */}
            <select
              value={user.gender}
              onChange={(e) =>
                setUser((prev) => ({ ...prev, gender: e.target.value }))
              }
              className="w-full p-3 rounded-lg border-2 border-purple-100 bg-white/90 text-gray-800 font-medium appearance-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all placeholder:text-gray-500"
            >
              <option value="">👫 Dasso Ji, Tusi Munda ho ya Kudi? *</option>
              <option value="Munda">👦 Munda</option>
              <option value="Kudii">👩 Kudii</option>
            </select>
            
            {/* Age input for males - numeric only */}
            {user.gender === "Munda" && (
              <input
                type="text"
                placeholder="🎂 Kitne Saal De Ho Gaye Ho? *"
                value={user.age}
                onChange={handleAgeInput}
                className="w-full p-3 rounded-lg border-2 border-purple-100 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all bg-white/90 text-gray-800 font-medium placeholder:text-gray-500 animate-fade-in"
              />
            )}
            
            {/* Age input for females - numeric only */}
            {user.gender === "Kudii" && (
              <input
                type="text"
                placeholder="🎂 Kitne Saal Di Ho Gayi Ho? *"
                value={user.age}
                onChange={handleAgeInput}
                className="w-full p-3 rounded-lg border-2 border-purple-100 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all bg-white/90 text-gray-800 font-medium placeholder:text-gray-500 animate-fade-in"
              />
            )}
            
            {/* Display age-based message with improved styling */}
            {user.age && (
              <div className="col-span-2">
                {/* Enhanced age display with improved styling and animations */}
                <div className="relative">
                  {/* Background glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 rounded-xl blur-md animate-pulse-slow"></div>
                  
                  {/* Main container with improved styling */}
                  <div className="relative p-6 bg-white/20 backdrop-blur-md rounded-xl text-center border border-white/30 shadow-xl">
                    {/* Age header with animated icons */}
                    <div className="flex items-center justify-center mb-4">
                      {user.gender === "Munda" ? 
                        <span className={`text-3xl mr-3 ${ANIMATIONS.float}`}>👦</span> : 
                        <span className={`text-3xl mr-3 ${ANIMATIONS.float}`}>👩</span>
                      }
                      <div className="h-px flex-grow bg-gradient-to-r from-transparent via-white/70 to-transparent"></div>
                      <div className="mx-3 px-4 py-2 bg-white/30 backdrop-blur-sm rounded-full border border-white/40 shadow-inner">
                        <span className="text-2xl font-bold text-white drop-shadow-md">
                          {parseInt(user.age)}
                        </span>
                      </div>
                      <div className="h-px flex-grow bg-gradient-to-r from-transparent via-white/70 to-transparent"></div>
                    </div>
                    
                    {/* Age message with enhanced styling */}
                    <div className="mb-4 p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                      <p className="text-white font-bold text-lg leading-relaxed">{ageMessage}</p>
                    </div>
                    
                    {/* Inspirational quote with decorative elements */}
                    <div className="relative">
                      <div className="absolute -inset-0.5 bg-white/5 rounded-lg blur-sm"></div>
                      <div className="relative flex items-center justify-center mb-2">
                        <span className="text-lg mr-2">💫</span>
                        <div className="h-px w-12 bg-white/30"></div>
                        <span className="text-lg mx-2">💭</span>
                        <div className="h-px w-12 bg-white/30"></div>
                        <span className="text-lg ml-2">💫</span>
                      </div>
                      <p className="text-white/80 text-sm mt-2 italic px-3 py-2 bg-white/5 backdrop-blur-sm rounded-lg">
                        {user.gender === "Munda" 
                          ? "Umran ch ki rakhya, dil jawan hona chahida!" 
                          : "Umran sirf ik number hai, dil di gal vaddi hai!"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Education select field - only show if age >= 4 */}
            {user.gender && user.age && parseInt(user.age) >= 4 && (
              <div className="space-y-4 animate-fade-in">
                <select
                  value={user.education}
                  onChange={handleEducationChange}
                  className="w-full p-3 rounded-lg border-2 border-purple-100 bg-white/90 text-gray-800 font-medium appearance-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all"
                >
                  {getEducationOptions().map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                
                {/* Show education program input for BS */}
                {user.education === "bs" && (
                  <input
                    type="text"
                    placeholder="🎓 Kess Program vchh"
                    value={user.educationProgram}
                    onChange={(e) =>
                      setUser((prev) => ({ ...prev, educationProgram: e.target.value }))
                    }
                    className="w-full p-3 rounded-lg border-2 border-purple-100 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all bg-white/90 text-gray-800 font-medium placeholder:text-gray-500 animate-fade-in"
                  />
                )}
                
                {/* Show education message for Un-Padh */}
                {educationMessage && (
                  <div className="p-3 bg-red-500/20 backdrop-blur-sm rounded-lg text-center animate-fade-in">
                    <p className="text-white font-bold">{educationMessage}</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Residence input */}
            <input
              type="text"
              placeholder="🏡 Tussi Kitthe Rehende Ho? *"
              value={user.residence}
              onChange={(e) =>
                setUser((prev) => ({ ...prev, residence: e.target.value }))
              }
              className="w-full p-3 rounded-lg border-2 border-purple-100 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all bg-white/90 text-gray-800 font-medium placeholder:text-gray-500"
            />
            
            {/* Phone number input */}
            <input
              type="number"
              placeholder="🤙 Apna Number Dasso (Promise Secret Rakhange) *"
              value={user.number}
              onChange={(e) =>
                setUser((prev) => ({ ...prev, number: e.target.value }))
              }
              className="w-full p-3 rounded-lg border-2 border-purple-100 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all bg-white/90 text-gray-800 font-medium placeholder:text-gray-500"
            />
            
            {/* Image upload section */}
            <div className="flex flex-col items-center gap-4 mt-6">
              {/* Show image preview if uploaded */}
              {user.image && (
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white/70 shadow-xl group">
                  <img
                    src={isCloudinaryUrl(user.image) ? optimizeCloudinaryUrl(user.image, { width: 200, height: 200 }) : user.image}
                    alt="User Preview"
                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2">
                    <span className="text-white text-xs">Your Photo</span>
                  </div>
                </div>
              )}
              {/* Hidden file input */}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="imageUpload"
              />
              {/* Custom label button for image upload */}
              <label
                htmlFor="imageUpload"
                className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg cursor-pointer hover:bg-white/30 transition-all text-white shadow-md"
              >
                📷 Apni Sohni Jehi Photo Upload Karo * {!user.image && '(Required)'}
              </label>
            </div>
          </div>
        </div>

        {/* Invitation section - different options based on gender and age */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl mb-8 animate-slide-up animation-delay-300">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            {user.gender === "Munda" 
              ? "Dil Di Gal Dasso Paaji! 💫" 
              : "Kuch Apne Baare Ch Dasso Jee! 💕"}
          </h2>
          
          {/* Options for males */}
          {user.gender === "Munda" && (
            <div className="space-y-4 animate-fade-in">
              {/* Passion input */}
              <input
                type="text"
                placeholder="🔥 Zindagi Ch Ki Karna Pasand Hai? *"
                value={user.passion}
                onChange={(e) =>
                  setUser((prev) => ({ ...prev, passion: e.target.value }))
                }
                className="w-full p-3 rounded-lg border-2 border-purple-100 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all bg-white/90 text-gray-800 font-medium placeholder:text-gray-500"
              />
              {/* Options select for males */}
              <select
                value={user.option}
                onChange={(e) =>
                  setUser((prev) => ({ ...prev, option: e.target.value }))
                }
                className="w-full p-3 rounded-lg border-2 border-purple-100 bg-white/90 text-gray-800 font-medium appearance-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all"
              >
                <option value="">🤝 Saanu Dasso, Ki Chahide? *</option>
                <option value="friendship">🤝 Friendship</option>
                <option value="suggestions">💡 Personality Suggestions</option>
              </select>

              {/* Reason for friendship */}
              {user.option === "friendship" && (
                <textarea
                  placeholder="💬 Dosti Kyun Karni Chaunde Ho Saade Naal? *"
                  value={user.reason}
                  onChange={(e) =>
                    setUser((prev) => ({ ...prev, reason: e.target.value }))
                  }
                  className="w-full p-3 rounded-lg border-2 border-purple-100 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all h-32 bg-white/90 text-gray-800 font-medium placeholder:text-gray-500 animate-fade-in"
                />
              )}
              
              {/* Personality Suggestions text area */}
              {user.option === "suggestions" && (
                <div className="animate-fade-in space-y-4">
                  <div className="p-3 bg-indigo-500/20 backdrop-blur-sm rounded-lg text-center">
                    <p className="text-white font-medium">✨ Apne baare vich kuch khaas dasso!</p>
                  </div>
                  <textarea
                    placeholder="💭 Apne Baare Ch Kuch Khaas Dasso... *"
                    value={user.reason}
                    onChange={(e) =>
                      setUser((prev) => ({ ...prev, reason: e.target.value }))
                    }
                    className="w-full p-3 rounded-lg border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all h-40 bg-white/90 text-gray-800 font-medium placeholder:text-gray-500"
                  />
                </div>
              )}
            </div>
          )}

          {/* Options for females */}
          {user.gender === "Kudii" && (
            <div className="space-y-4 animate-fade-in">
              {/* Age-based fields */}
              {/* Hobbies input for teenage girls */}
              {user.age >= 14 && user.age < 18 && (
                <input
                  type="text"
                  placeholder="🎨 Free Time Ch Ki Karna Pasand Hai? *"
                  value={user.hobbies}
                  onChange={(e) =>
                    setUser((prev) => ({ ...prev, hobbies: e.target.value }))
                  }
                  className="w-full p-3 rounded-lg border-2 border-purple-100 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all bg-white/90 text-gray-800 font-medium placeholder:text-gray-500 animate-fade-in"
                />
              )}
              
              {/* Advice input for older women */}
              {user.age > 30 && (
                <textarea
                  placeholder="💡 Koi Changi Salah Deni Hai Saanu? *"
                  value={user.advice}
                  onChange={(e) =>
                    setUser((prev) => ({ ...prev, advice: e.target.value }))
                  }
                  className="w-full p-3 rounded-lg border-2 border-purple-100 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all h-32 bg-white/90 text-gray-800 font-medium placeholder:text-gray-500 animate-fade-in"
                />
              )}

              {/* Relationship section - only for women aged 18-30 */}
              {user.age >= 18 && user.age <= 30 && (
                <div className="space-y-6 animate-fade-in">
                  {/* Options select */}
                  <select
                    value={user.option}
                    onChange={(e) =>
                      setUser((prev) => ({ ...prev, option: e.target.value }))
                    }
                    className="w-full p-3 rounded-lg border-2 border-purple-100 bg-white/90 text-gray-800 font-medium appearance-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all"
                  >
                    <option value="">💖 Dil Di Gal Dasso... *</option>
                    <option value="friendship">💞 Friendship</option>
                    <option value="relationship">💘 Relationship</option>
                  </select>

                  {/* Reason for friendship */}
                  {user.option === "friendship" && (
                    <textarea
                      placeholder="💬 Dosti Layi Kyun Sochya Saade Baare? *"
                      value={user.reason}
                      onChange={(e) =>
                        setUser((prev) => ({
                          ...prev,
                          reason: e.target.value,
                        }))
                      }
                      className="w-full p-3 rounded-lg border-2 border-purple-100 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all h-32 bg-white/90 text-gray-800 font-medium placeholder:text-gray-500 animate-fade-in"
                    />
                  )}

                  {/* Fun interactive buttons for relationship option */}
                  {user.option === "relationship" && (
                    <div className="relative bg-white/20 backdrop-blur-sm p-6 rounded-xl shadow-lg animate-fade-in">
                      <div className="text-center my-4">
                        <span className="text-3xl font-bold text-white drop-shadow-md">
                          💖 Ki Tusi Saanu Pasand Karde Ho? 😍
                        </span>
                        <div className="mt-6 space-x-6 flex justify-center">
                          {/* Yes button */}
                          <button
                            onClick={handleYesClick}
                            className="bg-green-500 text-white px-8 py-3 rounded-full hover:bg-green-600 hover:scale-105 transform transition-all duration-300 shadow-lg"
                          >
                            Haan Ji, Bilkul!
                          </button>

                          {/* No button - moves when hovered */}
                          {showNahiButton && <MovingNahiButton />}
                        </div>
                      </div>

                      {/* Love reason textarea - shown after clicking Yes */}
                      {showLoveReason && (
                        <div className="mt-6 animate-fade-in">
                          <textarea
                            placeholder="💖 Saade Naal Kinna Pyaar Karoge? *"
                            value={user.loveReason}
                            onChange={(e) =>
                              setUser((prev) => ({
                                ...prev,
                                loveReason: e.target.value,
                              }))
                            }
                            className="w-full p-4 rounded-lg border-2 border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition-all h-32 bg-white/90 text-gray-800 font-medium placeholder:text-gray-500"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Submit button with conditional text */}
          {(user.gender && user.age) && (
            <button 
              type="button"
              onClick={handleSubmit}
              className="w-full mt-8 p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg transform hover:scale-105 animate-pulse-slow"
            >
              {user.gender === 'Kudii' && user.option === "relationship" 
                ? 'Dil De Rishtey Nu Pakka Karo 💘' 
                : 'Chalo Fir Mulaqat Karde Haan 🚀'}
            </button>
          )}
        </div>

        {/* Footer section - enhanced with better styling */}
        <div className="mt-12 mb-6 w-full">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur"></div>
            <div className="relative bg-white/10 backdrop-blur-sm rounded-xl py-4 px-6 flex flex-col items-center justify-center">
              <p className="text-white font-medium text-base animate-bounce-subtle">
                Made with <span className="text-red-500 text-xl">❤️</span> for fun
              </p>
              <p className="text-white/70 text-xs mt-2">
                © {new Date().getFullYear()} Fun For Friends App
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;