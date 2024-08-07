import { Fragment, useState, useEffect, useCallback } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import {
  FaceFrownIcon,
  FaceSmileIcon,
  FireIcon,
  HandThumbUpIcon,
  HeartIcon,
  PaperClipIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { Listbox, Transition } from "@headlessui/react";
import { useThreads } from "../api/threadAPI";
import { useComments } from "../api/comments";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function DisplayThread(threadData) {
  /// gets payload and displays it
  const id = threadData.data[0].id;
  const title = threadData.data[0].title;
  const description = threadData.data[0].descript;

  const dummyData = {
    thread_id: "123456789",
    comment: "No Comments Yet",
    user_id: "",
  };

  const threadAPI = useComments();
  const [comments, setComments] = useState([dummyData]);

  useEffect(() => {
    const retrieveThreads = async () => {
      const { data, error } = await threadAPI.threadQuery(id);
      if (error) {
        //console.error(error);
        setComments([dummyData]);
      } else {
        setComments(data);
      }
    };
    retrieveThreads();
  }, [threadData]);

  const refetchComments = useCallback(async () => {
    const { data, error } = await threadAPI.threadQuery(id);
    if (error) {
      console.error(error);
    } else {
      setComments(data);
    }
  }, [threadAPI, id]);

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-2l">{description}</p>
      </div>
      <ul role="list" className="space-y-6">
        {comments.map((curComment, curCommentIdx) => (
          <li key={curComment.id} className="relative flex gap-x-4">
            <div
              className={classNames(
                curCommentIdx === comments.length - 1 ? "h-6" : "-bottom-6",
                "absolute left-0 top-0 flex w-6 justify-center"
              )}
            >
            </div>
            <div className="flex-auto rounded-md p-3 ring-1 ring-inset ring-gray-200">
              <div className="flex justify-between gap-x-4">
                <div className="py-0.5 text-xs leading-5 text-gray-500">
                  <span className="font-medium text-gray-900">
                    {curComment.user_name}
                  </span>{" "}
                  commented at
                  <span className="font-medium text-gray-900">
                    {"  " + new Date(curComment.created_at).getHours() + ":" + new Date(curComment.created_at).getMinutes()}
                  </span>{" "}
                </div>
              </div>
              <p className="text-sm leading-6 text-gray-500">
                {curComment.comment}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <NewCommentsForm threadId={id} refetchComments={refetchComments} />
    </div>
  );
}

const NewCommentsForm = ({ threadId, refetchComments }) => {
  const auth = useAuth();
  const [newCommnet, setNewComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send a POST request to the backend
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL ?? "/api/v1"
        }/threads/comment/${threadId}`,
        {
          method: "POST",
          mode: "cors",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${auth.jwt}`, // notice the Bearer before your token
            "Content-Type": "application/json", // Add this line to specify JSON data
          },
          body: JSON.stringify({
            thread_id: threadId,
            comment: newCommnet,
          }),
        }
      );
      if (response.ok) {
        console.log("Comment created successfully");
        setNewComment(""); // Clear the text area after successful submission
        await refetchComments();
      } else {
        console.error("Failed to create comment");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="mt-6 flex gap-x-3">
      <img
        src="https://media.licdn.com/dms/image/D5603AQHdw96DlhFDYQ/profile-displayphoto-shrink_800_800/0/1701911816827?e=2147483647&v=beta&t=_ymH0TKDV7Mn5iHCcTXkIEEOmKaZXlVQ_lC4xxMqyys"
        alt=""
        className="h-6 w-6 flex-none rounded-full bg-gray-50"
      />
      <form onSubmit={handleSubmit} className="relative flex-auto">
        <div className="overflow-hidden rounded-lg pb-12 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
          <label htmlFor="comment" className="sr-only">
            Add your comment
          </label>
          <textarea
            onChange={(e) => setNewComment(e.target.value)}
            value={newCommnet} // Bind the value of the text area to newCommnet
            rows={2}
            name="comment"
            id="comment"
            className="block w-full resize-none border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
            placeholder="Add your comment..."
          />
        </div>

        <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
          <div className="flex items-center space-x-5">
            <div className="flex items-center">
              <button
                type="button"
                className="-m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
              >
                <PaperClipIcon className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">Attach a file</span>
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Comment
          </button>
        </div>
      </form>
    </div>
  );
};


const ThreadSelector = (props: {location: string}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const thread = useThreads();

  const handleSubmit = async (e: any) => {
    const {data, error} = await thread.createThread(props.location, name, description);
    if (error) {
      console.error(error) // TODO error handling
    }
    console.log(data)
    navigate(0) // TODO do something better than reloading the page
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl text-gray-600">Create a thread for this location</h2>

      <div className="my-3">
        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
          Thread name
        </label>
        <div className="mt-2">
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="My cool new thread"
          />
        </div>
      </div>

      <div className="my-3">
        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
          Thread Description
        </label>
        <div className="mt-2">
          <textarea
            type="text"
            name="name"
            id="name"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="My cool new thread's description"
          />
        </div>
      </div>

      <button type="button" onClick={handleSubmit} className="relative inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-20 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-4">Submit</button>
    </div>
  );
};

export default function Thread() {
  const threadAPI = useThreads();
  const { location_id } = useParams();
  const [threadData, setThreadData] = useState(null);

  useEffect(() => {
    if (location_id) {
      const retrieveThreads = async () => {
        const { data, error } = await threadAPI.threadQuery(location_id);
        if (error) {
          console.error(error);
          setThreadData(null);
        } else {
          setThreadData(data);
        }
      };

      retrieveThreads();
    }
  }, [location_id]);

  return (
    <div className="w-full">
      {threadData === null &&
        <div>
        <ThreadSelector location={location_id} />
        </div>
      }
      {threadData !== null &&
        <div>
          <DisplayThread data={threadData} />
        </div>
      }
    </div>
  );
}
