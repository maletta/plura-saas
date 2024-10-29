import AgencyDetails from '@/components/forms/agency-details';
import { getAuthUserDetails, verifyAndAcceptInvitation } from '@/lib/queries';
import { currentUser } from '@clerk/nextjs/server'
import { Plan } from '@prisma/client';
import { redirect } from 'next/navigation';
import React from 'react'


interface ISearchParams {
  plan: Plan,
  state: string, // acho que vem do stripe para conectarmos contas do stripe na aplicação
  code: string,
}
const Page = async (searchParams: ISearchParams) => {
  // se está entrando com convite e não tem uma conta
  // ao clicar em Login no header da página principal redireciona para (main)/agency/page.tsx
  // verificar se existe convite para criar usuário, ou retorna o agency id caso usuário já exista
  const agencyId = await verifyAndAcceptInvitation();
  console.log("Agency Id ", agencyId);

  // get users details
  const user = await getAuthUserDetails();
  console.log("user details");
  console.dir(user, { depth: null })

  if (agencyId) {
    if (user?.role === 'SUBACCOUNT_GUEST' || user?.role === "SUBACCOUNT_USER") {
      return redirect("/subaccount");
    } else if (user?.role === "AGENCY_OWNER" || user?.role === "AGENCY_ADMIN") {

      if (searchParams.plan) {
        return redirect(`/agency/${agencyId}/billing?plan=${searchParams.plan}`)
      }

      if (searchParams.state) {
        const statePath = searchParams.state.split("__")[0];
        const stateAgencyId = searchParams.state.split("___")[1]// 2 ou 3 _
        if (!stateAgencyId) return <div>Not authorized</div>

        // code confirma se a operação deu certo ou não
        return redirect(`/agency/${stateAgencyId}/${statePath}?code=${searchParams.code}`);
      } else {
        return redirect(`/agency/${agencyId}`);
      }
    } else {
      return <div>Not authorized</div>
    }
  }

  // tudo falha, não tem subaccount, não tem agency, não tem nada que satisfaça os planos do stripe e coisas do tipo
  // então precisará criar uma agência para si
  const authUser = await currentUser();

  return <div className='flex justify-center items-center mt-4'>
    <div className="max-w-[850px] border-[1px] p-4 rounded-xl">
      <h1 className='text-4xl'> Create An Agency</h1>
      <AgencyDetails data={{ companyEmail: authUser?.emailAddresses[0].emailAddress }} />
    </div>
  </div>

}




export default Page