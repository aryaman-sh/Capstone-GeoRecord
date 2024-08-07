import LocationCard, { CardLocation } from '../components/locationCard'
import { GlobeAltIcon } from "@heroicons/react/24/outline";


const locations: CardLocation[] = [
  {
    id: "1",
    name: 'The Great Court',
    centroid: [-27.497581662147017, 153.0133274488911],
    points: [
      [-27.49736739085346, 153.01206027531853],
      [-27.496789950816307, 153.01424840417872],
      [-27.497767930235526, 153.01406489380034],
      [-27.498086382631744, 153.01281191085573]
    ],
    readableArea: "St. Lucia",
    createdAt: "2 days ago"
},
{
  id: "2",
  name: 'Anythony\'s house',
  centroid: [-27.470730887066743, 153.0041482968109],
  points: [
    [-27.470730887066743, 153.00380793334307],
    [-27.470498436815415, 153.0044259617452],
    [-27.470701085779872, 153.00449761721214],
    [-27.470886546027447, 153.0039023079816]
  ],
  readableArea: "Milton",
  createdAt: "2 days ago"
}
]

export default function Locations() {
  if (locations.length > 0) {
  return (
    <div className='w-full p-7'>
    <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {locations.map((location: CardLocation) => (
        <LocationCard location={location} />
      ))}
    </ul>
    </div>
  )} else {
    return (
      <div className='flex flex-row justify-center'>
      <button
        type="button"
        className="max-w-xs my-32 relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        <GlobeAltIcon className="mx-auto h-12 w-12 text-gray-400" />
        <span className="mt-2 block text-sm font-semibold text-gray-900">Create your first polygon</span>
      </button>
      </div>
    )
  }
}
