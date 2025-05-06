import { auth } from '@clerk/nextjs/server';

import prismadb from "@/lib/prismadb";

export const incrementApiLimit = async (value:number) => {
  const { userId } = auth();

  if (!userId) {
    return;
  }

  const userApiLimit = await prismadb.user.findUnique({
    where: { clerkId: userId },
  });

  if (userApiLimit) {
    await prismadb.user.update({
      where: { clerkId: userId },
      data: { usedGenerations: userApiLimit.usedGenerations + value },
    });
  }
};

export const checkApiLimit = async (generationPrice:number) => {
  const { userId } = auth();

  if (!userId) {
    return false;
  }

  const userApiLimit = await prismadb.user.findUnique({
    where: { clerkId: userId },
  });
  if (userApiLimit && userApiLimit.usedGenerations < userApiLimit.availableGenerations && (userApiLimit.availableGenerations - userApiLimit.usedGenerations) >= generationPrice) {
    return true;
  } else {
    return false;
  }
};

export const getApiAvailableGenerations = async () => {
  const { userId } = auth();

  if (!userId) {
    return 0;
  }

  const userApiLimit = await prismadb.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  if (!userApiLimit) {
    return 0;
  }

  return userApiLimit.availableGenerations;
};

export const getApiUsedGenerations = async () => {
  const { userId } = auth();

  if (!userId) {
    return 0;
  }

  const userApiLimit = await prismadb.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  if (!userApiLimit) {
    return 0;
  }

  return userApiLimit.usedGenerations;
};
