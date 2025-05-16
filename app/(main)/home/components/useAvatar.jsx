"use client";

import React from "react";
import Image from "next/image";

function UserAvatar({ user }) {
  return (
    <>
      {user?.imageUrl ? (
        <Image
          src={user.imageUrl}
          alt="user"
          width={30}
          height={30}
          className="rounded-md mr-3 w-[30px] h-[30px]"
        />
      ) : (
        <div className="flex items-center justify-center w-8 h-8 mr-3 text-white bg-blue-500 rounded-md">
          <span className="font-medium">{user?.firstName?.[0] || "H"}</span>
        </div>
      )}
    </>
  );
}

export default UserAvatar;
