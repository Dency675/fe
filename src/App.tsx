import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
  useNavigate,
} from "react-router-dom";

const socket = io("http://localhost:3000", {
  transports: ["websocket"],
});

const userData = [
  { name: "mariyam", role: "admin" },
  { name: "ablel", role: "admin" },
  { name: "merin", role: "developer" },
  { name: "bency", role: "developer" },
  { name: "joel", role: "developer" },
  { name: "aljo", role: "developer" },
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");
  const [creator, setCreator] = useState<string>("");
  const [roomInfo, setRoomInfo] = useState<{
    roomId: string;
    currentTime: string;
    creator: string;
  }>({
    roomId: "",
    currentTime: "",
    creator: "",
  });

  //Room Creation - Data Fetched
  useEffect(() => {
    socket.on(
      "roomCreated",
      (data: { roomId: string; currentTime: string; creator: string }) => {
        console.log("creator");
        console.log(data.creator);
        setCreator(data.creator);
        console.log(creator);

        setRoomInfo((prev) => {
          console.log("prev ", prev);
          console.log("pp creator", creator);
          const newData = {
            ...prev,
            roomId: roomId,
            // currentTime:currentTime, // Copy previous state
            creator: creator, // Update the creator property
          };
          console.log("newData ", newData); // Log the new data
          return newData; // Return the new state
        });

        console.log(roomInfo);
        // alert("roominfo");
        // alert(roomInfo.creator);
        navigate(`/room/${data.roomId}/${data.creator}`);
        // Call the API to add default roles
        // fetch("/api/roles", {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({ name: "admin" }), // Add more roles as needed
        // })
        //   .then((response) => response.json())
        //   .then((data) => console.log("Role added:", data))
        //   .catch((error) => console.error("Error adding role:", error));
      }
    );
  }, [creator, name, navigate, roomId, roomInfo]);

  const createRoom = () => {
    const user = userData.find(
      (user) => user.name === name && user.role === "admin"
    );
    if (user) {
      console.log("createRoom name");
      // console.log(name);
      // console.log(user.name);
      socket.emit("createRoom", name);
      console.log(name);
      setCreator(name);
      console.log(user.name);
    } else {
      alert("You are not authorized to create a room.");
    }
  };

  const joinRoom = async () => {
    const user = userData.find((user) => user.name === name);
    if (user) {
      try {
        // Fetch room details from the database
        const response = await fetch(
          `http://localhost:3000/api/room/${roomId}`
        );
        if (!response.ok) {
          throw new Error("Room not found");
        }
        const data = await response.json();

        // Check if the user is authorized to join the room
        if (userData.some((user) => user.name === name)) {
          socket.emit("joinRoom", {
            roomId: data.data.roomId,
            creator: data.data.creator,
          });
          console.log(creator);
          console.log("data.data.roomId");
          console.log(data.data.roomId);
          console.log(typeof data.data.creator);
          setCreator("data.data.creator");
          console.log(creator);
          setRoomId(data.data.roomId);
          console.log("data.data.roomId");
          console.log(roomId);

          navigate(`/room/${roomId}/${name}`);
        } else {
          alert("You are not authorized to join this room.");
        }
      } catch (error) {
        console.error("Error joining room:", error);
        alert("Room not found.");
      }
    } else {
      alert("You are not authorized to join this room.");
    }
  }; // Run this effect whenever creator state changes
  // const creatorValue = creator; // Store the value of creator in a variable
  // console.log(creatorValue);
  return (
    <div>
      <h1>Welcome to the Room Manager</h1>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br />
      <button onClick={createRoom}>Create Room</button>
      <br />
      {roomInfo && (
        <p>
          Room ID: {roomInfo.roomId}, Created At: {roomInfo.currentTime},
          creator:{creator}
        </p>
      )}
      <br />
      <input
        type="text"
        placeholder="Enter Room ID to Join"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <br />
      <button type="button" onClick={joinRoom}>
        Join Room
      </button>
    </div>
  );
};

