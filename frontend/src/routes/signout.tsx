import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";

export default function SignOut(){
  const auth = useAuth();
  const nagivation = useNavigate();

  useEffect(() => {
    auth.signOut();
    nagivation("/login");
  });

  return <></>
}
