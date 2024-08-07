import { EnvelopeIcon, PhoneIcon, MagnifyingGlassIcon, PencilSquareIcon } from '@heroicons/react/20/solid'
import {MapContainer, TileLayer, Polygon} from 'react-leaflet'


export type CardLocation = {
  id: string;
  centroid: [number, number]; // Centroid of the poly
  points: number[][]; // Points forming the poly
  name: string
  readableArea: string; // Suburb name
  createdAt: string;
};

export default function LocationCard(props: { location: CardLocation[]}) {
  const { location } = props
  return (
    <li
      key={location.email}
      className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow"
    >
      <div className="flex flex-1 flex-col">

        <MapContainer
          className="mx-auto h-48 w-full flex-shrink-0"
          center={location.centroid}
          zoom={16}
          dragging={false}
          doubleClickZoom={false}
          scrollWheelZoom={false}
          attributionControl={false}
          zoomControl={false}>
        <TileLayer
            attribution=''
            //url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png"
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Polygon pathOptions={{color: "purple"}} positions={location.points} />
        </MapContainer>

        <h3 className="mt-6 text-sm font-medium text-gray-900">
          {location.name}
        </h3>
        <dl className="mt-1 flex flex-grow flex-col justify-between">
          <dt className="sr-only">Title</dt>
          <dd className="text-sm text-gray-500">{location.readableArea}</dd>
          <dt className="sr-only">Role</dt>
          <dd className="mt-3">
          </dd>
        </dl>
      </div>
      <div>
        <div className="-mt-px flex divide-x divide-gray-200">
          <div className="flex w-0 flex-1">
            <a
              className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
            >
              <MagnifyingGlassIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              View
            </a>
          </div>
          <div className="-ml-px flex w-0 flex-1">
            <a
              className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
            >
              <PencilSquareIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              Edit
            </a>
          </div>
        </div>
      </div>
    </li>
  );
}
