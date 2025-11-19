import { assets } from "@assets/assets";
import { Star } from "lucide-react";
import { useLogin } from "./use-login";

export const LoginPage = () => {
  const { actions, isLoading } = useLogin();

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <img
        src={assets.bgImage}
        alt="Background image"
        className="absolute top-0 left-0 -z-1 w-full h-full object-cover"
      />

      <div className="flex-1 flex flex-col items-start justify-between p-6 md:p-10 lg:pl-40">
        <img src={assets.logo} alt="Logo" />
        <div>
          <div className="flex items-center gap-3 mb-4 max-md:mt-10">
            <img src={assets.group_users} alt="" className="h-8 md:h-10" />
            <div>
              <div className="flex">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className="size-4 md:size-4.5 text-transparent fill-amber-500"
                    />
                  ))}
              </div>
              <p>Used by 12k+ developers</p>
            </div>
          </div>
          <h1 className="text-3xl md:text-6xl md:pb-2 font-bold bg-gradient-to-r from-indigo-950 to-indigo-800 bg-clip-text text-transparent">
            More than just friends truly connect.
          </h1>
          <p className="text-xl md:text-3xl text-indigo-900 max-w-72 md:max-w-md">
            Connect with global community on pingup
          </p>
        </div>
        <span className="md:h-10"></span>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="flex w-full max-w-[450px] flex-col items-stretch gap-4 px-4 py-3">
          <button
            disabled={isLoading}
            onClick={actions.loginWithGoogle}
            className="group flex min-w-[84px] cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-full h-14 px-5 bg-white dark:bg-gray-800 text-[#1F2937] dark:text-white text-base font-bold leading-normal tracking-[0.015em] w-full border border-gray-200 dark:border-gray-700 transition-all hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewbox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.818 10.1818C21.818 9.40909 21.7514 8.63636 21.6182 7.9H12V12.1818H17.5909C17.3891 13.4364 16.7114 14.5227 15.6941 15.2273V17.8409H19.2136C20.8409 16.3636 21.818 13.5682 21.818 10.1818Z"
                fill="#4285F4"
              ></path>
              <path
                d="M12 22C14.9273 22 17.4545 21.0227 19.2136 19.5455L15.6941 17.8409C14.7164 18.5091 13.4618 18.9091 12 18.9091C9.28364 18.9091 6.96364 17.0727 6.13636 14.5455H2.5V17.25C4.26818 20.2182 7.84091 22 12 22Z"
                fill="#34A853"
              ></path>
              <path
                d="M6.13636 14.5455C5.87818 13.8409 5.72727 13.0682 5.72727 12.2727C5.72727 11.4773 5.87818 10.7045 6.13636 10L2.5 7.29545C1.65909 8.92273 1.18182 10.7591 1.18182 12.2727C1.18182 13.7864 1.65909 15.6227 2.5 17.25L6.13636 14.5455Z"
                fill="#FBBC05"
              ></path>
              <path
                d="M12 5.63636C13.5955 5.63636 14.9818 6.2 16.0364 7.18182L19.2818 4.09091C17.4545 2.42727 14.9273 1.54545 12 1.54545C7.84091 1.54545 4.26818 4.32727 2.5 7.29545L6.13636 10C6.96364 7.47273 9.28364 5.63636 12 5.63636Z"
                fill="#EA4335"
              ></path>
            </svg>
            <span className="truncate">Login with Google</span>
          </button>
          <button
            disabled={isLoading}
            className="group flex min-w-[84px] cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-full h-14 px-5 bg-[#1877F2] text-white text-base font-bold leading-normal tracking-[0.015em] w-full transition-all hover:brightness-110 hover:shadow-lg"
          >
            <svg
              className="h-6 w-6"
              fill="currentColor"
              viewbox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M22 12C22 6.477 17.523 2 12 2S2 6.477 2 12C2 16.99 5.823 21.124 10.5 21.865V14.33H7.5V12H10.5V9.5C10.5 6.533 12.271 5 14.898 5C16.141 5 17.229 5.093 17.5 5.135V7.67H16.012C14.526 7.67 14.223 8.243 14.223 9.13V12H17.272L16.815 14.33H14.223V21.865C18.91 21.124 22 16.99 22 12Z"></path>
            </svg>
            <span className="truncate">Login with Facebook</span>
          </button>
        </div>
      </div>
    </div>
  );
};
