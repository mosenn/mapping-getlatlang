import { useState } from "react";
import "leaflet/dist/leaflet.css";
import { Marker, Popup, MapContainer, TileLayer } from "react-leaflet";

interface Marker {
  lat: number;
  lng: number;
  id: string; // Add id here for tracking
}

const MapComponent = () => {
  const [markers, setMarkers] = useState<Marker[]>([
    // { lat: 51.505, lng: -0.09, id: "0" }, // Initial marker with an ID
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDraggableMarker, setIsDraggableMarker] = useState(false);
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

  const getCruunetPositionMarker = (
    id: string,
    newLat: number,
    newLng: number
  ) => {
    setMarkers((prevMarkers) =>
      prevMarkers.map((marker) =>
        marker.id === id ? { ...marker, lat: newLat, lng: newLng } : marker
      )
    );
  };

  // id: string
  const ActiveDragableMarker = () => {
    setIsDraggableMarker((prev) => !prev); // Toggle draggable state


    // const findMArker = markers.filter((mark) => mark.id === id);
    // console.log(findMArker, "findmarker");
    // if (findMArker && id) {

    // }
  };

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
            key={marker.id}
            position={[marker.lat, marker.lng]}
            draggable={isDraggableMarker} // Draggable based on state
            eventHandlers={{
              dragend: (e) => {
                const newLatLng = e.target.getLatLng(); // Get new coordinates
                getCruunetPositionMarker(
                  marker.id,
                  newLatLng.lat,
                  newLatLng.lng
                ); // Update marker position
                e.sourceTarget._element.src = "/public/marker-icon.png"; // Ensure this path is correct
              },
              dragstart: (e) => {
                console.log("Drag started for marker:", marker.id);
                e.sourceTarget._icon.src = "/public/Marker_green-512.webp";
             
              },
            }}
            data-id={marker.id} // Optional, if you need to reference the id
          >
            <Popup>
              <div>
                Marker at [{marker.lat}, {marker.lng}]
                <button
                  onClick={() => removeData(marker.id)}
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
          <ul key={mark.id}>
            <li>lat: {mark.lat}</li>
            <li>lng: {mark.lng}</li>
            <button onClick={() => removeData(mark.id)}>Delete</button>
          </ul>
        ))}
      </div>
    </div>
  );
};

export default MapComponent;
