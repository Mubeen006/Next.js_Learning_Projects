"use client";
import React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";

const MovingNahiButton = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [attempts, setAttempts] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const handleMouseEnter = () => {
    if (!isActive) return;

    // Always move the button
    setPosition({
      x: Math.random() * 200 - 100, // Increased movement range
      y: Math.random() * 200 - 100,
    });

    setAttempts((prev) => prev + 1);

    // Show message every 3 attempts
    if ((attempts + 1) % 3 === 0) {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 1500);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        className={`bg-red-500 text-white px-6 py-2 rounded-full transition-all duration-300 ${
          isActive ? "hover:bg-red-600" : "opacity-50 cursor-not-allowed"
        }`}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: "transform 0.3s ease-out",
        }}
        onMouseEnter={handleMouseEnter}
        onTouchStart={handleMouseEnter} // For mobile devices
      >
        Nahi
      </button>

      {showMessage && (
        <div className="absolute top-full left-0 mt-2 animate-bounce">
          <span className="bg-white p-2 rounded-lg shadow-lg text-red-500">
            Mann jao na Please.... 😢
          </span>
        </div>
      )}
    </div>
  );
};
const page = () => {
  const [user, setUser] = useState({
    name: "",
    gender: "",
    option: "",
    age: "",
    education: "",
    residence: "",
    passion: "",
    reason: "",
    loveReason: "",
    advice: "",
    hobbies: "",
    number: "",
    image: null,
  });

  const [ageMessage, setAgeMessage] = useState("");
  const [showNahiButton, setShowNahiButton] = useState(true);
  const [showLoveReason, setShowLoveReason] = useState(false);
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

  useEffect(() => {
    const age = parseInt(user.age);
    if (isNaN(age)) return;

    if (user.gender === "Munda") {
      if (age < 4) setAgeMessage("Oooo koe phidirr phadao eeno 👶🍼");
      else if (age >= 15 && age <= 30)
        setAgeMessage("To kasy hain ap, aajo gall baat krdy aa 💬😊");
      else if (age > 30)
        setAgeMessage("Bazurgoo koe Changiii gall hi ds jaoo 👴🗣️");
    } else if (user.gender === "Kudii") {
      if (age < 5) setAgeMessage("Bytaa jaaao khylooo 🪀👶");
      else if (age < 18)
        setAgeMessage(
          "Tyra koe kmm nahi ithyy, Kuch padhlaa, ty gr dy kam kr 📚🧑🎓"
        );
      else if (age >= 18 && age <= 30)
        setAgeMessage("O May Sdkyy , Kii haal ny ✨💐");
      else if (age > 30)
        setAgeMessage(
          "Mazrtt Antii tusiii jaa skdyy o, tohada koe kmm nahi ithyy 🚩👵"
        );
    }
  }, [user.age, user.gender]);
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#22093E] via-[#8E044B] to-[#FF7F4C] w-full">
      {/* Background */}
      {/* <div className="min-h-screen bg-gradient-to-b from-[#22093E] via-[#8E044B] to-[#FF7F4C]"> 
      </div> */}
      {/* <div className="gradient-box min-h-screen w-screen">
      </div> */}

      {/* parent div */}
      <div className="  flex flex-col justify-center md:w-[800px] mx-auto w-full pt-12">
        {/* intro section */}
        <div className="flex flex-col justify-center items-center gap-5">
          <h1>Gi Aya Nu 🥰</h1>
          <Image
            src="/profile.jpeg"
            alt="Profile"
            width={200}
            height={200}
            className="rounded-full object-cover"
          />
          <h1 className="text-4xl">M.Mubeen 😎...</h1>
          <span>👴: 22 </span>
          <span>🎓 (IT)</span>
        </div>

        {/* user infromation section */}
        <div>
          <div>
            <input
              type="text"
              placeholder="✨ Ki Naam Ay Tyra"
              value={user.name}
              onChange={(e) =>
                setUser((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full p-3 rounded-lg border-2 border-purple-100 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all"
            />
            <select
              value={user.gender}
              onChange={(e) =>
                setUser((prev) => ({ ...prev, gender: e.target.value }))
              }
              className="w-full p-3 rounded-lg border-2 text-slate-400 border-purple-100 bg-white appearance-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all"
            >
              <option value="">👫 Apna Gnender Dsoo</option>
              <option value="Munda">👦 Munda</option>
              <option value="Kudii">👩 Kudii</option>
            </select>
            {user.gender === "Munda" && (
              <input
                type="number"
                placeholder="🎂Apni Umar Dsoo"
                value={user.age}
                onChange={(e) =>
                  setUser((prev) => ({ ...prev, age: e.target.value }))
                }
                className="w-full p-3 rounded-lg border-2 border-purple-100 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all"
              />
            )}
            {user.gender === "Kudii" && (
              <input
                type="number"
                placeholder="🎂Apni Umar Dsoo"
                value={user.age}
                onChange={(e) =>
                  setUser((prev) => ({ ...prev, age: e.target.value }))
                }
                className="w-full p-3 rounded-lg border-2 border-purple-100 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all"
              />
            )}
            {user.age && (
              <div className="mt-4 p-3 bg-white/20 rounded-lg text-center">
                <p className="text-white font-bold">{ageMessage}</p>
              </div>
            )}
            {user.gender === "Munda" && (
              <input
                type="text"
                placeholder="🎓 Kina Padya"
                value={user.education}
                onChange={(e) =>
                  setUser((prev) => ({ ...prev, education: e.target.value }))
                }
                className="w-full p-3 rounded-lg border-2 border-purple-100 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all"
              />
            )}
            {user.gender === "Kudii" && (
              <input
                type="text"
                placeholder="🎓 Knii Padii"
                value={user.education}
                onChange={(e) =>
                  setUser((prev) => ({ ...prev, education: e.target.value }))
                }
                className="w-full p-3 rounded-lg border-2 border-purple-100 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all"
              />
            )}
            <input
              type="text"
              placeholder="🏡 Kithy Randy Oo "
              value={user.residence}
              onChange={(e) =>
                setUser((prev) => ({ ...prev, residence: e.target.value }))
              }
              className="w-full p-3 rounded-lg border-2 border-purple-100 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all"
            />
            <input
              type="number"
              placeholder="🤙 Number V Dy Dwoo😉"
              value={user.number}
              onChange={(e) =>
                setUser((prev) => ({ ...prev, number: e.target.value }))
              }
              className="w-full p-3 rounded-lg border-2 border-purple-100 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all"
            />
            <div className="flex  flex-col items-center gap-4 mb-8">
              {user.image && (
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white">
                  <img
                    src={user.image}
                    alt="User Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="imageUpload"
              />
              <label
                htmlFor="imageUpload"
                className="px-4 py-2 bg-white/20 rounded-lg cursor-pointer hover:bg-white/30"
              >
                📷 Apni photo chvao
              </label>
            </div>
          </div>
        </div>

        {/* invitation section */}
        <div>
          {/* for male*/}
          {user.gender === "Munda" && (
            <>
              <input
                type="text"
                placeholder="🔥Passion Dsoo apna"
                value={user.passion}
                onChange={(e) =>
                  setUser((prev) => ({ ...prev, passion: e.target.value }))
                }
                className="w-full p-3 rounded-lg border-2 border-purple-100 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all"
              />
              {/* Male Options */}
              <select
                value={user.option}
                onChange={(e) =>
                  setUser((prev) => ({ ...prev, option: e.target.value }))
                }
                className="w-full p-3 rounded-lg border-2 border-purple-100 bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all"
              >
                <option value="">🤝Pasand Kro</option>
                <option value="friendship">🤝 Friendship</option>
                <option value="suggestions">💡 Personality Suggestions</option>
              </select>

              {user.option === "friendship" && (
                <textarea
                  placeholder="💬 Waaah g! Friend Q Bnna?"
                  value={user.reason}
                  onChange={(e) =>
                    setUser((prev) => ({ ...prev, reason: e.target.value }))
                  }
                  className="w-full p-3 rounded-lg border-2 border-purple-100 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all h-32"
                />
              )}
            </>
          )}

          {/* for feemale */}
          <div>
            {user.gender === "Kudii" && (
              <>
                {/* Age-based fields */}
                {user.age >= 14 && user.age < 18 && (
                  <input
                    type="text"
                    placeholder="🎨 Apni hobbies dsoo"
                    value={user.hobbies}
                    onChange={(e) =>
                      setUser((prev) => ({ ...prev, hobbies: e.target.value }))
                    }
                    className="w-full p-3 rounded-lg border-2 border-purple-100 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all"
                  />
                )}
                {user.age > 30 && (
                  <textarea
                    placeholder="💡 Apna advice dsoo"
                    value={user.advice}
                    onChange={(e) =>
                      setUser((prev) => ({ ...prev, advice: e.target.value }))
                    }
                    className="w-full p-3 rounded-lg border-2 border-purple-100 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all h-32"
                  />
                )}

                {/* Relationship section */}
                {user.age >= 18 && user.age <= 30 && (
                  <>
                    <select
                      value={user.option}
                      onChange={(e) =>
                        setUser((prev) => ({ ...prev, option: e.target.value }))
                      }
                      className="w-full p-3 rounded-lg border-2 border-purple-100 bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all"
                    >
                      <option value="">💖 Pasand Kro</option>
                      <option value="friendship">💞 Friendship</option>
                      <option value="relationship">💘 Relationship</option>
                    </select>

                    {user.option === "friendship" && (
                      <textarea
                        placeholder="💬 Q..??"
                        value={user.reason}
                        onChange={(e) =>
                          setUser((prev) => ({
                            ...prev,
                            reason: e.target.value,
                          }))
                        }
                        className="w-full p-3 rounded-lg border-2 border-purple-100 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all h-32"
                      />
                    )}

                    {user.option === "relationship" && (
                      <div className="relative">
                        <div className="text-center my-4">
                          <span className="text-2xl">💖Schiii😍😍😍</span>
                          <div className="mt-4 space-x-4">
                            <button
                              onClick={() => {
                                setShowLoveReason(true);
                                setShowNahiButton(false);
                              }}
                              className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600"
                            >
                              Hangii
                            </button>

                            {showNahiButton && <MovingNahiButton />}
                          </div>
                        </div>

                        {showLoveReason && (
                          <textarea
                            placeholder="💖Ki Plane aa fir...?"
                            value={user.loveReason}
                            onChange={(e) =>
                              setUser((prev) => ({
                                ...prev,
                                loveReason: e.target.value,
                              }))
                            }
                            className="w-full p-3 rounded-lg border-2 border-purple-100 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all h-32"
                          />
                        )}
                      </div>
                    )}
                  </>
                )}
              </>
            )}
              {user.gender === 'Kudii' && user.option === "relationship"? 'Find True Love 💘' : 'Submit Application 🚀'}
          </div>

        </div>
        <div className="flex w-full h-36">

        </div>
      </div>
    </div>
  );
};

export default page;
