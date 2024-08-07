import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Marker, Popup, MapContainer, TileLayer } from "react-leaflet";
import { io } from "socket.io-client";

interface Marker {
  lat: number;
  lng: number;
  id: string; // Add id here for tracking
}

const socket = io("http://localhost:8090");

const MapComponent = () => {
  //--- leaflet Icon style

  // let markerlength = 0;
  // let Dimoned = L.icon({
  //   iconUrl: "/public/marker1.png",
  //   iconSize: [50, 50], // size of the icon
  // });
  // let MArker2 = L.icon({
  //   iconUrl: "/public/marker2.png",
  //   iconSize: [50, 50], // size of the icon
  // });

  const [markers, setMarkers] = useState<Marker[]>([
    { lat: 51.505, lng: -0.09, id: "0" }, // Initial marker with an ID
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [updatePostionMarker, setUpdatePostionMarker] = useState(false);
  const latLangFAkeData = [
    { id: "1", Lat: 51.51765293492706, Lang: -0.1316176278800385 },
    { id: "2", Lat: 51.51956207309098, Lang: -0.09370343259316406 },
    { id: "3", Lat: 51.51645462737917, Lang: -0.060592845758917775 },
  ];

  const addMarker = () => {
    if (currentIndex < latLangFAkeData.length) {
      const { Lat, Lang, id } = latLangFAkeData[currentIndex];
      setMarkers((prevMarkers) => [
        ...prevMarkers,
        { lat: Lat, lng: Lang, id: id },
      ]);
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const removeData = (id: string) => {
    const removeMarker = markers.filter((mark) => mark.id !== id);
    setMarkers(removeMarker);
  };


  const updateMarkerLatLang = () => {
    setUpdatePostionMarker(!updatePostionMarker);

    
  };
  const getCruunetPositionMarker = (id, newLat, newLng) => {
    setMarkers((prevMarkers) =>
      prevMarkers.map((marker) =>
        marker.id === id ? { ...marker, lat: newLat, lng: newLng } : marker
      )
    );
  };


  const [markerImage, setMarkerImage] = useState("/public/marker-icon.png");
  return (
    <div className="flex flex-col items-center">
      <button
        onClick={addMarker}
        className="mb-4 p-2 bg-blue-500 text-white rounded"
      >
        Add Marker
      </button>
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
            // icon={L.icon({
            //   iconUrl: updatePostionMarker ? markerImage : "/public/marker-icon.png",
            //   iconSize: [50, 50], // size of the icon
            // })} // Use the markerImage state for the icon
            key={marker.id}
            position={[marker.lat, marker.lng]}
            draggable={updatePostionMarker} // Make marker draggable
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target; // Get the dragged marker
                console.log("drag is end", e.sourceTarget._element.src);
                e.sourceTarget._element.src = "/public/marker-icon.png"; // Ensure this path is correct

                const { lat, lng } = marker.getLatLng(); // Get new coordinates
                getCruunetPositionMarker(marker.options.id, lat, lng); // Update marker position
                updateMarkerLatLang()

              },

              
              dragstart: (e) => {
                const marker = e.target;
                console.log(e.sourceTarget._icon.src, "drage start marker");
                // marker._shadow.className='bg-red-300 text-red-300 text-lg w-[350px] h-[350px]'
                e.sourceTarget._icon.src = "/public/Marker_green-512.webp";
               
              },
    
            }}

            
            id={marker.id} // Pass the id to options
          >
            <Popup>
              <div>
                Marker at [{marker.lat}, {marker.lng}]
                <button
                  onClick={() => removeData(marker.id)}
                  style={{ marginLeft: "10px", cursor: "pointer" }}
                >
                  <span className="text-lg">x</span>
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div>
        {markers.map((mark) => (
          <ul key={mark.id}>
            <li>lat: {mark.lat}</li>
            <li>lng: {mark.lng}</li>
            <button onClick={() => removeData(mark.id)}>Delete</button>
            <button onClick={updateMarkerLatLang}>
              {updatePostionMarker ? " now drag marker" : "set new location"}
            </button>
          </ul>
        ))}
      </div>
    </div>
  );
};

export default MapComponent;
