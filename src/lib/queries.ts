"use server"

import { clerkClient, currentUser } from "@clerk/nextjs/server"
import { db } from "./db";
import { User } from "@prisma/client";
import { redirect } from "next/navigation";
import * as constants from "./constants"
import Constants from "@/constants/constants";

export const getAuthUserDetails = async () => {
  const user = await currentUser();
  if (!user) {
    return;
  }

  const userData = await db.user.findUnique({
    where: { email: user.emailAddresses[0].emailAddress },
    include: {
      Agency: {
        include: {
          SidebarOption: true,
          SubAccount: {
            include: {
              SidebarOption: true
            }
          }
        }
      },
      Permissions: true,
    }
  });

  return userData;
}

export const saveActivityLogsNotification = async ({
  agencyId, description, subaccountId
}: {
  agencyId?: string,
  description: string,
  subaccountId?: string
}) => {
  const authUser = await currentUser();
  let userData;
  if (!authUser) {
    // se é um contato, por exemplo, que não é um usuário autorizado
    // precisamos achar um outro usuário que pertence a esta subaccount ou esta conta e assinar essa atividade
    const response = await db.user.findFirst({
      where: {
        Agency: {
          SubAccount: {
            some: {
              id: subaccountId
            }
          }
        }
      }
    });

    if (response) {
      userData = response;
    }
  } else {
    userData = await db.user.findUnique({
      where: { email: authUser?.emailAddresses[0].emailAddress },
    });
  }

  if (!userData) {
    console.log("Could not find a user");
    return;
  }

  let foundAgencyId = agencyId;

  // se não tem agency e nem subaccount então procuraremos por elas
  if (!foundAgencyId) {
    if (!subaccountId) {
      throw new Error("You need to provide at least an agency Id or SubAccount Id");
    }
    // as vezes notificações são registradas pelo diretório de SubAccount e é preciso resgatar o agencyId delas
    // tem diretório de rotas em app/(main)/agency  e app/(main)/subaccount
    const response = await db.subAccount.findUnique({
      where: { id: subaccountId },
    });

    if (response) foundAgencyId = response.agencyId;
  }

  // se tem SubAccount, cria notificação com id de SubAccount e Agency, senão só cria notificação com id da Agency
  if (subaccountId) {
    await db.notification.create({
      data: {
        notification: `${userData.name} | ${description}`,
        User: {
          connect: { id: userData.id }
        },
        Agency: {
          connect: { id: foundAgencyId }
        },
        SubAccount: {
          connect: { id: subaccountId }
        }
      }
    })
  } else {
    db.notification.create({
      data: {
        notification: `${userData.name} | ${description}`,
        User: {
          connect: { id: userData.id }
        },
        Agency: {
          connect: { id: foundAgencyId }
        },
      }
    })
  }

}

export const createTeamUser = async (agencyId: string, user: User) => {
  // Se ele já tem acesso return null
  if (user.role === "AGENCY_OWNER") return null;

  const response = await db.user.create({ data: { ...user } });

  return response;
}

export const verifyAndAcceptInvitation = async () => {
  const user = await currentUser();

  if (!user) {
    console.log("NÃO EXISTE USUÁRIO E REDIRECIONARÁ PARA SIGN-IN");
    return redirect("/sign-in");
    // return null;
  }

  const invitationExists = await db.invitation.findUnique({
    where: {
      email: user?.emailAddresses[0].emailAddress,
      status: "PENDING"
    }
  });

  if (invitationExists) {
    const userDetails = await createTeamUser(invitationExists.agencyId, {
      email: invitationExists.email,
      agencyId: invitationExists.agencyId,
      avatarUrl: user.imageUrl,
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      role: invitationExists.role,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await saveActivityLogsNotification({
      agencyId: invitationExists?.agencyId,
      description: `Joined`,
      subaccountId: undefined,
    });

    // se criou o usuário então atualiza o clerck e deleta o convite
    // e retorna o agencyId
    if (userDetails) {
      await clerkClient.users.updateUserMetadata(user.id, {
        privateMetadata: {
          role: userDetails.role || "SUBACCOUNT_USER"
        }
      });

      await db.invitation.delete({
        where: { email: userDetails.email }
      })

      return userDetails.agencyId;
    } else {
      return null;
    }

  } else {
    // se o convite não existe, retorna o agencyId vinculado com o email, caso exista
    const agency = await db.user.findUnique({
      where: {
        email: user.emailAddresses[0].emailAddress,
      }
    });

    return agency ? agency.agencyId : null
  }
}

