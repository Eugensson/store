import { Metadata } from "next";
import { notFound } from "next/navigation";

import { Orders } from "@/app/profile/orders";
import { MemberInfoForm } from "@/app/profile/member-info-form";

import { getLoggedInMember } from "@/wix-api/members";

import { getWixServerClient } from "@/lib/wix-client.server";

export const metadata: Metadata = {
  title: "Profile",
  description: "Your profile page",
};

const ProfilePage = async () => {
  const wixServerClient = await getWixServerClient();

  const member = await getLoggedInMember(wixServerClient);

  if (!member) notFound();

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-8">
      <h1 className="text-center text-3xl font-bold md:text-4xl">
        Your profile
      </h1>
      <MemberInfoForm member={member} />
      <Orders />
    </main>
  );
};

export default ProfilePage;
