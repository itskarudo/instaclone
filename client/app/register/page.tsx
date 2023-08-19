"use client";

import { Pacifico } from "next/font/google";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import getUrqlClient from "@/utils/getUrqlClient";
import { graphql } from "@/generated";
import { useRouter } from "next/navigation";
import { useState } from "react";

const pacifico = Pacifico({ weight: "400", subsets: ["latin"] });

interface Inputs {
  username: string;
  email: string;
  fullName: string;
  password: string;
}

const Login = () => {
  const router = useRouter();
  const client = getUrqlClient();

  const [passwordHidden, setPasswordHidden] = useState(true);

  const mutation = graphql(`
    mutation Register($data: RegisterInput!) {
      register(data: $data) {
        id
      }
    }
  `);

  const {
    register,
    watch,
    handleSubmit,
    formState: { isValid },
  } = useForm<Inputs>({
    mode: "onChange",
  });

  const password = watch("password");

  const onSubmit: SubmitHandler<Inputs> = async (inputs) => {
    const { error } = await client.mutation(mutation, {
      data: inputs,
    });

    if (!error) await router.push("/");
  };

  return (
    <div id="Home" className="m-auto h-screen flex items-center justify-center">
      <div className="flex flex-col gap-4 w-80">
        <div className="border-[1px] border-slate-300 border-solid text-center px-10 py-5 rounded">
          <h1 className={`my-5 text-4xl ${pacifico.className}`}>Instaclone</h1>
          <p className="text-gray-500 font-bold my-4">
            Sign up to see photos and videos from your friends.
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <input
                className="border-[1px] border-slate-300 border-solid p-2 text-xs w-full mb-3 focus:border-slate-400 focus:outline-none rounded"
                type="email"
                placeholder="Email"
                {...register("email", {
                  required: true,
                })}
              />
            </div>
            <div>
              <input
                className="border-[1px] border-slate-300 border-solid p-2 text-xs w-full mb-3 focus:border-slate-400 focus:outline-none rounded"
                type="text"
                placeholder="Full Name"
                {...register("fullName", {
                  required: true,
                })}
              />
            </div>
            <div>
              <input
                className="border-[1px] border-slate-300 border-solid p-2 text-xs w-full mb-3 focus:border-slate-400 focus:outline-none rounded"
                type="text"
                placeholder="Username"
                {...register("username", {
                  required: true,
                })}
              />
            </div>
            <div className="relative">
              <input
                className="border-[1px] border-slate-300 border-solid p-2 text-xs w-full mb-3 focus:border-slate-400 focus:outline-none rounded"
                type={passwordHidden ? "password" : "text"}
                placeholder="Password"
                {...register("password", {
                  required: true,
                  minLength: 8,
                })}
              />
              <button
                className={`absolute right-2 top-2 text-sm font-bold hover:text-gray-400 ${
                  !password || password.length === 0 ? "hidden" : ""
                }`}
                onClick={() => setPasswordHidden((prev) => !prev)}
              >
                {passwordHidden ? "Show" : "Hide"}
              </button>
            </div>
            <button
              className="bg-blue-500 disabled:opacity-70 w-full text-white p-2 rounded-lg text-sm font-bold enabled:hover:bg-blue-600"
              type="submit"
              disabled={!isValid}
            >
              Sign up
            </button>
          </form>
        </div>
        <div className="border-[1px] border-slate-300 border-solid px-10 py-5 text-center">
          <p className="text-sm">
            Have an account?{" "}
            <Link className="text-blue-500 font-bold" href="/">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
