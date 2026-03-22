import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
// import { useLoginWithGoogleMutation } from "../../redux/services/apiSlice";
import { useLoginWithGoogleMutation } from "@/redux/services/apiSlice";
// import { useLoginWithGoogleMutation } from "../../redux/services/apiSlice";

const GoogleLoginButton = ({ handleSuccess, buttonTitle }) => {
  // const [loginWithGoogle] = useLoginWithGoogleMutation();
  const clientId = process.env.GOOGLE_CLIENT_ID;

  console.log(clientId, "Client ID");

  return (
    <GoogleOAuthProvider
      clientId={
        "632857447223-m528ca3fhri1t7gro9uien1rumtlk93c.apps.googleusercontent.com"
      }
    >
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.log("Google login failed")}
        text={buttonTitle === "Sign Up" ? "signup_with" : "signin_with"}
        size="large"
        shape="rectangular"
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;
