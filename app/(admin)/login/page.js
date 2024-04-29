import React from "react";
import AuthProviders from "./AuthProviders";
import LoginForm from "./LoginForm";

const Login = () => {

  return (
    <>
      <div className="w-full h-full pt-40">
        <div className="container mx-auto px-4 h-full">
          <div className="flex content-center items-center justify-center h-full">
            <div className="w-full lg:w-4/12 px-4">
              <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
                <div className="rounded-t mb-0 px-6 py-6">
                  <div className="text-center mb-3">
                    <h6 className="text-blueGray-500 text-sm font-bold">
                      Sign in with
                    </h6>
                  </div>
                  <AuthProviders></AuthProviders>
                  <hr className="mt-6 border-b-1 border-blueGray-300" />
                </div>
                <LoginForm></LoginForm>
              </div>
              <div className="flex flex-wrap mt-6 relative">
                <div className="w-1/2">
                </div>
                <div className="w-1/2 text-right">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login

export const metadata = {
  title: "Login | Research Study",
  description: "",
};