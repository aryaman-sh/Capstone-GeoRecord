import { BellIcon } from "@heroicons/react/24/outline";
import Thread from "../components/thread";
import Map from "../components/map";
import { useParams } from "react-router-dom";

export default function Root() {
  const { location_id } = useParams();

  return (
    <>
      {/* 3 column wrapper */}
      <div className="h-full overflow-hidden mx-auto w-full grow lg:flex">
        {/* Left sidebar & main wrapper */}
        {!location_id && (
          <div className="lg:flex lg:flex-1 lg:flex-row lg:justify-center h-full w-full lg:w-4/12 px-6 py-6">
            {/* Left area */}
            <div className="lg:mt-48">
              <p className="text-gray-400">Please select a location to begin</p>
            </div>
          </div>
        )}

        {location_id && (
          <div className="lg:flex lg:flex-1 lg:flex-row lg:justify-end h-full w-full lg:w-4/12 px-6 py-6">
            {/* Left area */}
            <div className="lg:max-w-xl w-full">
              <Thread />
            </div>
          </div>
        )}

        <div className="h-full shrink-0 border-t border-gray-200 w-screen lg:w-8/12">
          {/* Right area */}
          <Map />
        </div>
      </div>
    </>
  );
}