const Room: React.FC = () => {
  const { roomId, username } = useParams();
  // const [roomCreator, setRoomCreator] = useState<string>("");

  // console.log("roomCreator");
  // console.log(roomCreator);

  const startTimer = () => {
    // Implement start voting logic
  };

  return (
    <div>
      <h1>Room Details</h1>
      <p>Username: {username}</p>
      <p>Room ID: {roomId}</p>
      <p>Room Creator: {}</p>
      {username === "roomCreator" && (
        <button onClick={startTimer}>Start timer</button>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:roomId/:username" element={<Room />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;

// import React, { useState, useEffect, createContext, useContext } from "react";
// import { io } from "socket.io-client";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
//   useParams,
//   useNavigate,
// } from "react-router-dom";

// const socket = io("http://localhost:3000", {
//   transports: ["websocket"],
// });

// const UserContext = createContext<string>("");

// const userData = [
//   { name: "mariyam", role: "admin" },
//   { name: "ablel", role: "admin" },
//   { name: "merin", role: "developer" },
//   { name: "bency", role: "developer" },
//   { name: "joel", role: "developer" },
//   { name: "aljo", role: "developer" },
// ];

// const Home: React.FC = () => {
//   const navigate = useNavigate();
//   const [name, setName] = useState<string>("");
//   const [roomId, setRoomId] = useState<string>("");
//   // const [creator, setCreator] = useState<string>("");
//   const [roomInfo, setRoomInfo] = useState<{
//     roomId: string;
//     currentTime: string;
//     creator: string;
//   } | null>(null);

//   const createRoom = () => {
//     const user = userData.find(
//       (user) => user.name === name && user.role === "admin"
//     );
//     if (user) {
//       socket.emit("createRoom", name);
//       // setCreator(name);
//     } else {
//       alert("You are not authorized to create a room.");
//     }
//   };

//   useEffect(() => {
//     socket.on(
//       "roomCreated",
//       (data: { roomId: string; currentTime: string; creator: string }) => {
//         setRoomInfo(data);
//         navigate(`/room/${data.roomId}/${data.creator}`);
//       }
//     );
//   }, [navigate]);

//   const joinRoom = async () => {
//     const user = userData.find((user) => user.name === name);
//     if (user) {
//       try {
//         const response = await fetch(
//           `http://localhost:3000/api/room/${roomId}`
//         );
//         if (!response.ok) {
//           throw new Error("Room not found");
//         }
//         const data = await response.json();

//         if (userData.some((user) => user.name === name)) {
//           socket.emit("joinRoom", {
//             roomId: data.data.roomId,
//             creator: data.data.creator,
//           });
//           // setCreator(data.data.creator);
//           setRoomId(data.data.roomId);
//           navigate(`/room/${roomId}/${name}`);
//         } else {
//           alert("You are not authorized to join this room.");
//         }
//       } catch (error) {
//         console.error("Error joining room:", error);
//         alert("Room not found.");
//       }
//     } else {
//       alert("You are not authorized to join this room.");
//     }
//   };

//   return (
//     <div>
//       <h1>Welcome to the Room Manager</h1>
//       <input
//         type="text"
//         placeholder="Enter your name"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//       />
//       <br />
//       <button onClick={createRoom}>Create Room</button>
//       <br />
//       {roomInfo && (
//         <p>
//           Room ID: {roomInfo.roomId}, Created At: {roomInfo.currentTime},
//           creator: {roomInfo.creator}
//         </p>
//       )}
//       <br />
//       <input
//         type="text"
//         placeholder="Enter Room ID to Join"
//         value={roomId}
//         onChange={(e) => setRoomId(e.target.value)}
//       />
//       <br />
//       <button type="button" onClick={joinRoom}>
//         Join Room
//       </button>
//     </div>
//   );
// };

// const Room: React.FC = () => {
//   const { roomId, username } = useParams();
//   // const [roomCreator, setRoomCreator] = useState<string>("");
//   const roomCreator = useContext(UserContext);

//   // useEffect(() => {
//   //   if (username) {
//   //     setRoomCreator(username);
//   //   }
//   // }, [username]);

//   const startTimer = () => {
//     // Implement start voting logic
//   };

//   return (
//     <div>
//       <h1>Room Details</h1>
//       <p>Username: {username}</p>
//       <p>Room ID: {roomId}</p>
//       <p>Room Creator: {roomCreator}</p>
//       {username === roomCreator && (
//         <button onClick={startTimer}>Start timer</button>
//       )}
//     </div>
//   );
// };

// const App: React.FC = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/room/:roomId/:username" element={<Room />} />
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;
