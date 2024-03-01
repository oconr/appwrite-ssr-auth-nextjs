import { SESSION_COOKIE, createSessionClient } from "@/Appwrite";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import FormButton from "./login/FormButton";

async function logout() {
  "use server";

  const { account } = createSessionClient(headers());

  cookies().delete(SESSION_COOKIE);
  await account.deleteSession("current");

  redirect("/login");
}

export default async function Home() {
  try {
    const { account } = createSessionClient(headers());
    const user = await account.get();

    return (
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-semibold mb-3">Logged in as</h1>
        <h2 className="text-xl font-medium mb-8">{user.$id}</h2>
        <form action={logout}>
          <FormButton>Logout</FormButton>
        </form>
      </div>
    );
  } catch {
    redirect("/login");
  }
}
