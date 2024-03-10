import { SESSION_COOKIE, createAdminClient } from "@/Appwrite";
import FormButton from "./FormButton";
import FormInput from "./FormInput";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ID } from "node-appwrite";

async function signInWithEmail(formData: FormData) {
  "use server";

  const email = formData.get("email");
  const password = formData.get("password");

  if (email === null) {
    throw new Error("Email is required");
  }

  if (password === null) {
    throw new Error("Password is required");
  }

  const { account } = createAdminClient();

  const session = await account.createEmailPasswordSession(
    email.toString(),
    password.toString()
  );

  cookies().set(SESSION_COOKIE, session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });

  redirect("/");
}

async function signUpWithEmail(formData: FormData) {
  "use server";

  const email = formData.get("email");
  const password = formData.get("password");

  if (email === null) {
    throw new Error("Email is required");
  }

  if (password === null) {
    throw new Error("Password is required");
  }

  const { account } = createAdminClient();

  await account.create(ID.unique(), email.toString(), password.toString());
  const session = await account.createEmailPasswordSession(
    email.toString(),
    password.toString()
  );

  cookies().set(SESSION_COOKIE, session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });

  redirect("/");
}

export default async function LoginPage() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <form className="w-96 flex flex-col gap-2" action={signInWithEmail}>
        <h1 className="text-4xl font-semibold mb-3">Login</h1>
        <FormInput
          type="email"
          name="email"
          placeholder="Email address"
          autoComplete="off"
        />
        <FormInput type="password" name="password" placeholder="Password" />
        <FormButton>Login</FormButton>
      </form>
      <div className="w-96 h-px bg-slate-700 my-5" />
      <form className="w-96 flex flex-col gap-2" action={signUpWithEmail}>
        <h1 className="text-4xl font-semibold mb-3">Sign up</h1>
        <FormInput
          type="email"
          name="email"
          placeholder="Email address"
          autoComplete="off"
        />
        <FormInput type="password" name="password" placeholder="Password" />
        <FormButton>Sign up</FormButton>
      </form>
    </div>
  );
}
