import { Fragment, useEffect, useState } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import {
  MapContainer,
  Polygon,
  TileLayer,
  FeatureGroup,
  Circle,
  useMap,
} from "react-leaflet";
import { EditControl, DrawEvents } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import {type LatLngBoundsExpression} from "leaflet"
import { useLocation } from "react-router-dom";
import useLocationApi from "../api/location";

enum ModalState {
  Map,
  Form,
}

const polygonStyle = { color: "#4f46e5", fillColor: "#4f46e5" };

export default function AddLocationModal(props: {open, setOpen}) {
  const [selectedLocation, setSelectedLocation] = useState<[[number]] | null>(
    null,
  );
  const [selectedLocationBounds, setSelectedLocationBounds] = useState<LatLngBoundsExpression | null>(null);
  const [modalState, setModalState] = useState<ModalState>(ModalState.Map);
  const [locationName, setLocationName] = useState<string | null>(null);
  const {open, setOpen} = props;

  const locationApi = useLocationApi()

  const createLocation = async () => {
    if (!selectedLocation) {
      console.error("Error: location coords aren't set");
      return
    }

    // For postgis, we need to close the polygon by making it start where it ends
    const completedPolygon = selectedLocation;
    completedPolygon.push(selectedLocation[0]);

    const apiResponse = await locationApi.createLocation(completedPolygon, locationName);
    if (apiResponse.error) {
      console.error("Failed to submit location to database");
    } else {
      closeModal();
    }
  }

  useEffect(() => {
    //console.log(selectedLocation);
  }, [selectedLocation])

  const closeModal = () => {
    setModalState(ModalState.Map);
    setSelectedLocation(null);
    setSelectedLocationBounds(null)
    setLocationName(null);
    setOpen(false);
  }

  return (
    <Transition show={open}>
      <Dialog className="relative z-[1001]" onClose={setOpen}>
        <TransitionChild
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        {modalState == ModalState.Map && (
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <TransitionChild
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                  {/* Map */}
                  <AddLocationMap
                    selectedLocation={selectedLocation}
                    setSelectedLocation={setSelectedLocation}
                    selectedLocationBounds={selectedLocationBounds}
                    setSelectedLocationBounds={setSelectedLocationBounds}
                    open={open}
                  />
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                      onClick={() => {
                        if (selectedLocation){
                          setModalState(ModalState.Form);
                        } else {
                          console.error("Must select a polygon before going to the next page");
                        }
                      }}
                    >
                      Select Location
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setOpen(false)}
                      data-autofocus
                    >
                      Cancel
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        )}

        {modalState == ModalState.Form && (
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <TransitionChild
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                  <div className="h-[64vh] flex flex-row justify-center">
                    <div className="flex flex-col justify-center max-w-xl">
                      {/* Location details form */}
                      <div>
                        <h2 className="text-xl pb-3">Name your new location</h2>
                        <div className="max-h-14 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                          <label
                            htmlFor="name"
                            className="block text-xs font-medium text-gray-900"
                          >
                            Name
                          </label>
                          <input
                            value={locationName}
                            onChange={(e) => (setLocationName(e.target.value))}
                            type="text"
                            name="name"
                            id="name"
                            className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            placeholder="My great new location"
                          />
                        </div>
                        <MapContainer
                          key={JSON.stringify(selectedLocationBounds)} // Force re-render
                          className="mt-8"
                          style={{ height: "28vh", width: "28vh" }}
                          bounds={selectedLocationBounds}

                          //center={[-27.497581662147017, 153.0133274488911]}
                          zoom={17}
                          minZoom={10}
                          maxZoom={19}
                          zoomControl={false}
                          scrollWheelZoom={true}
                        >
                          <TileLayer
                            attribution=""
                            //url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png"
                            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                          />
                          <MapRerenderHotFix open={open} />

                          <Polygon positions={selectedLocation.map((pair) => [pair[1], pair[0]])} pathOptions={polygonStyle}/>

                        </MapContainer>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                      onClick={createLocation}
                    >
                      Create Location
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setModalState(ModalState.Map)}
                      data-autofocus
                    >
                      Back
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        )}
      </Dialog>
    </Transition>
  );
}

function AddLocationMap(props: {
  selectedLocation: [[number]] | null;
  setSelectedLocation: React.Dispatch<React.SetStateAction<[[number]] | null>>;
  selectedLocationBounds: [[number]] | null;
  setSelectedLocationBounds: React.Dispatch<React.SetStateAction<LatLngBoundsExpression | null>>
  open: boolean
}) {

  const updatePolygonState = (polyEvent: DrawEvents.Edited) => {
    const flattenedLocation = polyEvent.layer._latlngs[0].map(
      (pair: { lat: number; lng: number }) => {
        return [pair.lng, pair.lat];
      },
    );

    props.setSelectedLocation(flattenedLocation);
    props.setSelectedLocationBounds(polyEvent.layer._bounds);
  };

  return (
    <>
      <MapContainer
        className=""
        style={{ height: "64vh" }}
        center={[-27.497581662147017, 153.0133274488911]}
        zoom={17}
        minZoom={10}
        maxZoom={19}
        zoomControl={false}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution=""
          //url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png"
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FeatureGroup>
          <EditControl
            position="topright"
            onEdited={updatePolygonState}
            onCreated={updatePolygonState}
            onDeleted={updatePolygonState}
            draw={{
              rectangle: false,
              circle: false,
              polyline: false,
              polygon: true,
              marker: false,
              circlemarker: false,
            }}
          />
        </FeatureGroup>
        <MapRerenderHotFix open={open} />
      </MapContainer>
    </>
  );
}

// Opening and closing the modal causes leaflet to break, this forces a re-render, fixing the issue.
function MapRerenderHotFix(props: any) {
  const map = useMap();
  map.invalidateSize()
  return <></>
}
