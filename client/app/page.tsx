"use client";

import Image from "next/image";
import { Pacifico } from "next/font/google";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import getUrqlClient from "@/utils/getUrqlClient";
import { graphql } from "@/generated";

const pacifico = Pacifico({ weight: "400", subsets: ["latin"] });

interface Inputs {
  usernameOrEmail: string;
  password: string;
}

const Login = () => {
  const client = getUrqlClient();

  const query = graphql(`
    query Test {
      test
    }
  `);

  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<Inputs>({
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<Inputs> = async (inputs) => {
    const { data } = await client.query(query, {});
    console.log(data);
  };

  return (
    <div id="Home" className="m-auto h-screen flex items-center justify-center">
      <div>
        <Image src="/home-phones.png" alt="phone" width={450} height={500} />
      </div>
      <div className="flex flex-col gap-4 w-80">
        <div className="border-[1px] border-slate-300 border-solid text-center px-10 py-5 rounded">
          <h1 className={`mt-5 mb-10 text-4xl ${pacifico.className}`}>
            Instaclone
          </h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              className="block border-[1px] border-slate-300 border-solid p-2 text-xs w-full mb-3 focus:border-slate-400 focus:outline-none rounded"
              type="text"
              placeholder="Username or email"
              {...register("usernameOrEmail", {
                required: true,
                minLength: 4,
              })}
            />
            <input
              className="block border-[1px] border-slate-300 border-solid p-2 text-xs w-full mb-3 focus:border-slate-400 focus:outline-none rounded"
              type="password"
              placeholder="Password"
              {...register("password", {
                required: true,
                minLength: 8,
              })}
            />
            <button
              className="bg-blue-500 disabled:opacity-70 w-full text-white p-2 rounded-lg text-sm font-bold enabled:hover:bg-blue-600"
              type="submit"
              disabled={!isValid}
            >
              Log in
            </button>
          </form>
          <hr className="border-b-[1px] border-slate-200 border-solid my-3" />
          <Link className="text-blue-900 text-xs" href="/reset-password">
            Forgot password?
          </Link>
        </div>
        <div className="border-[1px] border-slate-300 border-solid px-10 py-5 text-center">
          <p className="text-sm">
            Don't have an account?{" "}
            <Link className="text-blue-500 font-bold" href="/register">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
