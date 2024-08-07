import React, { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { useParams } from 'react-router-dom';
import LocationCard, { CardLocation } from '../components/locationCard';

interface UserProfile {
  userId: string;
  username: string;
  userLevel: string;
  imageUrl: string;
  locations: CardLocation[];
  comments: Array<{
    locationId: string;
    content: string;
  }>;
}

const fakeUserProfile: UserProfile = {
  userId: "user123",
  username: "Anthony Longhurst",
  userLevel: "Gold Member",
  imageUrl: 'https://media.licdn.com/dms/image/D5603AQHdw96DlhFDYQ/profile-displayphoto-shrink_800_800/0/1701911816827?e=2147483647&v=beta&t=_ymH0TKDV7Mn5iHCcTXkIEEOmKaZXlVQ_lC4xxMqyys',
  locations: [
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
      name: "Anthony's house",
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
  ],
  comments: [
    {
      locationId: "1",
      content: "Great place to relax and read a book."
    },
    {
      locationId: "2",
      content: "Love how quiet it is here."
    }
  ]
};

export default function Profile() {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const { jwt } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      // Use fake data if the userId is 'user123'
      if (userId === 'user123') {
        setProfile(fakeUserProfile);
      } else {
        try {
          const response = await fetch(`http://localhost:8080/profile/${userId}`, {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          });
          if (!response.ok) {
            throw new Error('Failed to fetch profile data');
          }
          const data = await response.json();
          setProfile(data);
        } catch (error) {
          console.error(error);
          setProfile(fakeUserProfile);  // Use fake profile on error
        }
      }
    };

    fetchProfile();
  }, [userId, jwt]);
  
  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl pt-8 lg:flex lg:gap-x-16 lg:px-8">
      <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
      <div className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
        <div className="mx-auto max-w-4xl space-y-12 sm:space-y-16 lg:mx-0 lg:max-w-none">
          <div className="flex items-center space-x-4">
            <img src={profile.imageUrl} alt={profile.username} className="h-24 w-24 rounded-full" />
            <div>
              <h2 className="text-lg font-bold text-gray-900">{profile.username}</h2>
              <p className="text-sm text-gray-500">Level: {profile.userLevel}</p>
              <div className="mt-4">
                <h2 className="text-lg font-medium text-gray-900">Other Comments</h2>
                <ul className="list-disc pl-5 space-y-2">
                  {profile.comments.map(comment => (
                    <li key={comment.locationId} className="text-sm text-gray-800">
                      {comment.content} (Location ID: {comment.locationId})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <section className="overflow-x-auto">
            <h2 className="text-lg font-medium text-gray-900">Locations & Comments</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {profile.locations.map(location => (
                <LocationCard key={location.id} location={location} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}


