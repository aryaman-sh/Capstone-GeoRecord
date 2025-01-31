import { Fragment, ReactNode, useState } from "react";
import { Disclosure, DisclosureButton, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  XMarkIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import AddLocationModal from "./addLocationModal";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

type MenuItem = {
  name: string;
  href: string;
};

export default function NavBar(props: { children: ReactNode, activeName: string }) {
  const menuItems: MenuItem[] = [
    {
      name: "Map",
      href: "/"
    },
    {
      name: "Your Locations",
      href: "/locations"
    },
  ];

const settingsMenuItems: MenuItem[] = [
  {
    name: "Profile",
    href: "/profile",
  },
  {
    name: "Settings",
    href: "/settings",
  },
  {
    name: "Sign out",
    href: "/signout",
  }
]

const [open, setOpen] = useState(false);


  return (
    <div className="flex min-h-full flex-col">
      <Disclosure as="nav" className="bg-white shadow">
        {({ open }) => (
          <>
            {/* Desktop nav */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 justify-between">
                <div className="flex">
                  <div className="-ml-2 mr-2 flex items-center md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                  <div className="flex flex-shrink-0 items-center">
                    <GlobeAltIcon className="h-9 w-auto text-indigo-600" />
                  </div>
                  <div className="hidden md:ml-6 md:flex md:space-x-8">
                    {/* Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}

                    {menuItems.map((item) => (
                      <Link
                          key={item.name}
                          to={item.href}
                          className={classNames(
                            item.name === props.activeName
                              ? "border-indigo-500 text-gray-900"
                              : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                            "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium",
                          )}
                        >
                          {item.name}
                        </Link>
                    ))}
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => setOpen(true)}
                      type="button"
                      className="relative inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      <PlusIcon
                        className="-ml-0.5 h-5 w-5"
                        aria-hidden="true"
                      />
                      New Location
                    </button>
                  </div>
                  <div className="hidden md:ml-4 md:flex md:flex-shrink-0 md:items-center">
                    <button
                      type="button"
                      className="relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>

                    {/* Profile dropdown */}
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="relative flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                          <span className="absolute -inset-1.5" />
                          <span className="sr-only">Open user menu</span>
                          <img
                            className="h-8 w-8 rounded-full"
                            src="https://media.licdn.com/dms/image/D5603AQHdw96DlhFDYQ/profile-displayphoto-shrink_800_800/0/1701911816827?e=2147483647&v=beta&t=_ymH0TKDV7Mn5iHCcTXkIEEOmKaZXlVQ_lC4xxMqyys"
                            alt=""
                          />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-[1001] mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">

                        {settingsMenuItems.map((item) => (
                        <Menu.Item>
                          {({ active }) => (
                        <Link to={item.href}
                            className="block px-4 py-2 text-sm text-gray-700"
                          >
                            {item.name}
                          </Link>
                          )}
                        </Menu.Item>
                        ))}
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile nav */}
            <Disclosure.Panel className="md:hidden">
              <div className="space-y-1 pb-3 pt-2">
                {/* Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" */}

                {menuItems.map((item) => (
                <Link to={item.href}>
                  <DisclosureButton
                    key={item.name}
                    as="a"
                    className={classNames(
                      props.activeName === item.name ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700',
                      'block border-l-4 py-2 pl-3 pr-4 text-base font-medium sm:pl-5 sm:pr-6'
                    )}
                  >
                    {item.name}
                  </DisclosureButton>
                  </Link>
                ))}

              </div>
              <div className="border-t border-gray-200 pb-3 pt-4">
                <div className="flex items-center px-4 sm:px-6">
                  <div className="flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full"
                      src='https://media.licdn.com/dms/image/D5603AQHdw96DlhFDYQ/profile-displayphoto-shrink_800_800/0/1701911816827?e=2147483647&v=beta&t=_ymH0TKDV7Mn5iHCcTXkIEEOmKaZXlVQ_lC4xxMqyys'
                      alt=""
                    />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">
                      Anthony Longhurst
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                      tom@example.com
                    </div>
                  </div>
                  <button
                    type="button"
                    className="relative ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="mt-3 space-y-1">


                {settingsMenuItems.map((item) => (
                <Link to={item.href}>
                  <Disclosure.Button
                  as="a"
                  href="#"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 sm:px-6"
                >
                  {item.name}
                  </Disclosure.Button>
                  </Link>
                ))}

                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      <AddLocationModal open={open} setOpen={setOpen} />
      {props.children}
    </div>
  );
}
