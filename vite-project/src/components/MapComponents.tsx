import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { Marker, Popup, MapContainer, TileLayer } from "react-leaflet";
import { io, Socket } from "socket.io-client";

interface Marker {
  lat: number;
  lng: number;
  locationId: string; // Add locationId here for tracking
}

const MapComponent = () => {
  const [markers, setMarkers] = useState<Marker[]>([
    // { lat: 51.505, lng: -0.09, locationId: "0" }, // Initial marker with an locationId
  ]);
  const [socket, setSocket] = useState<Socket | null>(null); // Use Socket type or null

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDraggableMarker, setIsDraggableMarker] = useState(false);
  const latLangFAkeData = [
    {
      locationId: "1",
      lat: 51.51765293492706,
      lng: -0.1316176278800385,
      timeLocation: "20:50:55",
    },
    {
      locationId: "2",
      lat: 51.51956207309098,
      lng: -0.09370343259316406,
      timeLocation: "12:40:00",
    },
    {
      locationId: "3",
      lat: 51.51645462737917,
      lng: -0.060592845758917775,
      timeLocation: "10:30:50",
    },
  ];

  const addMarker = () => {
    if (currentIndex < latLangFAkeData.length) {
      const { lat, lng, locationId, timeLocation } =
        latLangFAkeData[currentIndex];
      setMarkers((prevMarkers) => [
        ...prevMarkers,
        { lat, lng, locationId: locationId },
      ]);
      setCurrentIndex((prevIndex) => prevIndex + 1);
      const randomNum = Math.floor(Math.random() * 1000);
      const locationData = {
        lat,
        lng,
        locationId: Date.now() + `-${randomNum}`,
        timeLocation,
      }; // Generate a unique ID
      const test = socket?.emit("addLocation", locationData); // Emit the addLocation event
      console.log(test, "Socket emit");
    }
  };

  // const removeData = (locationId: string) => {
  //   socket?.emit("deleteLocation", { id: locationId });
  //   const removeMarker = markers.filter(
  //     (mark) => mark.locationId !== locationId
  //   );

  //   setMarkers(removeMarker);
  // };


  const removeData = (id: string) => {
    // Emit delete event to the server using the correct ObjectID
    socket?.emit("deleteLocation", { id: id }); // Ensure this is the ObjectID
    const removeMarker = markers.filter((mark) => mark.locationId !== id);
    setMarkers(removeMarker);
  };
  

  const getCruunetPositionMarker = (
    locationId: string,
    newLat: number,
    newLng: number
  ) => {
    setMarkers((prevMarkers) =>
      prevMarkers.map((marker) =>
        marker.locationId === locationId
          ? { ...marker, lat: newLat, lng: newLng }
          : marker
      )
    );
  };

  // locationId: string
  const ActiveDragableMarker = () => {
    setIsDraggableMarker((prev) => !prev); // Toggle draggable state

    // const findMArker = markers.filter((mark) => mark.locationId === locationId);
    // console.log(findMArker, "findmarker");
    // if (findMArker && locationId) {

    // }
  };
  useEffect(() => {
    const newSocket = io("http://localhost:8090"); // Replace with your backend URL
    setSocket(newSocket);

    // newSocket.on("locationAdded", (location) => {
    //   console.log(location, "location in the useEffect");
    //   // setMarkers((prevMarkers) => [
    //   //   ...prevMarkers,
    //   //   {
    //   //     lat: location.lat,
    //   //     lng: location.lng,
    //   //     locationId: location.locationId,
    //   //     timeLocation:location.timeLocation

    //   //   },
    //   // ]);

    //   // Listen for locationAdded event

    // });
    newSocket.on("locationAdded", (location) => {
      console.log(location, "location in the useEffect");

      // Send the current markers to the socket
      newSocket.emit("sendMarkers", markers); // Emit markers to the server
    });
    return () => {
      newSocket.disconnect();
    };
  }, []);
  return (
    <div className="flex flex-col items-center">
      <div className="flex">
        <button
          onClick={addMarker}
          className="mx-2 mb-4 p-2 bg-blue-500 text-white rounded"
        >
          Add Marker
        </button>
        <button
          onClick={() => {
            ActiveDragableMarker();
          }}
          className="mb-4 p-2 bg-green-800 text-white rounded"
        >
          {isDraggableMarker ? "Disable Dragging" : "Enable Dragging"}
        </button>
      </div>
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "50vh", width: "50vw" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://map.pishgamanasia.ir">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker) => (
          <Marker
            key={marker.locationId}
            position={[marker.lat, marker.lng]}
            draggable={isDraggableMarker} // Draggable based on state
            eventHandlers={{
              dragend: (e) => {
                const newLatLng = e.target.getLatLng(); // Get new coordinates
                getCruunetPositionMarker(
                  marker.locationId,
                  newLatLng.lat,
                  newLatLng.lng
                ); // Update marker position
                e.sourceTarget._element.src = "/public/marker-icon.png"; // Ensure this path is correct
              },
              dragstart: (e) => {
                console.log("Drag started for marker:", marker.locationId);
                e.sourceTarget._icon.src = "/public/Marker_green-512.webp";
              },
            }}
            data-locationId={marker.locationId} // Optional, if you need to reference the locationId
          >
            <Popup>
              <div>
                Marker at [{marker.lat}, {marker.lng}]
                <button
                  onClick={() => removeData(marker.locationId)}
                  style={{ marginLeft: "10px", cursor: "pointer" }}
                >
                  <span className="text-lg">delete</span>
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div>
        {markers.map((mark) => (
          <ul
            className="flex justify-evenly text-center items-center w-full p-3 m-3"
            key={mark.locationId}
          >
            <li className="text-lg p-3 font-bold rounded-md bg-green-200">
              lat: {mark.lat}
            </li>
            <li className="text-lg p-3 font-bold rounded-md bg-green-200">
              lng: {mark.lng}
            </li>
            <button
              className="bg-gray-400 p-3 text-gray-800 text-lg"
              onClick={() => removeData(mark.locationId)}
            >
              Delete
            </button>
          </ul>
        ))}
      </div>
    </div>
  );
};

export default MapComponent;
